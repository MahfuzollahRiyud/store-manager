<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use HasShopScope, SoftDeletes;

    protected $fillable = [
        'shop_id', 'supplier_id', 'user_id', 'invoice_no', 'purchase_date',
        'subtotal', 'discount', 'additional_cost', 'total',
        'paid_amount', 'due_amount', 'payment_method', 'status', 'notes',
    ];

    protected $casts = [
        'purchase_date'   => 'date',
        'subtotal'        => 'decimal:2',
        'discount'        => 'decimal:2',
        'additional_cost' => 'decimal:2',
        'total'           => 'decimal:2',
        'paid_amount'     => 'decimal:2',
        'due_amount'      => 'decimal:2',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(PurchasePayment::class);
    }

    public function returns(): HasMany
    {
        return $this->hasMany(PurchaseReturn::class);
    }
}
