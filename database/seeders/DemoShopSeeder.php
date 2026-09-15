<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\Shop;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoShopSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // ── Create Demo Shop ────────────────────────────────────
            $shop = Shop::create([
                'name'            => 'M/S Rahman General Store',
                'owner_name'      => 'Mohammad Rahman',
                'phone'           => '01711-123456',
                'email'           => 'rahman@example.com',
                'address'         => 'Mirpur-10, Dhaka-1216',
                'currency'        => 'BDT',
                'currency_symbol' => '৳',
                'invoice_prefix'  => 'INV-',
                'is_active'       => true,
            ]);

            // ── Create Shop Owner ───────────────────────────────────
            $owner = User::create([
                'shop_id'  => $shop->id,
                'name'     => 'Mohammad Rahman',
                'email'    => 'owner@demo.com',
                'phone'    => '01711-123456',
                'password' => Hash::make('password'),
                'status'   => 'active',
            ]);
            $owner->assignRole('shop_owner');

            // ── Create Staff ────────────────────────────────────────
            $manager = User::create([
                'shop_id'  => $shop->id,
                'name'     => 'Karim Manager',
                'email'    => 'manager@demo.com',
                'phone'    => '01722-234567',
                'password' => Hash::make('password'),
                'status'   => 'active',
            ]);
            $manager->assignRole('manager');

            $salesStaff = User::create([
                'shop_id'  => $shop->id,
                'name'     => 'Rahim Sales',
                'email'    => 'sales@demo.com',
                'phone'    => '01733-345678',
                'password' => Hash::make('password'),
                'status'   => 'active',
            ]);
            $salesStaff->assignRole('sales_staff');

            // ── Categories ──────────────────────────────────────────
            $catSoap      = Category::create(['shop_id' => $shop->id, 'name' => 'Soap & Hygiene']);
            $catStationery= Category::create(['shop_id' => $shop->id, 'name' => 'Stationery']);
            $catFood      = Category::create(['shop_id' => $shop->id, 'name' => 'Food & Grocery']);
            $catCosmetics = Category::create(['shop_id' => $shop->id, 'name' => 'Cosmetics']);

            // ── Units ───────────────────────────────────────────────
            $unitPcs  = Unit::create(['shop_id' => $shop->id, 'name' => 'Piece', 'abbreviation' => 'pcs']);
            $unitBox  = Unit::create(['shop_id' => $shop->id, 'name' => 'Box', 'abbreviation' => 'box']);
            $unitPack = Unit::create(['shop_id' => $shop->id, 'name' => 'Pack', 'abbreviation' => 'pack']);
            $unitKg   = Unit::create(['shop_id' => $shop->id, 'name' => 'Kilogram', 'abbreviation' => 'kg']);
            $unitL    = Unit::create(['shop_id' => $shop->id, 'name' => 'Liter', 'abbreviation' => 'L']);
            $unitDoz  = Unit::create(['shop_id' => $shop->id, 'name' => 'Dozen', 'abbreviation' => 'doz']);

            // ── Products ────────────────────────────────────────────
            $products = [
                [
                    'name' => 'Lux Soap',         'category_id' => $catSoap->id,       'unit_id' => $unitPcs->id,
                    'sku' => 'LUX-001',            'brand' => 'Unilever',
                    'purchase_price' => 45,        'selling_price' => 55,
                    'avg_cost' => 45,              'current_stock' => 50, 'min_stock_level' => 10,
                ],
                [
                    'name' => 'Fresh Soap',        'category_id' => $catSoap->id,       'unit_id' => $unitPcs->id,
                    'sku' => 'FRESH-001',           'brand' => 'Keya',
                    'purchase_price' => 40,        'selling_price' => 48,
                    'avg_cost' => 40,              'current_stock' => 30, 'min_stock_level' => 10,
                ],
                [
                    'name' => 'A4 Paper (Ream)',   'category_id' => $catStationery->id, 'unit_id' => $unitPack->id,
                    'sku' => 'A4-001',             'brand' => 'Navana',
                    'purchase_price' => 300,       'selling_price' => 350,
                    'avg_cost' => 300,             'current_stock' => 20, 'min_stock_level' => 5,
                ],
                [
                    'name' => 'Ball Pen (Blue)',   'category_id' => $catStationery->id, 'unit_id' => $unitDoz->id,
                    'sku' => 'PEN-001',            'brand' => 'Reynolds',
                    'purchase_price' => 60,        'selling_price' => 80,
                    'avg_cost' => 60,              'current_stock' => 15, 'min_stock_level' => 5,
                ],
                [
                    'name' => 'Notebook (200p)',   'category_id' => $catStationery->id, 'unit_id' => $unitPcs->id,
                    'sku' => 'NB-001',             'brand' => 'Executive',
                    'purchase_price' => 50,        'selling_price' => 65,
                    'avg_cost' => 50,              'current_stock' => 25, 'min_stock_level' => 10,
                ],
                [
                    'name' => 'Head & Shoulders Shampoo', 'category_id' => $catCosmetics->id, 'unit_id' => $unitPcs->id,
                    'sku' => 'HS-001',             'brand' => 'P&G',
                    'purchase_price' => 180,       'selling_price' => 210,
                    'avg_cost' => 180,             'current_stock' => 20, 'min_stock_level' => 5,
                ],
                [
                    'name' => 'Ariel Detergent (1kg)', 'category_id' => $catSoap->id, 'unit_id' => $unitKg->id,
                    'sku' => 'ARL-001',            'brand' => 'P&G',
                    'purchase_price' => 120,       'selling_price' => 145,
                    'avg_cost' => 120,             'current_stock' => 15, 'min_stock_level' => 5,
                ],
                [
                    'name' => 'Pran Biscuit (Glucose)', 'category_id' => $catFood->id, 'unit_id' => $unitPcs->id,
                    'sku' => 'BSC-001',            'brand' => 'Pran',
                    'purchase_price' => 12,        'selling_price' => 15,
                    'avg_cost' => 12,              'current_stock' => 100, 'min_stock_level' => 20,
                ],
                [
                    'name' => 'Soyabean Oil (1L)',  'category_id' => $catFood->id,      'unit_id' => $unitL->id,
                    'sku' => 'OIL-001',             'brand' => 'Rupchanda',
                    'purchase_price' => 145,        'selling_price' => 165,
                    'avg_cost' => 145,              'current_stock' => 40, 'min_stock_level' => 10,
                ],
                [
                    'name' => 'Minicut Rice (5kg)', 'category_id' => $catFood->id,     'unit_id' => $unitKg->id,
                    'sku' => 'RCE-001',             'brand' => 'Local',
                    'purchase_price' => 280,        'selling_price' => 320,
                    'avg_cost' => 280,              'current_stock' => 30, 'min_stock_level' => 10,
                ],
                // Low stock demo product
                [
                    'name' => 'Dettol Soap',       'category_id' => $catSoap->id,       'unit_id' => $unitPcs->id,
                    'sku' => 'DTL-001',            'brand' => 'Reckitt',
                    'purchase_price' => 55,        'selling_price' => 68,
                    'avg_cost' => 55,              'current_stock' => 3, 'min_stock_level' => 10,
                ],
            ];

            $createdProducts = [];
            foreach ($products as $p) {
                $product = Product::create(array_merge($p, ['shop_id' => $shop->id, 'status' => 'active']));
                $createdProducts[] = $product;

                // Opening stock movement
                StockMovement::create([
                    'shop_id'    => $shop->id,
                    'product_id' => $product->id,
                    'user_id'    => $owner->id,
                    'type'       => 'opening_stock',
                    'quantity'   => $product->current_stock,
                    'unit_cost'  => $product->avg_cost,
                    'notes'      => 'Opening stock',
                    'created_at' => now()->subDays(30),
                ]);
            }

            // ── Suppliers ───────────────────────────────────────────
            $supplier1 = Supplier::create([
                'shop_id' => $shop->id, 'name' => 'Dhaka Trade Center',
                'phone' => '02-123456', 'email' => 'dtc@example.com',
                'address' => 'Gulshan-1, Dhaka',
                'total_purchase' => 0, 'total_paid' => 0, 'total_due' => 0,
            ]);
            $supplier2 = Supplier::create([
                'shop_id' => $shop->id, 'name' => 'Karim Wholesale',
                'phone' => '01811-456789',
                'address' => 'Kawran Bazar, Dhaka',
                'total_purchase' => 0, 'total_paid' => 0, 'total_due' => 0,
            ]);

            // ── Customers ───────────────────────────────────────────
            $customer1 = Customer::create([
                'shop_id' => $shop->id, 'name' => 'Md. Rahim',
                'phone' => '01911-111111',
                'address' => 'Mirpur-6, Dhaka',
                'total_purchase' => 500, 'total_paid' => 200, 'total_due' => 300,
            ]);
            $customer2 = Customer::create([
                'shop_id' => $shop->id, 'name' => 'Fatema Begum',
                'phone' => '01922-222222',
                'address' => 'Kazipara, Dhaka',
                'total_purchase' => 750, 'total_paid' => 750, 'total_due' => 0,
            ]);
            $customer3 = Customer::create([
                'shop_id' => $shop->id, 'name' => 'Hasan Ali',
                'phone' => '01933-333333',
                'address' => 'Pallabi, Dhaka',
                'total_purchase' => 1200, 'total_paid' => 800, 'total_due' => 400,
            ]);

            // ── Expense Categories ──────────────────────────────────
            $expCatRent  = ExpenseCategory::create(['shop_id' => $shop->id, 'name' => 'Rent']);
            $expCatElec  = ExpenseCategory::create(['shop_id' => $shop->id, 'name' => 'Electricity']);
            $expCatSal   = ExpenseCategory::create(['shop_id' => $shop->id, 'name' => 'Salary']);
            $expCatTrans = ExpenseCategory::create(['shop_id' => $shop->id, 'name' => 'Transport']);
            $expCatOther = ExpenseCategory::create(['shop_id' => $shop->id, 'name' => 'Other']);

            // ── Sample Expenses (this month) ────────────────────────
            Expense::create([
                'shop_id' => $shop->id, 'expense_category_id' => $expCatRent->id,
                'user_id' => $owner->id, 'amount' => 8000, 'expense_date' => now()->startOfMonth(),
                'description' => 'Monthly shop rent', 'payment_method' => 'cash',
            ]);
            Expense::create([
                'shop_id' => $shop->id, 'expense_category_id' => $expCatElec->id,
                'user_id' => $owner->id, 'amount' => 1200, 'expense_date' => now()->subDays(5),
                'description' => 'Electricity bill', 'payment_method' => 'mobile_banking',
            ]);
            Expense::create([
                'shop_id' => $shop->id, 'expense_category_id' => $expCatSal->id,
                'user_id' => $owner->id, 'amount' => 6000, 'expense_date' => now()->subDays(2),
                'description' => 'Staff salary', 'payment_method' => 'cash',
            ]);

            // ── Sample Purchases ────────────────────────────────────
            $p1 = Purchase::create([
                'shop_id'         => $shop->id,
                'supplier_id'     => $supplier1->id,
                'user_id'         => $owner->id,
                'invoice_no'      => 'PO-00001',
                'purchase_date'   => now()->subDays(10)->toDateString(),
                'subtotal'        => 3000,
                'discount'        => 0,
                'additional_cost' => 0,
                'total'           => 3000,
                'paid_amount'     => 2500,
                'due_amount'      => 500,
                'payment_method'  => 'bank',
                'status'          => 'partial',
                'notes'           => 'Initial stock replenish for soap products',
            ]);
            PurchaseItem::create([
                'purchase_id' => $p1->id,
                'product_id'  => $createdProducts[0]->id, // Lux Soap
                'quantity'    => 40,
                'unit_cost'   => 45,
                'subtotal'    => 1800,
            ]);
            PurchaseItem::create([
                'purchase_id' => $p1->id,
                'product_id'  => $createdProducts[6]->id, // Ariel
                'quantity'    => 10,
                'unit_cost'   => 120,
                'subtotal'    => 1200,
            ]);
            \App\Models\PurchasePayment::create([
                'shop_id'        => $shop->id,
                'purchase_id'    => $p1->id,
                'user_id'        => $owner->id,
                'amount'         => 2500,
                'payment_method' => 'bank',
                'payment_date'   => now()->subDays(10)->toDateString(),
                'notes'          => 'Advance bank payment',
            ]);
            $supplier1->update(['total_purchase' => 3000, 'total_paid' => 2500, 'total_due' => 500]);

            $p2 = Purchase::create([
                'shop_id'         => $shop->id,
                'supplier_id'     => $supplier2->id,
                'user_id'         => $owner->id,
                'invoice_no'      => 'PO-00002',
                'purchase_date'   => now()->subDays(4)->toDateString(),
                'subtotal'        => 4250,
                'discount'        => 0,
                'additional_cost' => 0,
                'total'           => 4250,
                'paid_amount'     => 4250,
                'due_amount'      => 0,
                'payment_method'  => 'cash',
                'status'          => 'paid',
                'notes'           => 'Procured fresh Soyabean oil & Rice bags',
            ]);
            PurchaseItem::create([
                'purchase_id' => $p2->id,
                'product_id'  => $createdProducts[8]->id, // Soyabean Oil
                'quantity'    => 10,
                'unit_cost'   => 145,
                'subtotal'    => 1450,
            ]);
            PurchaseItem::create([
                'purchase_id' => $p2->id,
                'product_id'  => $createdProducts[9]->id, // Minicut Rice
                'quantity'    => 10,
                'unit_cost'   => 280,
                'subtotal'    => 2800,
            ]);
            \App\Models\PurchasePayment::create([
                'shop_id'        => $shop->id,
                'purchase_id'    => $p2->id,
                'user_id'        => $owner->id,
                'amount'         => 4250,
                'payment_method' => 'cash',
                'payment_date'   => now()->subDays(4)->toDateString(),
                'notes'          => 'Full cash settlement upon delivery',
            ]);
            $supplier2->update(['total_purchase' => 4250, 'total_paid' => 4250, 'total_due' => 0]);

            // ── Sample Sales Across 6 Days ──────────────────────────
            $salesData = [
                [
                    'customer' => $customer1,
                    'days_ago' => 6,
                    'items'    => [
                        ['product' => $createdProducts[0], 'qty' => 4, 'price' => 55], // 220
                        ['product' => $createdProducts[7], 'qty' => 10, 'price' => 15], // 150
                        ['product' => $createdProducts[4], 'qty' => 2, 'price' => 65], // 130
                    ],
                    'discount'    => 0,
                    'paid_amount' => 200,
                    'status'      => 'partial',
                ],
                [
                    'customer' => $customer2,
                    'days_ago' => 4,
                    'items'    => [
                        ['product' => $createdProducts[2], 'qty' => 2, 'price' => 350], // 700
                        ['product' => $createdProducts[3], 'qty' => 1, 'price' => 80],  // 80
                    ],
                    'discount'    => 30, // total 750
                    'paid_amount' => 750,
                    'status'      => 'paid',
                ],
                [
                    'customer' => null,
                    'days_ago' => 3,
                    'items'    => [
                        ['product' => $createdProducts[8], 'qty' => 2, 'price' => 165], // 330
                        ['product' => $createdProducts[1], 'qty' => 2, 'price' => 48],  // 96
                    ],
                    'discount'    => 6, // total 420
                    'paid_amount' => 420,
                    'status'      => 'paid',
                ],
                [
                    'customer' => $customer3,
                    'days_ago' => 2,
                    'items'    => [
                        ['product' => $createdProducts[9], 'qty' => 3, 'price' => 320], // 960
                        ['product' => $createdProducts[5], 'qty' => 1, 'price' => 210], // 210
                        ['product' => $createdProducts[0], 'qty' => 1, 'price' => 55],  // 55
                    ],
                    'discount'    => 25, // total 1200
                    'paid_amount' => 800,
                    'status'      => 'partial',
                ],
                [
                    'customer' => null,
                    'days_ago' => 1,
                    'items'    => [
                        ['product' => $createdProducts[8], 'qty' => 2, 'price' => 165], // 330
                        ['product' => $createdProducts[9], 'qty' => 1, 'price' => 320], // 320
                    ],
                    'discount'    => 10, // total 640
                    'paid_amount' => 640,
                    'status'      => 'paid',
                ],
                [
                    'customer' => null,
                    'days_ago' => 0,
                    'items'    => [
                        ['product' => $createdProducts[2], 'qty' => 1, 'price' => 350], // 350
                    ],
                    'discount'    => 0,
                    'paid_amount' => 350,
                    'status'      => 'paid',
                ],
            ];

            foreach ($salesData as $idx => $sd) {
                $saleDate = now()->subDays($sd['days_ago'])->toDateString();
                $subtotal = 0;
                $costTotal = 0;
                $lineItems = [];

                foreach ($sd['items'] as $item) {
                    $prod = $item['product'];
                    $qty = $item['qty'];
                    $price = $item['price'];
                    $lineSubtotal = $qty * $price;
                    $lineCost = $qty * $prod->avg_cost;
                    $lineProfit = $lineSubtotal - $lineCost;

                    $subtotal += $lineSubtotal;
                    $costTotal += $lineCost;

                    $lineItems[] = [
                        'product_id' => $prod->id,
                        'quantity'   => $qty,
                        'unit_price' => $price,
                        'unit_cost'  => $prod->avg_cost,
                        'subtotal'   => $lineSubtotal,
                        'profit'     => $lineProfit,
                    ];
                }

                $total = $subtotal - $sd['discount'];
                $dueAmount = max(0, $total - $sd['paid_amount']);
                $grossProfit = $total - $costTotal;
                $invoiceNo = 'INV-' . str_pad((string) ($idx + 1), 5, '0', STR_PAD_LEFT);

                $sale = Sale::create([
                    'shop_id'        => $shop->id,
                    'customer_id'    => $sd['customer']?->id,
                    'user_id'        => $salesStaff->id,
                    'invoice_no'     => $invoiceNo,
                    'sale_date'      => $saleDate,
                    'subtotal'       => $subtotal,
                    'discount'       => $sd['discount'],
                    'total'          => $total,
                    'total_cost'     => $costTotal,
                    'gross_profit'   => $grossProfit,
                    'paid_amount'    => $sd['paid_amount'],
                    'due_amount'     => $dueAmount,
                    'change_amount'  => 0,
                    'payment_method' => 'cash',
                    'status'         => $sd['status'],
                    'created_at'     => now()->subDays($sd['days_ago']),
                ]);

                foreach ($lineItems as $li) {
                    SaleItem::create(array_merge($li, ['sale_id' => $sale->id]));

                    StockMovement::create([
                        'shop_id'    => $shop->id,
                        'product_id' => $li['product_id'],
                        'user_id'    => $salesStaff->id,
                        'type'       => 'sale',
                        'quantity'   => $li['quantity'],
                        'unit_cost'  => $li['unit_cost'],
                        'notes'      => "Sold via {$invoiceNo}",
                        'created_at' => now()->subDays($sd['days_ago']),
                    ]);
                }

                if ($sd['paid_amount'] > 0) {
                    SalePayment::create([
                        'shop_id'        => $shop->id,
                        'sale_id'        => $sale->id,
                        'customer_id'    => $sd['customer']?->id,
                        'user_id'        => $salesStaff->id,
                        'amount'         => $sd['paid_amount'],
                        'payment_method' => 'cash',
                        'payment_date'   => $saleDate,
                        'notes'          => 'Cash received at checkout',
                    ]);
                }
            }
        });
    }
}
