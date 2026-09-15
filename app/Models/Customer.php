<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasShopScope, SoftDeletes;

    protected $fillable = [
        'shop_id', 'name', 'phone', 'address', 'notes',
        'total_purchase', 'total_paid', 'total_due', 'status',
    ];

    protected $casts = [
        'total_purchase' => 'decimal:2',
        'total_paid'     => 'decimal:2',
        'total_due'      => 'decimal:2',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SalePayment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeHasDue($query)
    {
        return $query->where('total_due', '>', 0);
    }
}
