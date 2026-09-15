<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Define all permissions ──────────────────────────────────
        $permissions = [
            // Products
            'product.view', 'product.create', 'product.edit', 'product.delete',
            // Categories & Units
            'category.manage', 'unit.manage',
            // Purchases
            'purchase.view', 'purchase.create', 'purchase.edit', 'purchase.delete',
            // Sales
            'sale.view', 'sale.create', 'sale.edit', 'sale.delete',
            // Customers
            'customer.view', 'customer.create', 'customer.edit', 'customer.delete',
            'customer.payment',
            // Suppliers
            'supplier.view', 'supplier.create', 'supplier.edit', 'supplier.delete',
            'supplier.payment',
            // Stock
            'stock.view', 'stock.adjust',
            // Expenses
            'expense.view', 'expense.create', 'expense.edit', 'expense.delete',
            // Reports
            'report.view', 'report.export',
            // Staff
            'staff.view', 'staff.manage',
            // Settings
            'settings.manage',
            // Audit
            'audit.view',
            // Returns
            'return.create',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // ── Create roles and assign permissions ─────────────────────

        // Super Admin (managed via Gate::before — no permissions needed here)
        Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);

        // Shop Owner — full access to their shop
        $shopOwner = Role::firstOrCreate(['name' => 'shop_owner', 'guard_name' => 'web']);
        $shopOwner->syncPermissions($permissions); // all permissions

        // Manager — mostly full access
        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions(array_filter($permissions, fn($p) => ! in_array($p, [
            'staff.manage', 'settings.manage',
        ])));

        // Sales Staff — limited to sales and customer management
        $salesStaff = Role::firstOrCreate(['name' => 'sales_staff', 'guard_name' => 'web']);
        $salesStaff->syncPermissions([
            'product.view',
            'sale.view', 'sale.create',
            'customer.view', 'customer.create', 'customer.payment',
            'report.view',
        ]);

        // Inventory Staff — manages products and stock
        $inventoryStaff = Role::firstOrCreate(['name' => 'inventory_staff', 'guard_name' => 'web']);
        $inventoryStaff->syncPermissions([
            'product.view', 'product.create', 'product.edit',
            'category.manage', 'unit.manage',
            'purchase.view', 'purchase.create',
            'supplier.view', 'supplier.create',
            'stock.view', 'stock.adjust',
            'return.create',
        ]);
    }
}
