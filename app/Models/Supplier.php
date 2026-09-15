<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasShopScope, SoftDeletes;

    protected $fillable = [
        'shop_id', 'name', 'phone', 'email', 'address', 'notes',
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

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(PurchasePayment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
