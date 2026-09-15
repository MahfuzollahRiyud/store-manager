<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    use HasShopScope;

    public $timestamps = false;

    protected $fillable = [
        'shop_id', 'product_id', 'user_id', 'type', 'quantity',
        'unit_cost', 'reference_type', 'reference_id', 'notes', 'created_at',
    ];

    protected $casts = [
        'quantity'   => 'decimal:2',
        'unit_cost'  => 'decimal:2',
        'created_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function isIncoming(): bool
    {
        return in_array($this->type, [
            'purchase', 'return_in', 'adjustment_increase', 'opening_stock',
        ]);
    }
}
