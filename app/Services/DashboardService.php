<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Expense;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get all dashboard statistics for a given date range.
     * Uses caching to avoid redundant queries.
     */
    public function getStats(string $period = 'today', ?string $from = null, ?string $to = null): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($period, $from, $to);
        $shopId = Auth::user()?->shop_id;

        if (! $shopId) {
            return [
                'sales'            => ['count' => 0, 'total_revenue' => 0, 'total_profit' => 0, 'total_cost' => 0, 'total_discount' => 0],
                'purchases'        => ['count' => 0, 'total_cost' => 0, 'total_paid' => 0, 'total_due' => 0],
                'expenses'         => ['total' => 0, 'by_category' => []],
                'stock'            => ['total_items' => 0, 'total_units' => 0, 'inventory_value' => 0, 'retail_value' => 0, 'potential_profit' => 0, 'low_stock_count' => 0, 'out_of_stock_count' => 0],
                'customers'        => ['total_customers' => 0, 'total_due' => 0, 'top_debtors' => []],
                'recent_sales'     => [],
                'recent_purchases' => [],
                'low_stock'        => [],
                'best_sellers'     => [],
                'product_sales'    => [],
                'chart_data'       => [],
            ];
        }

        $cacheKey = "dashboard:{$shopId}:{$period}:{$startDate}:{$endDate}";

        // Cache for 5 minutes — short enough to be fresh for a shop owner
        return Cache::remember($cacheKey, 300, function () use ($shopId, $startDate, $endDate) {
            return [
                'sales'           => $this->getSaleStats($shopId, $startDate, $endDate),
                'purchases'       => $this->getPurchaseStats($shopId, $startDate, $endDate),
                'expenses'        => $this->getExpenseStats($shopId, $startDate, $endDate),
                'stock'           => $this->getStockStats($shopId),
                'customers'       => $this->getCustomerStats($shopId),
                'recent_sales'    => $this->getRecentSales($shopId, 5),
                'recent_purchases'=> $this->getRecentPurchases($shopId, 5),
                'low_stock'       => $this->getLowStockProducts($shopId, 5),
                'best_sellers'    => $this->getBestSellers($shopId, $startDate, $endDate, 5),
                'product_sales'   => $this->getProductSalesBreakdown($shopId, $startDate, $endDate),
                'chart_data'      => $this->getChartData($shopId, $startDate, $endDate),
            ];
        });
    }

    private function getSaleStats(int $shopId, string $from, string $to): array
    {
        $result = Sale::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->selectRaw('
                COUNT(*) as count,
                COALESCE(SUM(total), 0) as total_revenue,
                COALESCE(SUM(gross_profit), 0) as total_profit,
                COALESCE(SUM(total_cost), 0) as total_cost,
                COALESCE(SUM(discount), 0) as total_discount
            ')
            ->first();

        return [
            'count'         => (int) $result->count,
            'total_revenue' => (float) $result->total_revenue,
            'total_profit'  => (float) $result->total_profit,
            'total_cost'    => (float) $result->total_cost,
            'total_discount'=> (float) $result->total_discount,
        ];
    }

    private function getPurchaseStats(int $shopId, string $from, string $to): array
    {
        $result = Purchase::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->whereBetween('purchase_date', [$from, $to])
            ->selectRaw('
                COUNT(*) as count,
                COALESCE(SUM(total), 0) as total_amount,
                COALESCE(SUM(due_amount), 0) as total_due
            ')
            ->first();

        return [
            'count'        => (int) $result->count,
            'total_amount' => (float) $result->total_amount,
            'total_due'    => (float) $result->total_due,
        ];
    }

    private function getExpenseStats(int $shopId, string $from, string $to): array
    {
        $total = Expense::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->whereBetween('expense_date', [$from, $to])
            ->sum('amount');

        return ['total' => (float) $total];
    }

    private function getStockStats(int $shopId): array
    {
        $stats = Product::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->where('status', 'active')
            ->selectRaw('
                COUNT(*) as total_products,
                COALESCE(SUM(current_stock * avg_cost), 0) as stock_value,
                SUM(CASE WHEN current_stock <= min_stock_level AND min_stock_level > 0 THEN 1 ELSE 0 END) as low_stock_count
            ')
            ->first();

        return [
            'total_products'  => (int) $stats->total_products,
            'stock_value'     => (float) $stats->stock_value,
            'low_stock_count' => (int) $stats->low_stock_count,
        ];
    }

    private function getCustomerStats(int $shopId): array
    {
        $stats = Customer::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->selectRaw('
                COUNT(*) as total_customers,
                COALESCE(SUM(total_due), 0) as total_due
            ')
            ->first();

        return [
            'total_customers' => (int) $stats->total_customers,
            'total_due'       => (float) $stats->total_due,
        ];
    }

    private function getRecentSales(int $shopId, int $limit): array
    {
        return Sale::withoutGlobalScope('shop')
            ->with('customer:id,name')
            ->where('shop_id', $shopId)
            ->select('id', 'invoice_no', 'sale_date', 'total', 'paid_amount', 'due_amount', 'status', 'customer_id')
            ->latest('sale_date')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    private function getRecentPurchases(int $shopId, int $limit): array
    {
        return Purchase::withoutGlobalScope('shop')
            ->with('supplier:id,name')
            ->where('shop_id', $shopId)
            ->select('id', 'invoice_no', 'purchase_date', 'total', 'paid_amount', 'due_amount', 'status', 'supplier_id')
            ->latest('purchase_date')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    private function getLowStockProducts(int $shopId, int $limit): array
    {
        return Product::withoutGlobalScope('shop')
            ->with('unit:id,abbreviation')
            ->where('shop_id', $shopId)
            ->where('status', 'active')
            ->whereColumn('current_stock', '<=', 'min_stock_level')
            ->where('min_stock_level', '>', 0)
            ->select('id', 'name', 'current_stock', 'min_stock_level', 'unit_id')
            ->orderBy('current_stock')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    private function getBestSellers(int $shopId, string $from, string $to, int $limit): array
    {
        return SaleItem::withoutGlobalScope('shop')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('sales.shop_id', $shopId)
            ->whereBetween('sales.sale_date', [$from, $to])
            ->groupBy('sale_items.product_id', 'products.name')
            ->select(
                'sale_items.product_id',
                'products.name',
                DB::raw('SUM(sale_items.quantity) as total_qty'),
                DB::raw('SUM(sale_items.subtotal) as total_revenue'),
                DB::raw('SUM(sale_items.profit) as total_profit')
            )
            ->orderByDesc('total_qty')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get a comprehensive breakdown of all products sold during the period.
     * Shows which product sold, how many units, avg price, revenue, profit, and stock remaining.
     */
    private function getProductSalesBreakdown(int $shopId, string $from, string $to): array
    {
        return SaleItem::whereHas('sale', function ($q) use ($shopId, $from, $to) {
            $q->withoutGlobalScope('shop')
              ->where('shop_id', $shopId)
              ->whereBetween('sale_date', [$from, $to]);
        })
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->leftJoin('units', 'products.unit_id', '=', 'units.id')
            ->groupBy(
                'products.id',
                'products.name',
                'products.barcode',
                'categories.name',
                'units.abbreviation',
                'products.current_stock',
                'products.min_stock_level'
            )
            ->select(
                'products.id as product_id',
                'products.name as product_name',
                'products.barcode as barcode',
                'categories.name as category_name',
                'units.abbreviation as unit_name',
                'products.current_stock as current_stock',
                'products.min_stock_level as min_stock_level',
                DB::raw('SUM(sale_items.quantity) as total_qty'),
                DB::raw('SUM(sale_items.subtotal) as total_revenue'),
                DB::raw('SUM(sale_items.profit) as total_profit'),
                DB::raw('ROUND(AVG(sale_items.unit_price), 2) as avg_price')
            )
            ->orderByDesc('total_revenue')
            ->get()
            ->toArray();
    }

    private function getChartData(int $shopId, string $from, string $to): array
    {
        // Daily sales/purchases/profit for the period
        $sales = Sale::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->selectRaw('DATE(sale_date) as date, SUM(total) as revenue, SUM(gross_profit) as profit')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $purchases = Purchase::withoutGlobalScope('shop')
            ->where('shop_id', $shopId)
            ->whereBetween('purchase_date', [$from, $to])
            ->selectRaw('DATE(purchase_date) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Build date range array
        $start  = Carbon::parse($from);
        $end    = Carbon::parse($to);
        $labels = [];
        $data   = [];

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $dateStr  = $date->toDateString();
            $labels[] = $date->format('d M');
            $data[]   = [
                'date'      => $dateStr,
                'revenue'   => (float) ($sales[$dateStr]->revenue ?? 0),
                'profit'    => (float) ($sales[$dateStr]->profit ?? 0),
                'purchases' => (float) ($purchases[$dateStr]->total ?? 0),
            ];
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function resolveDateRange(string $period, ?string $from, ?string $to): array
    {
        $today = now()->toDateString();

        return match ($period) {
            'today'     => [$today, $today],
            'yesterday' => [now()->subDay()->toDateString(), now()->subDay()->toDateString()],
            'this_week' => [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()],
            'this_month'=> [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()],
            'this_year' => [now()->startOfYear()->toDateString(), now()->endOfYear()->toDateString()],
            'custom'    => [$from ?? $today, $to ?? $today],
            default     => [$today, $today],
        };
    }
}
