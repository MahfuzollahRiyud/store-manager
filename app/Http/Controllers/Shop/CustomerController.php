<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('customer.view');

        $customers = Customer::when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
            }))
            ->when($request->has_due, fn($q) => $q->hasDue())
            ->orderByDesc('total_due')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('shop/customers/index', [
            'customers' => $customers,
            'filters'   => $request->only('search', 'has_due'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('customer.create');

        return Inertia::render('shop/customers/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('customer.create');

        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'notes'   => ['nullable', 'string'],
            'status'  => ['required', 'in:active,inactive'],
        ]);

        $validated['shop_id'] = auth()->user()->shop_id;

        Customer::create($validated);

        return redirect()->route('shop.customers.index')
            ->with('success', 'Customer added.');
    }

    public function show(Customer $customer): Response
    {
        $this->authorize('customer.view');

        $sales = $customer->sales()
            ->select('id', 'invoice_no', 'sale_date', 'total', 'paid_amount', 'due_amount', 'status')
            ->orderByDesc('sale_date')
            ->paginate(10, pageName: 'sales_page');

        $payments = $customer->payments()
            ->with('user:id,name')
            ->orderByDesc('payment_date')
            ->paginate(10, pageName: 'payments_page');

        return Inertia::render('shop/customers/show', [
            'customer' => $customer,
            'sales'    => $sales,
            'payments' => $payments,
        ]);
    }

    public function edit(Customer $customer): Response
    {
        $this->authorize('customer.edit');

        return Inertia::render('shop/customers/edit', ['customer' => $customer]);
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('customer.edit');

        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'notes'   => ['nullable', 'string'],
            'status'  => ['required', 'in:active,inactive'],
        ]);

        $customer->update($validated);

        return redirect()->route('shop.customers.show', $customer)
            ->with('success', 'Customer updated.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $this->authorize('customer.delete');

        $customer->delete();

        return redirect()->route('shop.customers.index')->with('success', 'Customer removed.');
    }
}
