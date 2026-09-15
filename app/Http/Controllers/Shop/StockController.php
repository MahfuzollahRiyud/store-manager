<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function __construct(private readonly StockService $stockService) {}

    public function index(Request $request): Response
    {
        $this->authorize('stock.view');

        $products = Product::with(['category:id,name', 'unit:id,name,abbreviation'])
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->low_stock === 'true', fn($q) => $q->lowStock())
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('shop/stock/index', [
            'products' => $products,
            'filters'  => $request->only('search', 'category_id', 'low_stock'),
        ]);
    }

    public function movements(Request $request): Response
    {
        $this->authorize('stock.view');

        $movements = StockMovement::with(['product:id,name', 'user:id,name'])
            ->when($request->product_id, fn($q) => $q->where('product_id', $request->product_id))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->from, fn($q) => $q->whereDate('created_at', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('created_at', '<=', $request->to))
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('shop/stock/movements', [
            'movements' => $movements,
            'products'  => Product::select('id', 'name')->active()->orderBy('name')->get(),
            'filters'   => $request->only('product_id', 'type', 'from', 'to'),
        ]);
    }

    public function adjustStore(Request $request): RedirectResponse
    {
        $this->authorize('stock.adjust');

        $validated = $request->validate([
            'product_id'  => ['required', 'exists:products,id'],
            'physical_qty'=> ['required', 'numeric', 'min:0'],
            'reason'      => ['required', 'string', 'max:500'],
        ]);

        $this->stockService->adjust($validated);

        return back()->with('success', 'Stock adjusted successfully.');
    }
}
