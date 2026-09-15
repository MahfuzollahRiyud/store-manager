<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        $this->authorize('unit.manage');

        return Inertia::render('shop/units/index', [
            'units' => Unit::withCount('products')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('unit.manage');

        $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            'abbreviation' => ['required', 'string', 'max:20'],
        ]);

        Unit::create([
            'shop_id'      => auth()->user()->shop_id,
            'name'         => $request->name,
            'abbreviation' => $request->abbreviation,
        ]);

        return back()->with('success', 'Unit created.');
    }

    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorize('unit.manage');

        $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            'abbreviation' => ['required', 'string', 'max:20'],
        ]);

        $unit->update($request->only('name', 'abbreviation'));

        return back()->with('success', 'Unit updated.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $this->authorize('unit.manage');

        if ($unit->products()->count() > 0) {
            return back()->withErrors(['unit' => 'Cannot delete a unit that is assigned to products.']);
        }

        $unit->delete();

        return back()->with('success', 'Unit deleted.');
    }
}
