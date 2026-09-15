<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use HasShopScope, SoftDeletes;

    protected $fillable = [
        'shop_id', 'customer_id', 'user_id', 'invoice_no', 'sale_date',
        'subtotal', 'discount', 'total', 'paid_amount', 'due_amount',
        'change_amount', 'total_cost', 'gross_profit',
        'payment_method', 'status', 'notes',
    ];

    protected $casts = [
        'sale_date'    => 'date',
        'subtotal'     => 'decimal:2',
        'discount'     => 'decimal:2',
        'total'        => 'decimal:2',
        'paid_amount'  => 'decimal:2',
        'due_amount'   => 'decimal:2',
        'change_amount'=> 'decimal:2',
        'total_cost'   => 'decimal:2',
        'gross_profit' => 'decimal:2',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SalePayment::class);
    }

    public function returns(): HasMany
    {
        return $this->hasMany(SaleReturn::class);
    }
}
