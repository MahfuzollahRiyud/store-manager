<?php

namespace App\Services;

use App\Concerns\Auditable;
use App\Exceptions\InsufficientStockException;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * Handles all sale-related business logic.
 *
 * Profit calculation uses WAC (Weighted Average Cost):
 *   profit_per_item = (unit_price - avg_cost_snapshot) × quantity
 *
 * The avg_cost is snapshotted from product.avg_cost at the time of sale
 * so historical profit remains accurate even when avg_cost changes later.
 */
class SaleService
{
    use Auditable;

    /**
     * Create a new sale.
     *
     * @param  array{
     *   customer_id: int|null,
     *   sale_date: string,
     *   discount: float,
     *   paid_amount: float,
     *   payment_method: string,
     *   notes: string|null,
     *   items: array<array{product_id: int, quantity: float, unit_price: float}>
     * } $data
     *
     * @throws InsufficientStockException
     */
    public function create(array $data): Sale
    {
        return DB::transaction(function () use ($data): Sale {
            $shopId = Auth::user()->shop_id;

            // 1. Validate and lock all products in a single query batch
            $subtotal       = 0;
            $totalCost      = 0;
            $validatedItems = [];

            foreach ($data['items'] as $item) {
                $product = Product::withoutGlobalScope('shop')
                    ->where('id', $item['product_id'])
                    ->where('shop_id', $shopId)
                    ->where('status', 'active')
                    ->lockForUpdate()
                    ->firstOrFail();

                // Check stock availability
                if ($product->current_stock < $item['quantity']) {
                    throw new InsufficientStockException(
                        "Insufficient stock for {$product->name}. Available: {$product->current_stock}, Requested: {$item['quantity']}"
                    );
                }

                $unitPrice    = $item['unit_price'];
                $unitCost     = $product->avg_cost; // WAC snapshot
                $qty          = $item['quantity'];
                $itemSubtotal = round($qty * $unitPrice, 2);
                $itemCost     = round($qty * $unitCost, 2);
                $itemProfit   = round($itemSubtotal - $itemCost, 2);

                $subtotal  += $itemSubtotal;
                $totalCost += $itemCost;

                $validatedItems[] = [
                    'product'    => $product,
                    'quantity'   => $qty,
                    'unit_price' => $unitPrice,
                    'unit_cost'  => $unitCost,
                    'subtotal'   => $itemSubtotal,
                    'profit'     => $itemProfit,
                ];
            }

            $discount     = $data['discount'] ?? 0;
            $total        = round($subtotal - $discount, 2);
            $paidAmount   = $data['paid_amount'] ?? 0;
            $dueAmount    = max(0, round($total - $paidAmount, 2));
            $changeAmount = $paidAmount > $total ? round($paidAmount - $total, 2) : 0;
            $grossProfit  = round($total - $totalCost, 2);

            // Generate invoice number
            $shop      = Auth::user()->shop;
            $invoiceNo = $shop->nextInvoiceNumber();

            // 2. Create Sale
            $sale = Sale::create([
                'shop_id'        => $shopId,
                'customer_id'    => $data['customer_id'] ?? null,
                'user_id'        => Auth::id(),
                'invoice_no'     => $invoiceNo,
                'sale_date'      => $data['sale_date'],
                'subtotal'       => $subtotal,
                'discount'       => $discount,
                'total'          => $total,
                'paid_amount'    => min($paidAmount, $total),
                'due_amount'     => $dueAmount,
                'change_amount'  => $changeAmount,
                'total_cost'     => $totalCost,
                'gross_profit'   => $grossProfit,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'status'         => $dueAmount <= 0 ? 'paid' : ($paidAmount > 0 ? 'partial' : 'pending'),
                'notes'          => $data['notes'] ?? null,
            ]);

            // 3. Create SaleItems + update stock + create StockMovements
            foreach ($validatedItems as $item) {
                SaleItem::create([
                    'sale_id'    => $sale->id,
                    'product_id' => $item['product']->id,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'unit_cost'  => $item['unit_cost'],
                    'subtotal'   => $item['subtotal'],
                    'profit'     => $item['profit'],
                ]);

                // Deduct stock
                $item['product']->decrement('current_stock', $item['quantity']);

                // Stock movement
                StockMovement::create([
                    'shop_id'        => $shopId,
                    'product_id'     => $item['product']->id,
                    'user_id'        => Auth::id(),
                    'type'           => 'sale',
                    'quantity'       => -$item['quantity'], // negative = out
                    'unit_cost'      => $item['unit_cost'],
                    'reference_type' => Sale::class,
                    'reference_id'   => $sale->id,
                    'notes'          => "Sale #{$sale->invoice_no}",
                    'created_at'     => now(),
                ]);
            }

            // 4. Record payment if paid amount > 0
            if ($paidAmount > 0) {
                SalePayment::create([
                    'shop_id'        => $shopId,
                    'sale_id'        => $sale->id,
                    'customer_id'    => $sale->customer_id,
                    'user_id'        => Auth::id(),
                    'amount'         => min($paidAmount, $total),
                    'payment_method' => $data['payment_method'] ?? 'cash',
                    'payment_date'   => $data['sale_date'],
                    'notes'          => 'Initial payment on sale',
                ]);
            }

            // 5. Update customer totals
            if ($sale->customer_id) {
                Customer::withoutGlobalScope('shop')
                    ->where('id', $sale->customer_id)
                    ->increment('total_purchase', $total);

                if ($paidAmount > 0) {
                    Customer::withoutGlobalScope('shop')
                        ->where('id', $sale->customer_id)
                        ->increment('total_paid', min($paidAmount, $total));
                }

                if ($dueAmount > 0) {
                    Customer::withoutGlobalScope('shop')
                        ->where('id', $sale->customer_id)
                        ->increment('total_due', $dueAmount);
                }
            }

            // 6. Audit log
            $this->audit('sale.created', $sale, [], [
                'total' => $total, 'profit' => $grossProfit,
            ]);

            return $sale->load('items.product', 'customer');
        });
    }

