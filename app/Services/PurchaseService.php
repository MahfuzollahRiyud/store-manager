<?php

namespace App\Services;

use App\Concerns\Auditable;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchasePayment;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * Handles all purchase-related business logic.
 *
 * Inventory costing method: Weighted Average Cost (WAC)
 * Formula: new_avg_cost = (current_stock × current_avg_cost + qty × unit_cost)
 *                         / (current_stock + qty)
 */
class PurchaseService
{
    use Auditable;

    /**
     * Create a new purchase with multiple items.
     * Atomically: creates purchase, updates stock, recalculates WAC.
     *
     * @param  array{
     *   supplier_id: int|null,
     *   invoice_no: string|null,
     *   purchase_date: string,
     *   discount: float,
     *   additional_cost: float,
     *   paid_amount: float,
     *   payment_method: string,
     *   notes: string|null,
     *   items: array<array{product_id: int, quantity: float, unit_cost: float}>
     * } $data
     */
    public function create(array $data): Purchase
    {
        return DB::transaction(function () use ($data): Purchase {
            $shopId = Auth::user()->shop_id;

            // 1. Calculate totals
            $subtotal       = 0;
            $validatedItems = [];

            foreach ($data['items'] as $item) {
                $product = Product::withoutGlobalScope('shop')
                    ->where('id', $item['product_id'])
                    ->where('shop_id', $shopId)
                    ->lockForUpdate()
                    ->firstOrFail();

                $itemSubtotal   = round($item['quantity'] * $item['unit_cost'], 2);
                $subtotal      += $itemSubtotal;
                $validatedItems[] = [
                    'product'     => $product,
                    'quantity'    => $item['quantity'],
                    'unit_cost'   => $item['unit_cost'],
                    'subtotal'    => $itemSubtotal,
                ];
            }

            $discount       = $data['discount'] ?? 0;
            $additionalCost = $data['additional_cost'] ?? 0;
            $total          = round($subtotal - $discount + $additionalCost, 2);
            $paidAmount     = min($data['paid_amount'] ?? 0, $total);
            $dueAmount      = round($total - $paidAmount, 2);

            // 2. Create Purchase record
            $purchase = Purchase::create([
                'shop_id'         => $shopId,
                'supplier_id'     => $data['supplier_id'] ?? null,
                'user_id'         => Auth::id(),
                'invoice_no'      => $data['invoice_no'] ?? null,
                'purchase_date'   => $data['purchase_date'],
                'subtotal'        => $subtotal,
                'discount'        => $discount,
                'additional_cost' => $additionalCost,
                'total'           => $total,
                'paid_amount'     => $paidAmount,
                'due_amount'      => $dueAmount,
                'payment_method'  => $data['payment_method'] ?? 'cash',
                'status'          => $dueAmount <= 0 ? 'paid' : ($paidAmount > 0 ? 'partial' : 'pending'),
                'notes'           => $data['notes'] ?? null,
            ]);

            // 3. Process each item: create PurchaseItem, update stock + WAC
            foreach ($validatedItems as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id'  => $item['product']['id'],
                    'quantity'    => $item['quantity'],
                    'unit_cost'   => $item['unit_cost'],
                    'subtotal'    => $item['subtotal'],
                ]);

                // Recalculate Weighted Average Cost
                $currentStock    = $item['product']->current_stock;
                $currentAvgCost  = $item['product']->avg_cost;
                $newQty          = $item['quantity'];
                $newUnitCost     = $item['unit_cost'];
                $newTotalStock   = $currentStock + $newQty;

                $newAvgCost = $newTotalStock > 0
                    ? round(
                        (($currentStock * $currentAvgCost) + ($newQty * $newUnitCost))
                        / $newTotalStock,
                        4
                    )
                    : $newUnitCost;

                // Update product stock and avg_cost
                $item['product']->update([
                    'current_stock'  => $newTotalStock,
                    'avg_cost'       => $newAvgCost,
                    'purchase_price' => $newUnitCost, // update last purchase price
                ]);

                // 4. Create stock movement record
                StockMovement::create([
                    'shop_id'        => $shopId,
                    'product_id'     => $item['product']['id'],
                    'user_id'        => Auth::id(),
                    'type'           => 'purchase',
                    'quantity'       => $item['quantity'],
                    'unit_cost'      => $item['unit_cost'],
                    'reference_type' => Purchase::class,
                    'reference_id'   => $purchase->id,
                    'notes'          => "Purchase #{$purchase->invoice_no}",
                    'created_at'     => now(),
                ]);
            }

            // 5. Record payment if paid amount > 0
            if ($paidAmount > 0) {
                PurchasePayment::create([
                    'shop_id'        => $shopId,
                    'purchase_id'    => $purchase->id,
                    'user_id'        => Auth::id(),
                    'amount'         => $paidAmount,
                    'payment_method' => $data['payment_method'] ?? 'cash',
                    'payment_date'   => $data['purchase_date'],
                    'notes'          => 'Initial payment on purchase',
                ]);
            }

            // 6. Update supplier totals if supplier selected
            if ($purchase->supplier_id) {
                Supplier::withoutGlobalScope('shop')
                    ->where('id', $purchase->supplier_id)
                    ->increment('total_purchase', $total);

                if ($paidAmount > 0) {
                    Supplier::withoutGlobalScope('shop')
                        ->where('id', $purchase->supplier_id)
                        ->increment('total_paid', $paidAmount);
                }

                Supplier::withoutGlobalScope('shop')
                    ->where('id', $purchase->supplier_id)
                    ->increment('total_due', $dueAmount);
            }

            // 7. Audit log
            $this->audit('purchase.created', $purchase, [], [
                'total' => $total, 'items_count' => count($validatedItems),
            ]);

            return $purchase->load('items.product', 'supplier');
        });
    }

    /**
     * Record an additional payment towards a purchase due.
     */
    public function recordPayment(Purchase $purchase, array $data): PurchasePayment
    {
        return DB::transaction(function () use ($purchase, $data): PurchasePayment {
            $amount = min($data['amount'], $purchase->due_amount);

            if ($amount <= 0) {
                throw new \InvalidArgumentException('Payment amount must be greater than zero.');
            }

            $payment = PurchasePayment::create([
                'shop_id'        => $purchase->shop_id,
                'purchase_id'    => $purchase->id,
                'user_id'        => Auth::id(),
                'amount'         => $amount,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'payment_date'   => $data['payment_date'] ?? now()->toDateString(),
                'notes'          => $data['notes'] ?? null,
            ]);

            $newPaidAmount = $purchase->paid_amount + $amount;
            $newDueAmount  = max(0, $purchase->total - $newPaidAmount);

            $purchase->update([
                'paid_amount' => $newPaidAmount,
                'due_amount'  => $newDueAmount,
                'status'      => $newDueAmount <= 0 ? 'paid' : 'partial',
            ]);

            if ($purchase->supplier_id) {
                Supplier::withoutGlobalScope('shop')
                    ->where('id', $purchase->supplier_id)
                    ->increment('total_paid', $amount);
                Supplier::withoutGlobalScope('shop')
                    ->where('id', $purchase->supplier_id)
                    ->decrement('total_due', $amount);
            }

            $this->audit('purchase.payment', $purchase, [], ['amount' => $amount]);

            return $payment;
        });
    }
}
