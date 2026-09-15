import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Filter, TrendingUp, DollarSign, Receipt, Calculator, PieChart } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ReportsNav } from '@/components/reports-nav';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';

interface ProfitReportProps {
    summary: {
        revenue: number;
        cost: number;
        gross_profit: number;
    };
    total_expenses: number;
    net_profit: number;
    daily_data: Array<{
        date: string;
        revenue: number;
        profit: number;
    }>;
    filters: {
        from: string;
        to: string;
    };
}

export default function ProfitReport({ summary, total_expenses, net_profit, daily_data, filters }: ProfitReportProps) {
    const { format } = useCurrency();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const handleFilter = () => {
        router.get(route('shop.reports.profit'), { from, to }, { preserveState: true });
    };

    const revenue = Number(summary?.revenue || 0);
    const cogs = Number(summary?.cost || 0);
    const grossProfit = Number(summary?.gross_profit || 0);
    const expenses = Number(total_expenses || 0);
    const netProfit = Number(net_profit || 0);
    const grossMarginPercent = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0';
    const netMarginPercent = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : '0';

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Profit & Loss', href: route('shop.reports.profit') }
        ]}>
            <Head title="Net Profit & Loss Statement" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Profit & Loss Statement (P&L)"
                    description="Realized gross profit, operating expenditures, and final net business earnings"
                />

                <ReportsNav current="profit" from={filters.from} to={filters.to} />

                {/* Filter */}
                <div className="p-3 bg-card rounded-xl border border-border/60 shadow-sm flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">Date Range:</span>
                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-8 text-xs w-36"
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-8 text-xs w-36"
                    />
                    <Button size="sm" onClick={handleFilter} className="h-8 text-xs">
                        <Filter className="h-3 w-3 mr-1" /> Apply
                    </Button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Sales Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(revenue)}</div>
                            <span className="text-xs text-muted-foreground">Total realized sales</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Cost of Goods Sold (COGS)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-muted-foreground font-mono">{format(cogs)}</div>
                            <span className="text-xs text-muted-foreground">Product average cost</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-blue-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Gross Profit</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-blue-600">{format(grossProfit)}</div>
                            <span className="text-xs text-blue-600 font-medium">{grossMarginPercent}% margin</span>
                        </CardContent>
                    </Card>

                    <Card className={`shadow-sm border-2 ${netProfit >= 0 ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Net Profit (Take-Home)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {format(netProfit)}
                            </div>
                            <span className="text-xs text-muted-foreground">After {format(expenses)} expenses ({netMarginPercent}%)</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Accounting P&L Breakdown Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Accounting Summary</CardTitle>
                            <CardDescription>Mathematical P&L breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span>1. Total Sales Revenue:</span>
                                <span className="font-mono font-bold text-foreground">{format(revenue)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50 text-muted-foreground">
                                <span>2. Less: Cost of Goods Sold:</span>
                                <span className="font-mono">-{format(cogs)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border text-sm font-semibold text-blue-600">
                                <span>3. Gross Profit (1 - 2):</span>
                                <span className="font-mono">{format(grossProfit)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50 text-rose-600">
                                <span>4. Less: Operating Expenses:</span>
                                <span className="font-mono">-{format(expenses)}</span>
                            </div>
                            <div className={`flex justify-between py-3 border-t-2 border-border text-base font-bold ${
                                netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                <span>5. Net Profit (3 - 4):</span>
                                <span className="font-mono">{format(netProfit)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Revenue vs Profit Trend */}
                    <Card className="lg:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Daily Revenue & Gross Profit</CardTitle>
                            <CardDescription>Comparison over the selected date range</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={daily_data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip
                                            formatter={(val: any) => [format(Number(val ?? 0)), '']}
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="profit" name="Gross Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
