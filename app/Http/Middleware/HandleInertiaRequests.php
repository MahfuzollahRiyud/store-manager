<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $shop = $user?->shop;

        return [
            ...parent::share($request),
            'name'        => config('app.name'),
            'auth'        => [
                'user' => $user ? [
                    'id'             => $user->id,
                    'name'           => $user->name,
                    'email'          => $user->email,
                    'phone'          => $user->phone,
                    'is_super_admin' => $user->is_super_admin,
                    'shop_id'        => $user->shop_id,
                    'roles'          => $user->getRoleNames(),
                    'permissions'    => $user->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'shop'        => $shop ? [
                'id'              => $shop->id,
                'name'            => $shop->name,
                'currency'        => $shop->currency,
                'currency_symbol' => $shop->currency_symbol,
                'logo'            => $shop->logo ? asset('storage/' . $shop->logo) : null,
                'invoice_prefix'  => $shop->invoice_prefix,
            ] : null,
            'flash'       => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'impersonator' => $request->session()->has('impersonator_id') ? [
                'id'         => $request->session()->get('impersonator_id'),
                'name'       => $request->session()->get('impersonator_name'),
                'type'       => $request->session()->get('impersonator_type'),
                'shop_name'  => $request->session()->get('impersonator_shop_name'),
                'staff_name' => $request->session()->get('impersonator_staff_name'),
            ] : null,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
