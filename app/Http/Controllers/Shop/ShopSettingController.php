<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class ShopSettingController extends Controller
{
    public function index(): Response
    {
        $this->authorize('settings.manage');

        $shop  = Auth::user()->shop;
        $staff = User::where('shop_id', $shop->id)->with('roles')->get();
        $roles = Role::whereNotIn('name', ['super_admin'])->get(['id', 'name']);

        return Inertia::render('shop/settings/index', [
            'shop'  => $shop,
            'staff' => $staff,
            'roles' => $roles,
        ]);
    }

    public function updateShop(Request $request): RedirectResponse
    {
        $this->authorize('settings.manage');

        $shop = Auth::user()->shop;

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'owner_name'     => ['required', 'string', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:20'],
            'email'          => ['nullable', 'email'],
            'address'        => ['nullable', 'string'],
            'invoice_prefix' => ['required', 'string', 'max:20'],
            'logo'           => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            if ($shop->logo) {
                Storage::disk('public')->delete($shop->logo);
            }
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $shop->update($validated);

        return back()->with('success', 'Shop settings updated.');
    }

    public function addStaff(Request $request): RedirectResponse
    {
        $this->authorize('staff.manage');

        $shopId = Auth::user()->shop_id;

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'phone'    => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:6'],
            'role'     => ['required', 'exists:roles,name'],
        ]);

        $user = User::create([
            'shop_id'  => $shopId,
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'status'   => 'active',
        ]);

        $user->assignRole($validated['role']);

        return back()->with('success', 'Staff member added.');
    }

    public function removeStaff(User $user): RedirectResponse
    {
        $this->authorize('staff.manage');

        // Ensure staff belongs to this shop
        if ($user->shop_id !== Auth::user()->shop_id) {
            abort(403);
        }

        $user->delete();

        return back()->with('success', 'Staff member removed.');
    }
}
