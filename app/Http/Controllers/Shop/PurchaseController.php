<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use App\Services\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function __construct(private readonly PurchaseService $purchaseService) {}

    public function index(Request $request): Response
    {
        $this->authorize('purchase.view');

        $purchases = \App\Models\Purchase::with(['supplier:id,name', 'user:id,name'])
            ->when($request->search, fn($q) => $q->where('invoice_no', 'like', "%{$request->search}%"))
            ->when($request->supplier_id, fn($q) => $q->where('supplier_id', $request->supplier_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->from, fn($q) => $q->whereDate('purchase_date', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('purchase_date', '<=', $request->to))
            ->orderByDesc('purchase_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('shop/purchases/index', [
            'purchases' => $purchases,
            'suppliers' => Supplier::select('id', 'name')->active()->orderBy('name')->get(),
            'filters'   => $request->only('search', 'supplier_id', 'status', 'from', 'to'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('purchase.create');

        return Inertia::render('shop/purchases/create', [
            'suppliers' => Supplier::select('id', 'name', 'phone')->active()->orderBy('name')->get(),
            'products'  => Product::with('unit:id,abbreviation')
                ->active()
                ->select('id', 'name', 'sku', 'purchase_price', 'selling_price', 'current_stock', 'unit_id', 'avg_cost')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('purchase.create');

        $validated = $request->validate([
            'supplier_id'     => ['nullable', 'exists:suppliers,id'],
            'invoice_no'      => ['nullable', 'string', 'max:100'],
            'purchase_date'   => ['required', 'date'],
            'discount'        => ['nullable', 'numeric', 'min:0'],
            'additional_cost' => ['nullable', 'numeric', 'min:0'],
            'paid_amount'     => ['nullable', 'numeric', 'min:0'],
            'payment_method'  => ['nullable', 'string', 'in:cash,bank,mobile_banking,other'],
            'notes'           => ['nullable', 'string'],
            'items'           => ['required', 'array', 'min:1'],
            'items.*.product_id'=> ['required', 'exists:products,id'],
            'items.*.quantity'  => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ]);

        $purchase = $this->purchaseService->create($validated);

        return redirect()->route('shop.purchases.show', $purchase)
            ->with('success', 'Purchase recorded successfully.');
    }

    public function show(\App\Models\Purchase $purchase): Response
    {
        $this->authorize('purchase.view');

        $purchase->load(['supplier', 'items.product.unit', 'payments.user', 'user']);

        return Inertia::render('shop/purchases/show', [
            'purchase' => $purchase,
        ]);
    }

    public function paymentStore(Request $request, \App\Models\Purchase $purchase): RedirectResponse
    {
        $this->authorize('purchase.edit');

        $validated = $request->validate([
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string'],
            'payment_date'   => ['required', 'date'],
            'notes'          => ['nullable', 'string'],
        ]);

        $this->purchaseService->recordPayment($purchase, $validated);

        return back()->with('success', 'Payment recorded.');
    }
}
