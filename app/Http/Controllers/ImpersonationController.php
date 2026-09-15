<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonationController extends Controller
{
    /**
     * Super Admin enters any shop with 1 click.
     */
    public function enterShop(Request $request, Shop $shop): RedirectResponse
    {
        $currentUser = $request->user();

        if (! $currentUser->is_super_admin) {
            abort(403, 'Unauthorized. Super admin access required.');
        }

        // Find primary shop owner or first active user of this shop
        $targetUser = $shop->users()
            ->where('status', 'active')
            ->first() ?? $shop->users()->first();

        if (! $targetUser) {
            return back()->with('error', 'No user account found for this shop to impersonate.');
        }

        $previousUrl = url()->previous();
        $originalUrl = ($previousUrl && $previousUrl !== url('/') && ! str_ends_with($previousUrl, '/impersonate'))
            ? $previousUrl
            : route('admin.shops.index');

        // Save original super admin state in session
        session([
            'impersonator_id'           => $currentUser->id,
            'impersonator_name'         => $currentUser->name,
            'impersonator_type'         => 'super_admin',
            'impersonator_shop_name'    => $shop->name,
            'impersonator_original_url' => $originalUrl,
        ]);

        Auth::login($targetUser);

        return redirect()->route('shop.dashboard')->with('success', "Now viewing as {$shop->name} ({$targetUser->name}).");
    }

    /**
     * Shop Owner switches to a salesman or staff member's view with 1 click.
     */
    public function enterStaff(Request $request, User $user): RedirectResponse
    {
        $currentUser = $request->user();

        // Must belong to the same shop
        if ($user->shop_id !== $currentUser->shop_id) {
            abort(403, 'Unauthorized. Staff does not belong to your shop.');
        }

        // Cannot impersonate yourself
        if ($user->id === $currentUser->id) {
            return back()->with('error', 'You are already logged in as this user.');
        }

        // Must have permission to manage staff or be a shop owner
        if (! $currentUser->hasRole('shop_owner') && ! $currentUser->can('staff.manage')) {
            abort(403, 'Unauthorized. Only shop owners/managers can switch to staff accounts.');
        }

        $previousUrl = url()->previous();
        $originalUrl = ($previousUrl && $previousUrl !== url('/') && ! str_ends_with($previousUrl, '/impersonate'))
            ? $previousUrl
            : route('shop.dashboard');

        // Save original shop owner state in session
        session([
            'impersonator_id'           => $currentUser->id,
            'impersonator_name'         => $currentUser->name,
            'impersonator_type'         => 'shop_owner',
            'impersonator_staff_name'   => $user->name,
            'impersonator_original_url' => $originalUrl,
        ]);

        Auth::login($user);

        // Redirect directly to sales POS screen for sales staff, or dashboard
        if ($user->hasRole('sales_staff')) {
            return redirect()->route('shop.sales.create')->with('success', "Switched to Salesman view: {$user->name}.");
        }

        return redirect()->route('shop.dashboard')->with('success', "Switched to staff view: {$user->name}.");
    }

    /**
     * Restore the original user and exit impersonation mode.
     */
    public function leave(Request $request): RedirectResponse
    {
        if (! session()->has('impersonator_id')) {
            return redirect()->route('dashboard');
        }

        $impersonatorId = session('impersonator_id');
        $type           = session('impersonator_type');
        $originalUrl    = session('impersonator_original_url');

        // Clear session keys
        session()->forget([
            'impersonator_id',
            'impersonator_name',
            'impersonator_type',
            'impersonator_shop_name',
            'impersonator_staff_name',
            'impersonator_original_url',
        ]);

        $originalUser = User::find($impersonatorId);

        if (! $originalUser) {
            Auth::logout();
            return redirect()->route('login');
        }

        Auth::login($originalUser);

        if ($type === 'super_admin') {
            return redirect($originalUrl ?: route('admin.shops.index'))
                ->with('success', 'Returned to Super Admin panel.');
        }

        return redirect($originalUrl ?: route('shop.dashboard'))
            ->with('success', 'Returned to Shop Owner account.');
    }
}
