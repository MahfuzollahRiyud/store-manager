<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Shop;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopManagementTest extends TestCase
{
    use RefreshDatabase;

    private Shop $shop1;
    private Shop $shop2;
    private User $owner1;
    private User $owner2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        // Setup Shop 1
        $this->shop1 = Shop::create([
            'name'           => 'Shop Alpha',
            'owner_name'     => 'Owner Alpha',
            'is_active'      => true,
            'invoice_prefix' => 'ALPH-',
        ]);

        $this->owner1 = User::create([
            'name'     => 'Owner 1',
            'email'    => 'owner1@alpha.com',
            'password' => bcrypt('password'),
            'shop_id'  => $this->shop1->id,
            'status'   => 'active',
        ]);
        $this->owner1->assignRole('shop_owner');

        // Setup Shop 2
        $this->shop2 = Shop::create([
            'name'           => 'Shop Beta',
            'owner_name'     => 'Owner Beta',
            'is_active'      => true,
            'invoice_prefix' => 'BETA-',
        ]);

        $this->owner2 = User::create([
            'name'     => 'Owner 2',
            'email'    => 'owner2@beta.com',
            'password' => bcrypt('password'),
            'shop_id'  => $this->shop2->id,
            'status'   => 'active',
        ]);
        $this->owner2->assignRole('shop_owner');
    }

    public function test_tenant_data_isolation_between_shops(): void
    {
        // Create product in Shop 1
        $product1 = Product::create([
            'shop_id'        => $this->shop1->id,
            'name'           => 'Secret Oil Alpha',
            'purchase_price' => 100,
            'selling_price'  => 130,
            'avg_cost'       => 100,
            'current_stock'  => 50,
            'min_stock_level'=> 5,
            'status'         => 'active',
        ]);

        // Create product in Shop 2
        $product2 = Product::create([
            'shop_id'        => $this->shop2->id,
            'name'           => 'Special Rice Beta',
            'purchase_price' => 60,
            'selling_price'  => 75,
            'avg_cost'       => 60,
            'current_stock'  => 30,
            'min_stock_level'=> 5,
            'status'         => 'active',
        ]);

        // Act as Owner 1: should ONLY see Shop 1 products
        $this->actingAs($this->owner1);
        $response = $this->get(route('shop.products.index'));
        $response->assertOk();
        $response->assertSee('Secret Oil Alpha');
        $response->assertDontSee('Special Rice Beta');

        // Act as Owner 2: should ONLY see Shop 2 products
        $this->actingAs($this->owner2);
        $response2 = $this->get(route('shop.products.index'));
        $response2->assertOk();
        $response2->assertSee('Special Rice Beta');
        $response2->assertDontSee('Secret Oil Alpha');
    }

    public function test_purchase_creation_updates_stock_and_weighted_average_cost(): void
    {
        $this->actingAs($this->owner1);

        $product = Product::create([
            'shop_id'        => $this->shop1->id,
            'name'           => 'Flour 2kg',
            'purchase_price' => 100,
            'selling_price'  => 130,
            'avg_cost'       => 100,
            'current_stock'  => 10, // 10 units @ 100 = 1000
            'min_stock_level'=> 5,
            'status'         => 'active',
        ]);

        $supplier = Supplier::create([
            'shop_id' => $this->shop1->id,
            'name'    => 'City Flour Mills',
            'status'  => 'active',
        ]);

        // Buy 10 more units @ 120 (cost 1200)
        // New avg cost = (1000 + 1200) / 20 = 110
        $response = $this->post(route('shop.purchases.store'), [
            'supplier_id'     => $supplier->id,
            'purchase_date'   => now()->toDateString(),
            'paid_amount'     => 1200,
            'payment_method'  => 'cash',
            'items'           => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 10,
                    'unit_cost'  => 120,
                ],
            ],
        ]);

        $response->assertRedirect();

        $product->refresh();
        $this->assertEquals(20, $product->current_stock);
        $this->assertEquals(110.00, round($product->avg_cost, 2));

        // Verify purchase was created
        $this->assertDatabaseHas('purchases', [
            'shop_id'     => $this->shop1->id,
            'supplier_id' => $supplier->id,
            'total'       => 1200,
            'paid_amount' => 1200,
            'status'      => 'paid',
        ]);
    }

    public function test_sale_creation_deducts_stock_and_calculates_profit(): void
    {
        $this->actingAs($this->owner1);

        $product = Product::create([
            'shop_id'        => $this->shop1->id,
            'name'           => 'Basmati Rice',
            'purchase_price' => 100,
            'selling_price'  => 150,
            'avg_cost'       => 100,
            'current_stock'  => 20,
            'min_stock_level'=> 5,
            'status'         => 'active',
        ]);

        $customer = Customer::create([
            'shop_id' => $this->shop1->id,
            'name'    => 'Rafiq Islam',
            'status'  => 'active',
        ]);

        // Sell 5 units @ 150 = 750 revenue, cost = 5 * 100 = 500, gross profit = 250
        $response = $this->post(route('shop.sales.store'), [
            'customer_id'    => $customer->id,
            'sale_date'      => now()->toDateString(),
            'discount'       => 0,
            'paid_amount'    => 500, // Partial payment (250 due)
            'payment_method' => 'cash',
            'items'          => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 5,
                    'unit_price' => 150,
                ],
            ],
        ]);

        $response->assertRedirect();

        $product->refresh();
        $this->assertEquals(15, $product->current_stock);

        $customer->refresh();
        $this->assertEquals(750, $customer->total_purchase);
        $this->assertEquals(500, $customer->total_paid);
        $this->assertEquals(250, $customer->total_due);

        $this->assertDatabaseHas('sales', [
            'shop_id'      => $this->shop1->id,
            'customer_id'  => $customer->id,
            'total'        => 750,
            'paid_amount'  => 500,
            'due_amount'   => 250,
            'gross_profit' => 250,
            'status'       => 'partial',
        ]);
    }

    public function test_sale_prevents_negative_stock(): void
    {
        $this->actingAs($this->owner1);

        $product = Product::create([
            'shop_id'        => $this->shop1->id,
            'name'           => 'Limited Tea Pack',
            'purchase_price' => 80,
            'selling_price'  => 100,
            'avg_cost'       => 80,
            'current_stock'  => 3,
            'min_stock_level'=> 1,
            'status'         => 'active',
        ]);

        // Try to sell 5 units when only 3 exist
        $response = $this->post(route('shop.sales.store'), [
            'sale_date'      => now()->toDateString(),
            'paid_amount'    => 500,
            'payment_method' => 'cash',
            'items'          => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 5,
                    'unit_price' => 100,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('stock');

        // Verify stock remains untouched at 3
        $product->refresh();
        $this->assertEquals(3, $product->current_stock);
    }
}
