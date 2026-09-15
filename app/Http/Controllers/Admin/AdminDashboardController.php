<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_shops'    => Shop::count(),
            'active_shops'   => Shop::where('is_active', true)->count(),
            'inactive_shops' => Shop::where('is_active', false)->count(),
            'total_users'    => User::whereNull('deleted_at')->count(),
        ];

        $recentShops = Shop::select('id', 'name', 'owner_name', 'phone', 'is_active', 'created_at')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats'       => $stats,
            'recentShops' => $recentShops,
        ]);
    }

    public function shops(Request $request): Response
    {
        $shops = Shop::withCount('users')
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('owner_name', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
            }))
            ->when(isset($request->is_active), fn($q) => $q->where('is_active', $request->is_active))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/shops/index', [
            'shops'   => $shops,
            'filters' => $request->only('search', 'is_active'),
        ]);
    }

    public function showShop(Shop $shop): Response
    {
        $shop->load(['users' => fn($q) => $q->withTrashed()->with('roles')]);

        $stats = [
            'total_products'  => \App\Models\Product::withoutGlobalScope('shop')->where('shop_id', $shop->id)->count(),
            'total_sales'     => \App\Models\Sale::withoutGlobalScope('shop')->where('shop_id', $shop->id)->count(),
            'total_purchases' => \App\Models\Purchase::withoutGlobalScope('shop')->where('shop_id', $shop->id)->count(),
        ];

        return Inertia::render('admin/shops/show', [
            'shop'  => $shop,
            'stats' => $stats,
        ]);
    }

    public function toggleShopStatus(Shop $shop): RedirectResponse
    {
        $shop->update(['is_active' => ! $shop->is_active]);

        $status = $shop->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Shop has been {$status}.");
    }

    public function users(Request $request): Response
    {
        $users = User::with(['shop:id,name', 'roles'])
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users'   => $users,
            'filters' => $request->only('search'),
        ]);
    }
}
