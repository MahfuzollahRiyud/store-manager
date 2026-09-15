<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('shop.dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_with_shop_can_visit_the_dashboard()
    {
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);

        $shop = \App\Models\Shop::create([
            'name'       => 'Test Store',
            'owner_name' => 'Owner',
            'is_active'  => true,
        ]);

        $user = User::factory()->create([
            'shop_id' => $shop->id,
            'status'  => 'active',
        ]);
        $user->assignRole('shop_owner');

        $this->actingAs($user);

        $response = $this->get(route('shop.dashboard'));
        $response->assertOk();
    }

    public function test_super_admin_visiting_shop_dashboard_is_redirected_to_admin_dashboard()
    {
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);

        $admin = User::factory()->create([
            'shop_id'        => null,
            'is_super_admin' => true,
            'status'         => 'active',
        ]);
        $admin->assignRole('super_admin');

        $this->actingAs($admin);

        $response = $this->get(route('shop.dashboard'));
        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_super_admin_visiting_generic_dashboard_is_redirected_to_admin_dashboard()
    {
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);

        $admin = User::factory()->create([
            'shop_id'        => null,
            'is_super_admin' => true,
            'status'         => 'active',
        ]);
        $admin->assignRole('super_admin');

        $this->actingAs($admin);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('admin.dashboard'));
    }
}
