<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('expense.view');

        $expenses = Expense::with(['category:id,name', 'user:id,name'])
            ->when($request->category_id, fn($q) => $q->where('expense_category_id', $request->category_id))
            ->when($request->from, fn($q) => $q->whereDate('expense_date', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('expense_date', '<=', $request->to))
            ->orderByDesc('expense_date')
            ->paginate(20)
            ->withQueryString();

        $totalAmount = Expense::when($request->from, fn($q) => $q->whereDate('expense_date', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('expense_date', '<=', $request->to))
            ->sum('amount');

        return Inertia::render('shop/expenses/index', [
            'expenses'    => $expenses,
            'categories'  => ExpenseCategory::select('id', 'name')->orderBy('name')->get(),
            'total_amount'=> (float) $totalAmount,
            'filters'     => $request->only('category_id', 'from', 'to'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('expense.create');

        $validated = $request->validate([
            'expense_category_id' => ['nullable', 'exists:expense_categories,id'],
            'amount'              => ['required', 'numeric', 'min:0.01'],
            'expense_date'        => ['required', 'date'],
            'description'         => ['nullable', 'string'],
            'payment_method'      => ['nullable', 'string', 'in:cash,bank,mobile_banking,other'],
        ]);

        $validated['shop_id']  = auth()->user()->shop_id;
        $validated['user_id']  = auth()->id();

        Expense::create($validated);

        return back()->with('success', 'Expense recorded.');
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        $this->authorize('expense.edit');

        $validated = $request->validate([
            'expense_category_id' => ['nullable', 'exists:expense_categories,id'],
            'amount'              => ['required', 'numeric', 'min:0.01'],
            'expense_date'        => ['required', 'date'],
            'description'         => ['nullable', 'string'],
            'payment_method'      => ['nullable', 'string'],
        ]);

        $expense->update($validated);

        return back()->with('success', 'Expense updated.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $this->authorize('expense.delete');

        $expense->delete();

        return back()->with('success', 'Expense deleted.');
    }

    public function categoryStore(Request $request): RedirectResponse
    {
        $this->authorize('expense.create');

        $request->validate(['name' => ['required', 'string', 'max:100']]);

        ExpenseCategory::create([
            'shop_id' => auth()->user()->shop_id,
            'name'    => $request->name,
        ]);

        return back()->with('success', 'Category added.');
    }
}
