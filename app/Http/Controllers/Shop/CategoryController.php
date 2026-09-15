<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $this->authorize('category.manage');

        return Inertia::render('shop/categories/index', [
            'categories' => Category::withCount('products')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('category.manage');

        $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        Category::create([
            'shop_id'     => auth()->user()->shop_id,
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Category created.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $this->authorize('category.manage');

        $request->validate(['name' => ['required', 'string', 'max:255']]);

        $category->update($request->only('name', 'description'));

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('category.manage');

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
