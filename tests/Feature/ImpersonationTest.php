<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImpersonationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_super_admin_can_impersonate_shop_owner_and_leave(): void
    {
        $superAdmin = User::factory()->create([
            'name'           => 'Super Admin',
            'email'          => 'admin@test.com',
            'is_super_admin' => true,
            'shop_id'        => null,
            'status'         => 'active',
        ]);
        $superAdmin->assignRole('super_admin');

        $shop = Shop::create([
            'name'        => 'Rahman Store',
            'owner_name'  => 'Rahman Saheb',
            'owner_phone' => '01711111111',
            'is_active'   => true,
        ]);

        $owner = User::factory()->create([
            'name'     => 'Rahman Saheb',
            'email'    => 'rahman@test.com',
            'shop_id'  => $shop->id,
            'status'   => 'active',
        ]);
        $owner->assignRole('shop_owner');

        // Act as super admin
        $this->actingAs($superAdmin);

        // Impersonate shop
        $response = $this->post(route('admin.shops.impersonate', $shop));
        $response->assertRedirect(route('shop.dashboard'));

        // Check authentication changed to owner
        $this->assertEquals($owner->id, auth()->id());
        $this->assertEquals($superAdmin->id, session('impersonator_id'));
        $this->assertEquals('super_admin', session('impersonator_type'));

        // Leave impersonation
        $leaveResponse = $this->post(route('impersonate.leave'));
        $leaveResponse->assertRedirect(route('admin.shops.index'));

        // Check authentication restored to super admin
        $this->assertEquals($superAdmin->id, auth()->id());
        $this->assertNull(session('impersonator_id'));
    }

    public function test_non_super_admin_cannot_impersonate_shop(): void
    {
        $shopA = Shop::create([
            'name'        => 'Shop A',
            'owner_name'  => 'Owner A',
            'is_active'   => true,
        ]);

        $ownerA = User::factory()->create([
            'shop_id' => $shopA->id,
            'status'  => 'active',
        ]);
        $ownerA->assignRole('shop_owner');

        $shopB = Shop::create([
            'name'        => 'Shop B',
            'owner_name'  => 'Owner B',
            'is_active'   => true,
        ]);

        $this->actingAs($ownerA);

        $response = $this->post(route('admin.shops.impersonate', $shopB));
        $response->assertForbidden();
    }

    public function test_shop_owner_can_impersonate_own_staff_and_leave(): void
    {
        $shop = Shop::create([
            'name'        => 'Bhai Bhai General Store',
            'owner_name'  => 'Kashem',
            'is_active'   => true,
        ]);

        $owner = User::factory()->create([
            'name'    => 'Kashem',
            'shop_id' => $shop->id,
            'status'  => 'active',
        ]);
        $owner->assignRole('shop_owner');

        $staff = User::factory()->create([
            'name'    => 'Akbor Salesman',
            'shop_id' => $shop->id,
            'status'  => 'active',
        ]);
        $staff->assignRole('sales_staff');

        $this->actingAs($owner);

        // Impersonate staff (sales_staff is redirected straight to POS create)
        $response = $this->post(route('shop.staff.impersonate', $staff));
        $response->assertRedirect(route('shop.sales.create'));

        // Assert authenticated as staff
        $this->assertEquals($staff->id, auth()->id());
        $this->assertEquals($owner->id, session('impersonator_id'));
        $this->assertEquals('shop_owner', session('impersonator_type'));

        // Leave staff view
        $leaveResponse = $this->post(route('impersonate.leave'));
        $leaveResponse->assertRedirect(route('shop.dashboard'));

        // Assert restored to owner
        $this->assertEquals($owner->id, auth()->id());
        $this->assertNull(session('impersonator_id'));
    }

    public function test_shop_owner_cannot_impersonate_staff_from_another_shop(): void
    {
        $shopA = Shop::create(['name' => 'Shop A', 'owner_name' => 'Owner A', 'is_active' => true]);
        $ownerA = User::factory()->create(['shop_id' => $shopA->id, 'status' => 'active']);
        $ownerA->assignRole('shop_owner');

        $shopB = Shop::create(['name' => 'Shop B', 'owner_name' => 'Owner B', 'is_active' => true]);
        $staffB = User::factory()->create(['shop_id' => $shopB->id, 'status' => 'active']);
        $staffB->assignRole('sales_staff');

        $this->actingAs($ownerA);

        $response = $this->post(route('shop.staff.impersonate', $staffB));
        $response->assertForbidden();
    }

    public function test_sales_staff_cannot_impersonate_other_staff(): void
    {
        $shop = Shop::create(['name' => 'Shop A', 'owner_name' => 'Owner A', 'is_active' => true]);
        
        $staff1 = User::factory()->create(['shop_id' => $shop->id, 'status' => 'active']);
        $staff1->assignRole('sales_staff');

        $staff2 = User::factory()->create(['shop_id' => $shop->id, 'status' => 'active']);
        $staff2->assignRole('sales_staff');

        $this->actingAs($staff1);

        $response = $this->post(route('shop.staff.impersonate', $staff2));
        $response->assertForbidden();
    }
}
