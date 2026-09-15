<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures the authenticated user's shop is active.
 * Super admins bypass this check.
 */
class EnsureShopIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Super admins are not bound to any shop, route them to admin panel
        if ($user->is_super_admin) {
            return redirect()->route('admin.dashboard');
        }

        if (! $user->shop_id || ! $user->shop || ! $user->shop->is_active) {
            auth()->logout();

            return redirect()->route('login')->withErrors([
                'email' => 'Your shop account has been deactivated. Please contact support.',
            ]);
        }

        return $next($request);
    }
}
