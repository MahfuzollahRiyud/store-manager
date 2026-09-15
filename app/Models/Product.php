<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $shop_id
 * @property int|null $category_id
 * @property int|null $unit_id
 * @property string $name
 * @property string|null $sku
 * @property string|null $barcode
 * @property string|null $brand
 * @property float $purchase_price
 * @property float $selling_price
 * @property float $avg_cost            Weighted Average Cost — used for profit calculation
 * @property float $current_stock
 * @property float $min_stock_level
 * @property string $status
 */
class Product extends Model
{
    use HasShopScope, SoftDeletes;

    protected $fillable = [
        'shop_id',
        'category_id',
        'unit_id',
        'name',
        'sku',
        'barcode',
        'brand',
        'description',
        'image',
        'purchase_price',
        'selling_price',
        'avg_cost',
        'current_stock',
        'min_stock_level',
        'status',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price'  => 'decimal:2',
        'avg_cost'       => 'decimal:2',
        'current_stock'  => 'decimal:2',
        'min_stock_level'=> 'decimal:2',
    ];

    // ── Relationships ──────────────────────────────────────────────

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    // ── Computed / Helpers ─────────────────────────────────────────

    public function isLowStock(): bool
    {
        return $this->current_stock <= $this->min_stock_level && $this->min_stock_level > 0;
    }

    public function getMarginAttribute(): float
    {
        if ($this->selling_price <= 0) {
            return 0;
        }

        return round((($this->selling_price - $this->avg_cost) / $this->selling_price) * 100, 2);
    }

    // ── Scopes ─────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('current_stock', '<=', 'min_stock_level')
            ->where('min_stock_level', '>', 0);
    }
}
