<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function __invoke(Request $request)
    {
        if ($request->user()?->is_super_admin) {
            return redirect()->route('admin.dashboard');
        }

        $period = $request->get('period', 'today');
        $from   = $request->get('from');
        $to     = $request->get('to');

        $stats = $this->dashboardService->getStats($period, $from, $to);

        return Inertia::render('shop/dashboard', [
            'stats'  => $stats,
            'period' => $period,
            'from'   => $from,
            'to'     => $to,
        ]);
    }
}
