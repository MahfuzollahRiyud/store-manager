<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Automatically scope all queries to the authenticated user's shop.
 *
 * Usage: add `use HasShopScope;` to any tenant-owned model.
 * The global scope is only applied when a user is authenticated and has a shop_id.
 * Super admins bypass the scope automatically.
 */
trait HasShopScope
{
    public static function bootHasShopScope(): void
    {
        static::addGlobalScope('shop', function (Builder $query) {
            if (Auth::check() && ! Auth::user()->is_super_admin && Auth::user()->shop_id) {
                $query->where(
                    (new static)->getTable() . '.shop_id',
                    Auth::user()->shop_id
                );
            }
        });
    }

    /**
     * Scope to a specific shop (used in admin contexts or tests).
     */
    public function scopeForShop(Builder $query, int $shopId): Builder
    {
        return $query->withoutGlobalScope('shop')->where('shop_id', $shopId);
    }
}
