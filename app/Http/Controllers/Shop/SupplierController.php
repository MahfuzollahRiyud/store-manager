<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Services\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function __construct(private readonly PurchaseService $purchaseService) {}

    public function index(Request $request): Response
    {
        $this->authorize('supplier.view');

        $suppliers = Supplier::when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
            }))
            ->orderByDesc('total_due')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('shop/suppliers/index', [
            'suppliers' => $suppliers,
            'filters'   => $request->only('search'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('supplier.create');

        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'email'   => ['nullable', 'email'],
            'address' => ['nullable', 'string'],
            'notes'   => ['nullable', 'string'],
        ]);

        $validated['shop_id'] = auth()->user()->shop_id;

        Supplier::create($validated);

        return back()->with('success', 'Supplier added.');
    }

    public function show(Supplier $supplier): Response
    {
        $this->authorize('supplier.view');

        $purchases = $supplier->purchases()
            ->select('id', 'invoice_no', 'purchase_date', 'total', 'paid_amount', 'due_amount', 'status')
            ->orderByDesc('purchase_date')
            ->paginate(10);

        return Inertia::render('shop/suppliers/show', [
            'supplier'  => $supplier,
            'purchases' => $purchases,
        ]);
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $this->authorize('supplier.edit');

        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'email'   => ['nullable', 'email'],
            'address' => ['nullable', 'string'],
            'notes'   => ['nullable', 'string'],
            'status'  => ['required', 'in:active,inactive'],
        ]);

        $supplier->update($validated);

        return back()->with('success', 'Supplier updated.');
    }

    public function paymentStore(Request $request, Supplier $supplier): RedirectResponse
    {
        $this->authorize('supplier.payment');

        $validated = $request->validate([
            'purchase_id'    => ['required', 'exists:purchases,id'],
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string'],
            'payment_date'   => ['required', 'date'],
            'notes'          => ['nullable', 'string'],
        ]);

        $purchase = \App\Models\Purchase::findOrFail($validated['purchase_id']);
        $this->purchaseService->recordPayment($purchase, $validated);

        return back()->with('success', 'Payment recorded.');
    }
}
