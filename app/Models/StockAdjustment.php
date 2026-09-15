<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAdjustment extends Model
{
    use HasShopScope;

    protected $fillable = [
        'shop_id', 'product_id', 'user_id',
        'system_qty', 'physical_qty', 'adjustment_qty', 'type', 'reason',
    ];

    protected $casts = [
        'system_qty'    => 'decimal:2',
        'physical_qty'  => 'decimal:2',
        'adjustment_qty'=> 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
