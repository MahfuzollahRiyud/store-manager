<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $owner_name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $address
 * @property string|null $logo
 * @property string $currency
 * @property string $currency_symbol
 * @property string $invoice_prefix
 * @property bool $is_active
 * @property array|null $settings
 */
class Shop extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'owner_name',
        'phone',
        'email',
        'address',
        'logo',
        'currency',
        'currency_symbol',
        'invoice_prefix',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings'  => 'array',
    ];

    // ── Relationships ──────────────────────────────────────────────

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function getSetting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }

    public function nextInvoiceNumber(?string $prefix = null): string
    {
        $prefix = $prefix ?? $this->invoice_prefix;
        $count  = $this->sales()->withTrashed()->count() + 1;

        return $prefix . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
    }

    public function nextPurchaseNumber(): string
    {
        $prefix = 'PO-';
        $count  = $this->purchases()->withTrashed()->count() + 1;

        return $prefix . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
    }
}
