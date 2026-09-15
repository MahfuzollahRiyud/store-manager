<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Shop\CategoryController;
use App\Http\Controllers\Shop\CustomerController;
use App\Http\Controllers\Shop\DashboardController;
use App\Http\Controllers\Shop\ExpenseController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\PurchaseController;
use App\Http\Controllers\Shop\ReportController;
use App\Http\Controllers\Shop\SaleController;
use App\Http\Controllers\Shop\ShopSettingController;
use App\Http\Controllers\Shop\StockController;
use App\Http\Controllers\Shop\SupplierController;
use App\Http\Controllers\ImpersonationController;
use App\Http\Controllers\Shop\UnitController;
use Illuminate\Support\Facades\Route;

// ── Public / Welcome ───────────────────────────────────────────────────────────
Route::inertia('/', 'welcome')->name('home');

// ── Authenticated Shop Routes ──────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'ensure.shop.active'])
    ->prefix('shop')
    ->name('shop.')
    ->group(function () {

        // Dashboard
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Products
        Route::resource('products', ProductController::class);

        // Categories
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::patch('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        // Units
        Route::get('units', [UnitController::class, 'index'])->name('units.index');
        Route::post('units', [UnitController::class, 'store'])->name('units.store');
        Route::patch('units/{unit}', [UnitController::class, 'update'])->name('units.update');
        Route::delete('units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');

        // Purchases
        Route::resource('purchases', PurchaseController::class)->only(['index', 'create', 'store', 'show']);
        Route::post('purchases/{purchase}/payments', [PurchaseController::class, 'paymentStore'])->name('purchases.payments.store');

        // Sales
        Route::resource('sales', SaleController::class)->only(['index', 'create', 'store', 'show']);
        Route::get('sales/{sale}/receipt', [SaleController::class, 'receipt'])->name('sales.receipt');
        Route::post('customers/{customer}/payments', [SaleController::class, 'customerPaymentStore'])->name('customers.payments.store');

        // Customers
        Route::resource('customers', CustomerController::class);

        // Suppliers
        Route::get('suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::post('suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::get('suppliers/{supplier}', [SupplierController::class, 'show'])->name('suppliers.show');
        Route::patch('suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::post('suppliers/{supplier}/payments', [SupplierController::class, 'paymentStore'])->name('suppliers.payments.store');

        // Expenses
        Route::get('expenses', [ExpenseController::class, 'index'])->name('expenses.index');
        Route::post('expenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::patch('expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::delete('expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
        Route::post('expense-categories', [ExpenseController::class, 'categoryStore'])->name('expense-categories.store');

        // Stock
        Route::get('stock', [StockController::class, 'index'])->name('stock.index');
        Route::get('stock/movements', [StockController::class, 'movements'])->name('stock.movements');
        Route::post('stock/adjust', [StockController::class, 'adjustStore'])->name('stock.adjust');

        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('sales', [ReportController::class, 'sales'])->name('sales');
            Route::get('purchases', [ReportController::class, 'purchases'])->name('purchases');
            Route::get('profit', [ReportController::class, 'profit'])->name('profit');
            Route::get('expenses', [ReportController::class, 'expenses'])->name('expenses');
            Route::get('stock', [ReportController::class, 'stock'])->name('stock');
            Route::get('stock-movements', [ReportController::class, 'stockMovements'])->name('stock-movements');
            Route::get('customer-due', [ReportController::class, 'customerDue'])->name('customer-due');
            Route::get('supplier-due', [ReportController::class, 'supplierDue'])->name('supplier-due');
            Route::get('product-performance', [ReportController::class, 'productPerformance'])->name('product-performance');
            Route::get('export/{type}', [ReportController::class, 'exportCsv'])->name('export');
        });

        // Settings
        Route::get('settings', [ShopSettingController::class, 'index'])->name('settings.index');
        Route::patch('settings/shop', [ShopSettingController::class, 'updateShop'])->name('settings.shop.update');
        Route::post('settings/staff', [ShopSettingController::class, 'addStaff'])->name('settings.staff.store');
        Route::delete('settings/staff/{user}', [ShopSettingController::class, 'removeStaff'])->name('settings.staff.destroy');
        Route::post('staff/{user}/impersonate', [ImpersonationController::class, 'enterStaff'])->name('staff.impersonate');
    });

// Impersonation leave route
Route::post('impersonate/leave', [ImpersonationController::class, 'leave'])->middleware(['auth'])->name('impersonate.leave');

// Smart redirect for dashboard route
Route::get('dashboard', function () {
    if (auth()->user()?->is_super_admin) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('shop.dashboard');
})->middleware(['auth'])->name('dashboard');

// ── Super Admin Routes ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'super.admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('shops', [AdminDashboardController::class, 'shops'])->name('shops.index');
        Route::get('shops/{shop}', [AdminDashboardController::class, 'showShop'])->name('shops.show');
        Route::post('shops/{shop}/impersonate', [ImpersonationController::class, 'enterShop'])->name('shops.impersonate');
        Route::patch('shops/{shop}/toggle-status', [AdminDashboardController::class, 'toggleShopStatus'])->name('shops.toggle-status');
        Route::get('users', [AdminDashboardController::class, 'users'])->name('users.index');
    });

require __DIR__.'/settings.php';
