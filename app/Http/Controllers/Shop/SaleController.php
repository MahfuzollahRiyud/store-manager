<?php

namespace App\Http\Controllers\Shop;

use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(private readonly SaleService $saleService) {}

    public function index(Request $request): Response
    {
        $this->authorize('sale.view');

        $sales = Sale::with(['customer:id,name', 'user:id,name'])
            ->when($request->search, fn($q) => $q->where('invoice_no', 'like', "%{$request->search}%"))
            ->when($request->customer_id, fn($q) => $q->where('customer_id', $request->customer_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->from, fn($q) => $q->whereDate('sale_date', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('sale_date', '<=', $request->to))
            ->orderByDesc('sale_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('shop/sales/index', [
            'sales'     => $sales,
            'customers' => Customer::select('id', 'name')->active()->orderBy('name')->get(),
            'filters'   => $request->only('search', 'customer_id', 'status', 'from', 'to'),
        ]);
    }

    /**
     * Quick Sale / POS page — the main selling interface.
     */
    public function create(): Response
    {
        $this->authorize('sale.create');

        return Inertia::render('shop/sales/create', [
            'products'  => Product::with('unit:id,abbreviation')
                ->active()
                ->select('id', 'name', 'sku', 'barcode', 'selling_price', 'avg_cost', 'current_stock', 'unit_id')
                ->orderBy('name')
                ->get(),
            'customers' => Customer::select('id', 'name', 'phone', 'total_due')->active()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('sale.create');

        $validated = $request->validate([
            'customer_id'       => ['nullable', 'exists:customers,id'],
            'sale_date'         => ['required', 'date'],
            'discount'          => ['nullable', 'numeric', 'min:0'],
            'paid_amount'       => ['nullable', 'numeric', 'min:0'],
            'payment_method'    => ['nullable', 'string', 'in:cash,bank,mobile_banking,other'],
            'notes'             => ['nullable', 'string'],
            'items'             => ['required', 'array', 'min:1'],
            'items.*.product_id'=> ['required', 'exists:products,id'],
            'items.*.quantity'  => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'=> ['required', 'numeric', 'min:0'],
        ]);

        try {
            $sale = $this->saleService->create($validated);

            return redirect()->route('shop.sales.show', $sale)
                ->with('success', "Sale #{$sale->invoice_no} completed successfully.");
        } catch (InsufficientStockException $e) {
            return back()->withErrors(['stock' => $e->getMessage()])->withInput();
        }
    }

    public function show(Sale $sale): Response
    {
        $this->authorize('sale.view');

        $sale->load(['customer', 'items.product.unit', 'payments.user', 'user', 'shop']);

        return Inertia::render('shop/sales/show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Print-ready receipt view.
     */
    public function receipt(Sale $sale): Response
    {
        $this->authorize('sale.view');

        $sale->load(['customer', 'items.product.unit', 'shop', 'user']);

        return Inertia::render('shop/sales/receipt', [
            'sale' => $sale,
        ]);
    }

    public function customerPaymentStore(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('customer.payment');

        $validated = $request->validate([
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string'],
            'payment_date'   => ['required', 'date'],
            'sale_id'        => ['nullable', 'exists:sales,id'],
            'notes'          => ['nullable', 'string'],
        ]);

        $this->saleService->recordCustomerPayment($customer->id, $validated);

        return back()->with('success', 'Payment recorded successfully.');
    }
}
