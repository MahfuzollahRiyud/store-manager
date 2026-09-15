<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('product.view');

        $products = Product::with(['category:id,name', 'unit:id,name,abbreviation'])
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
                  ->orWhere('barcode', 'like', "%{$request->search}%");
            }))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->low_stock === 'true', fn($q) => $q->lowStock())
            ->orderBy($request->sort_by ?? 'name', $request->sort_dir ?? 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('shop/products/index', [
            'products'   => $products,
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            'filters'    => $request->only('search', 'category_id', 'status', 'low_stock', 'sort_by', 'sort_dir'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('product.create');

        return Inertia::render('shop/products/create', [
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            'units'      => Unit::select('id', 'name', 'abbreviation')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('product.create');

        $shopId = Auth::user()->shop_id;

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'max:100', Rule::unique('products')->where('shop_id', $shopId)->ignore(null)],
            'barcode'        => ['nullable', 'string', 'max:100'],
            'category_id'    => ['nullable', 'exists:categories,id'],
            'unit_id'        => ['nullable', 'exists:units,id'],
            'brand'          => ['nullable', 'string', 'max:100'],
            'description'    => ['nullable', 'string'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'selling_price'  => ['required', 'numeric', 'min:0'],
            'current_stock'  => ['required', 'numeric', 'min:0'],
            'min_stock_level'=> ['required', 'numeric', 'min:0'],
            'status'         => ['required', 'in:active,inactive'],
            'image'          => ['nullable', 'image', 'max:2048'],
        ]);

        $validated['shop_id']  = $shopId;
        $validated['avg_cost'] = $validated['purchase_price']; // initial avg_cost = purchase price

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);

        // Create opening stock movement if stock > 0
        if ($product->current_stock > 0) {
            \App\Models\StockMovement::create([
                'shop_id'    => $shopId,
                'product_id' => $product->id,
                'user_id'    => Auth::id(),
                'type'       => 'opening_stock',
                'quantity'   => $product->current_stock,
                'unit_cost'  => $product->avg_cost,
                'notes'      => 'Opening stock on product creation',
                'created_at' => now(),
            ]);
        }

        return redirect()->route('shop.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product): Response
    {
        $this->authorize('product.view');

        $product->load(['category', 'unit']);

        $movements = \App\Models\StockMovement::where('product_id', $product->id)
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('shop/products/show', [
            'product'   => $product,
            'movements' => $movements,
        ]);
    }

    public function edit(Product $product): Response
    {
        $this->authorize('product.edit');

        return Inertia::render('shop/products/edit', [
            'product'    => $product->load('category', 'unit'),
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            'units'      => Unit::select('id', 'name', 'abbreviation')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('product.edit');

        $shopId = Auth::user()->shop_id;

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'max:100', Rule::unique('products')->where('shop_id', $shopId)->ignore($product->id)],
            'barcode'        => ['nullable', 'string', 'max:100'],
            'category_id'    => ['nullable', 'exists:categories,id'],
            'unit_id'        => ['nullable', 'exists:units,id'],
            'brand'          => ['nullable', 'string', 'max:100'],
            'description'    => ['nullable', 'string'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'selling_price'  => ['required', 'numeric', 'min:0'],
            'min_stock_level'=> ['required', 'numeric', 'min:0'],
            'status'         => ['required', 'in:active,inactive'],
            'image'          => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()->route('shop.products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('product.delete');

        $product->delete();

        return redirect()->route('shop.products.index')
            ->with('success', 'Product deleted.');
    }
}
