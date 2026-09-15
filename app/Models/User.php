<?php

namespace App\Models;

use App\Concerns\HasShopScope;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property int|null $shop_id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property bool $is_super_admin
 * @property string $status
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Shop|null $shop
 */
#[Fillable(['shop_id', 'name', 'email', 'phone', 'password', 'is_super_admin', 'status'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasRoles, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'      => 'datetime',
            'password'               => 'hashed',
            'two_factor_confirmed_at'=> 'datetime',
            'is_super_admin'         => 'boolean',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function isShopOwner(): bool
    {
        return $this->hasRole('shop_owner');
    }

    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }

    public function isSalesStaff(): bool
    {
        return $this->hasRole('sales_staff');
    }

    public function isInventoryStaff(): bool
    {
        return $this->hasRole('inventory_staff');
    }

    public function canAccessShop(): bool
    {
        return ! $this->is_super_admin && $this->shop_id !== null;
    }
}
