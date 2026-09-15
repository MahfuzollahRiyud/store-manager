<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\Supplier;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function sales(Request $request): Response
    {
        $this->authorize('report.view');

        [$from, $to] = $this->resolveDates($request);
        $shopId = Auth::user()->shop_id;

        $sales = Sale::with(['customer:id,name', 'user:id,name'])
            ->where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->select('id', 'invoice_no', 'sale_date', 'total', 'discount', 'gross_profit', 'total_cost', 'paid_amount', 'due_amount', 'status', 'customer_id', 'user_id')
            ->orderByDesc('sale_date')
            ->paginate(25)
            ->withQueryString();

        $summary = Sale::where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->selectRaw('SUM(total) as total_revenue, SUM(gross_profit) as total_profit, SUM(discount) as total_discount, COUNT(*) as count')
            ->first();

        return Inertia::render('shop/reports/sales', [
            'sales'   => $sales,
            'summary' => $summary,
            'filters' => ['from' => $from, 'to' => $to, ...$request->only('customer_id')],
        ]);
    }

    public function purchases(Request $request): Response
    {
        $this->authorize('report.view');

        [$from, $to] = $this->resolveDates($request);
        $shopId = Auth::user()->shop_id;

        $purchases = Purchase::with(['supplier:id,name', 'user:id,name'])
            ->where('shop_id', $shopId)
            ->whereBetween('purchase_date', [$from, $to])
            ->orderByDesc('purchase_date')
            ->paginate(25)
            ->withQueryString();

        $summary = Purchase::where('shop_id', $shopId)
            ->whereBetween('purchase_date', [$from, $to])
            ->selectRaw('SUM(total) as total_amount, SUM(due_amount) as total_due, COUNT(*) as count')
            ->first();

        return Inertia::render('shop/reports/purchases', [
            'purchases' => $purchases,
            'summary'   => $summary,
            'filters'   => ['from' => $from, 'to' => $to],
        ]);
    }

    public function profit(Request $request): Response
    {
        $this->authorize('report.view');

        [$from, $to] = $this->resolveDates($request);
        $shopId = Auth::user()->shop_id;

        $summary = Sale::where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->selectRaw('SUM(total) as revenue, SUM(total_cost) as cost, SUM(gross_profit) as gross_profit')
            ->first();

        $totalExpenses = Expense::where('shop_id', $shopId)
            ->whereBetween('expense_date', [$from, $to])
            ->sum('amount');

        $netProfit = (float) $summary->gross_profit - (float) $totalExpenses;

        // Daily breakdown
        $dailyData = Sale::where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->selectRaw('DATE(sale_date) as date, SUM(total) as revenue, SUM(gross_profit) as profit')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('shop/reports/profit', [
            'summary'       => $summary,
            'total_expenses'=> (float) $totalExpenses,
            'net_profit'    => $netProfit,
            'daily_data'    => $dailyData,
            'filters'       => ['from' => $from, 'to' => $to],
        ]);
    }

    public function expenses(Request $request): Response
    {
        $this->authorize('report.view');

        [$from, $to] = $this->resolveDates($request);
        $shopId = Auth::user()->shop_id;

        $expenses = Expense::with(['category:id,name', 'user:id,name'])
            ->where('shop_id', $shopId)
            ->whereBetween('expense_date', [$from, $to])
            ->orderByDesc('expense_date')
            ->paginate(25)
            ->withQueryString();

        $byCategory = Expense::with('category:id,name')
            ->where('shop_id', $shopId)
            ->whereBetween('expense_date', [$from, $to])
            ->selectRaw('expense_category_id, SUM(amount) as total')
            ->groupBy('expense_category_id')
            ->with('category:id,name')
            ->get();

        return Inertia::render('shop/reports/expenses', [
            'expenses'    => $expenses,
            'by_category' => $byCategory,
            'filters'     => ['from' => $from, 'to' => $to],
        ]);
    }

    public function stock(Request $request): Response
    {
        $this->authorize('report.view');

        $shopId = Auth::user()->shop_id;

        $products = Product::with(['category:id,name', 'unit:id,abbreviation'])
            ->where('shop_id', $shopId)
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        $summary = Product::where('shop_id', $shopId)
            ->where('status', 'active')
            ->selectRaw('COUNT(*) as total_products, SUM(current_stock * avg_cost) as stock_value')
            ->first();

        return Inertia::render('shop/reports/stock', [
            'products' => $products,
            'summary'  => $summary,
        ]);
    }

    public function stockMovements(Request $request): Response
    {
        $this->authorize('report.view');

        [$from, $to] = $this->resolveDates($request);
        $shopId = Auth::user()->shop_id;

        $movements = StockMovement::with(['product:id,name', 'user:id,name'])
            ->where('shop_id', $shopId)
            ->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('shop/reports/stock-movements', [
            'movements' => $movements,
            'filters'   => ['from' => $from, 'to' => $to, ...$request->only('product_id', 'type')],
            'products'  => Product::select('id', 'name')->where('shop_id', $shopId)->orderBy('name')->get(),
        ]);
    }

    public function customerDue(Request $request): Response
    {
        $this->authorize('report.view');

        $shopId = Auth::user()->shop_id;

        $customers = Customer::where('shop_id', $shopId)
            ->where('total_due', '>', 0)
            ->orderByDesc('total_due')
            ->paginate(25)
            ->withQueryString();

        $totalDue = Customer::where('shop_id', $shopId)->sum('total_due');

        return Inertia::render('shop/reports/customer-due', [
            'customers' => $customers,
            'total_due' => (float) $totalDue,
        ]);
    }

    public function supplierDue(Request $request): Response
    {
        $this->authorize('report.view');

        $shopId = Auth::user()->shop_id;

        $suppliers = Supplier::where('shop_id', $shopId)
            ->where('total_due', '>', 0)
            ->orderByDesc('total_due')
            ->paginate(25)
            ->withQueryString();

        $totalDue = Supplier::where('shop_id', $shopId)->sum('total_due');

        return Inertia::render('shop/reports/supplier-due', [
            'suppliers' => $suppliers,
            'total_due' => (float) $totalDue,
        ]);
    }

    public function productPerformance(Request $request): Response
    {
        $this->authorize('report.view');

        [$from, $to] = $this->resolveDates($request);
        $shopId = Auth::user()->shop_id;

        $products = SaleItem::join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('sales.shop_id', $shopId)
            ->whereBetween('sales.sale_date', [$from, $to])
            ->groupBy('sale_items.product_id', 'products.name', 'products.sku')
            ->selectRaw('
                sale_items.product_id,
                products.name,
                products.sku,
                SUM(sale_items.quantity) as total_qty_sold,
                SUM(sale_items.subtotal) as total_revenue,
                SUM(sale_items.profit) as total_profit,
                AVG(sale_items.unit_price) as avg_selling_price
            ')
            ->orderByDesc('total_revenue')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('shop/reports/product-performance', [
            'products' => $products,
            'filters'  => ['from' => $from, 'to' => $to],
        ]);
    }

    public function exportCsv(Request $request, string $type): StreamedResponse
    {
        $this->authorize('report.export');

        [$from, $to] = $this->resolveDates($request);

        $filename = "{$type}-report-{$from}-{$to}.csv";

        return response()->streamDownload(function () use ($type, $from, $to, $request) {
            $handle = fopen('php://output', 'w');
            $shopId = Auth::user()->shop_id;

            match ($type) {
                'sales' => $this->exportSalesCsv($handle, $shopId, $from, $to),
                'purchases' => $this->exportPurchasesCsv($handle, $shopId, $from, $to),
                'expenses' => $this->exportExpensesCsv($handle, $shopId, $from, $to),
                'stock' => $this->exportStockCsv($handle, $shopId),
                default => null,
            };

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function exportSalesCsv($handle, int $shopId, string $from, string $to): void
    {
        fputcsv($handle, ['Invoice', 'Date', 'Customer', 'Total', 'Discount', 'Profit', 'Paid', 'Due', 'Status']);

        Sale::with('customer:id,name')
            ->where('shop_id', $shopId)
            ->whereBetween('sale_date', [$from, $to])
            ->orderByDesc('sale_date')
            ->chunk(200, function ($sales) use ($handle) {
                foreach ($sales as $sale) {
                    fputcsv($handle, [
                        $sale->invoice_no, $sale->sale_date, $sale->customer?->name ?? 'Walk-in',
                        $sale->total, $sale->discount, $sale->gross_profit,
                        $sale->paid_amount, $sale->due_amount, $sale->status,
                    ]);
                }
            });
    }

    private function exportPurchasesCsv($handle, int $shopId, string $from, string $to): void
    {
        fputcsv($handle, ['Invoice', 'Date', 'Supplier', 'Total', 'Paid', 'Due', 'Status']);

        Purchase::with('supplier:id,name')
            ->where('shop_id', $shopId)
            ->whereBetween('purchase_date', [$from, $to])
            ->chunk(200, function ($purchases) use ($handle) {
                foreach ($purchases as $p) {
                    fputcsv($handle, [
                        $p->invoice_no, $p->purchase_date, $p->supplier?->name ?? 'N/A',
                        $p->total, $p->paid_amount, $p->due_amount, $p->status,
                    ]);
                }
            });
    }

    private function exportExpensesCsv($handle, int $shopId, string $from, string $to): void
    {
        fputcsv($handle, ['Date', 'Category', 'Amount', 'Description', 'Payment Method']);

        Expense::with('category:id,name')
            ->where('shop_id', $shopId)
            ->whereBetween('expense_date', [$from, $to])
            ->chunk(200, function ($expenses) use ($handle) {
                foreach ($expenses as $e) {
                    fputcsv($handle, [
                        $e->expense_date, $e->category?->name ?? 'N/A',
                        $e->amount, $e->description, $e->payment_method,
                    ]);
                }
            });
    }

    private function exportStockCsv($handle, int $shopId): void
    {
        fputcsv($handle, ['Name', 'SKU', 'Category', 'Unit', 'Current Stock', 'Min Stock', 'Avg Cost', 'Stock Value']);

        Product::with(['category:id,name', 'unit:id,abbreviation'])
            ->where('shop_id', $shopId)
            ->chunk(200, function ($products) use ($handle) {
                foreach ($products as $p) {
                    fputcsv($handle, [
                        $p->name, $p->sku, $p->category?->name, $p->unit?->abbreviation,
                        $p->current_stock, $p->min_stock_level, $p->avg_cost,
                        round($p->current_stock * $p->avg_cost, 2),
                    ]);
                }
            });
    }

    private function resolveDates(Request $request): array
    {
        $from = $request->get('from', now()->startOfMonth()->toDateString());
        $to   = $request->get('to', now()->toDateString());
        return [$from, $to];
    }
}
