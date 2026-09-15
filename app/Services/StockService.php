<?php

namespace App\Services;

use App\Concerns\Auditable;
use App\Models\Product;
use App\Models\StockAdjustment;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockService
{
    use Auditable;

    /**
     * Adjust stock with a mandatory reason.
     * Requires physical count vs. system count.
     */
    public function adjust(array $data): StockAdjustment
    {
        return DB::transaction(function () use ($data): StockAdjustment {
            $shopId = Auth::user()->shop_id;

            $product = Product::withoutGlobalScope('shop')
                ->where('id', $data['product_id'])
                ->where('shop_id', $shopId)
                ->lockForUpdate()
                ->firstOrFail();

            $systemQty    = $product->current_stock;
            $physicalQty  = $data['physical_qty'];
            $adjQty       = round($physicalQty - $systemQty, 2);
            $type         = $adjQty >= 0 ? 'increase' : 'decrease';

            $adjustment = StockAdjustment::create([
                'shop_id'        => $shopId,
                'product_id'     => $product->id,
                'user_id'        => Auth::id(),
                'system_qty'     => $systemQty,
                'physical_qty'   => $physicalQty,
                'adjustment_qty' => $adjQty,
                'type'           => $type,
                'reason'         => $data['reason'],
            ]);

            // Update product stock
            $product->update(['current_stock' => $physicalQty]);

            // Record stock movement
            StockMovement::create([
                'shop_id'        => $shopId,
                'product_id'     => $product->id,
                'user_id'        => Auth::id(),
                'type'           => $adjQty >= 0 ? 'adjustment_increase' : 'adjustment_decrease',
                'quantity'       => $adjQty,
                'unit_cost'      => $product->avg_cost,
                'reference_type' => StockAdjustment::class,
                'reference_id'   => $adjustment->id,
                'notes'          => "Adjustment: {$data['reason']}",
                'created_at'     => now(),
            ]);

            $this->audit('stock.adjusted', $product, ['stock' => $systemQty], ['stock' => $physicalQty, 'reason' => $data['reason']]);

            return $adjustment;
        });
    }
}