    /**
     * Record a customer payment against their due.
     */
    public function recordCustomerPayment(int $customerId, array $data): SalePayment
    {
        return DB::transaction(function () use ($customerId, $data): SalePayment {
            $shopId   = Auth::user()->shop_id;
            $customer = Customer::withoutGlobalScope('shop')
                ->where('id', $customerId)
                ->where('shop_id', $shopId)
                ->firstOrFail();

            $amount = min($data['amount'], $customer->total_due);

            if ($amount <= 0) {
                throw new \InvalidArgumentException('Payment amount must be greater than zero.');
            }

            $payment = SalePayment::create([
                'shop_id'        => $shopId,
                'sale_id'        => $data['sale_id'] ?? null,
                'customer_id'    => $customerId,
                'user_id'        => Auth::id(),
                'amount'         => $amount,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'payment_date'   => $data['payment_date'] ?? now()->toDateString(),
                'notes'          => $data['notes'] ?? null,
            ]);

            // Update customer totals
            $customer->increment('total_paid', $amount);
            $customer->decrement('total_due', $amount);

            // If linked to specific sale, update that sale's paid/due
            if (! empty($data['sale_id'])) {
                $sale = Sale::withoutGlobalScope('shop')
                    ->where('id', $data['sale_id'])
                    ->where('shop_id', $shopId)
                    ->first();

                if ($sale) {
                    $newPaidAmount = $sale->paid_amount + $amount;
                    $newDueAmount  = max(0, $sale->total - $newPaidAmount);

                    $sale->update([
                        'paid_amount' => $newPaidAmount,
                        'due_amount'  => $newDueAmount,
                        'status'      => $newDueAmount <= 0 ? 'paid' : 'partial',
                    ]);
                }
            }

            $this->audit('customer.payment', $customer, [], ['amount' => $amount]);

            return $payment;
        });
    }
}
