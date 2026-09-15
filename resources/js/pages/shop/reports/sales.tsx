import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Filter, DollarSign, TrendingUp, Receipt, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Sale } from '@/types';

interface SalesReportProps {
    sales: PaginatedData<Sale & { user?: { name: string } }>;
    summary: {
        total_revenue: number;
        total_profit: number;
        total_discount: number;
        count: number;
    };
    filters: {
        from: string;
        to: string;
    };
}

export default function SalesReport({ sales, summary, filters }: SalesReportProps) {
    const { format } = useCurrency();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const handleFilter = () => {
        router.get(route('shop.reports.sales'), { from, to }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Sales Report', href: route('shop.reports.sales') }
        ]}>
            <Head title="Sales Financial Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Sales & Revenue Report"
                    description="Itemized revenue, discounts, gross margin, and sales volume by period"
                />

                <ReportsNav current="sales" exportType="sales" from={filters.from} to={filters.to} />

                {/* Filter Bar */}
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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-emerald-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">{format(summary.total_revenue || 0)}</div>
                            <span className="text-xs text-muted-foreground">{summary.count || 0} invoices</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-blue-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Gross Profit</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-blue-600">{format(summary.total_profit || 0)}</div>
                            <span className="text-xs text-muted-foreground">
                                {summary.total_revenue > 0 ? `${((summary.total_profit / summary.total_revenue) * 100).toFixed(1)}% margin` : ''}
                            </span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Discounts Given</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(summary.total_discount || 0)}</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Avg Ticket Size</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">
                                {summary.count > 0 ? format(summary.total_revenue / summary.count) : format(0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Invoice #</th>
                                    <th className="py-3 px-4 text-left">Customer</th>
                                    <th className="py-3 px-4 text-right">Revenue</th>
                                    <th className="py-3 px-4 text-right">Discount</th>
                                    <th className="py-3 px-4 text-right">Gross Profit</th>
                                    <th className="py-3 px-4 text-right">Paid</th>
                                    <th className="py-3 px-4 text-right">Due</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {sales.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-8 text-center text-muted-foreground">
                                            No sales found for the selected period.
                                        </td>
                                    </tr>
                                ) : (
                                    sales.data.map((s) => (
                                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 px-4 font-mono text-muted-foreground">{s.sale_date}</td>
                                            <td className="py-2.5 px-4 font-mono font-medium">{s.invoice_no}</td>
                                            <td className="py-2.5 px-4">{s.customer?.name || 'Walking Customer'}</td>
                                            <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">{format(s.total)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">{format(s.discount)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono font-semibold text-blue-600">{format(s.gross_profit)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono text-emerald-600">{format(s.paid_amount)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono text-rose-600">{format(s.due_amount)}</td>
                                            <td className="py-2.5 px-4 text-center">
                                                <StatusBadge status={s.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={sales} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
