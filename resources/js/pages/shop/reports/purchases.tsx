import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Filter, PackagePlus, Truck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Purchase } from '@/types';

interface PurchasesReportProps {
    purchases: PaginatedData<Purchase & { user?: { name: string } }>;
    summary: {
        total_amount: number;
        total_due: number;
        count: number;
    };
    filters: {
        from: string;
        to: string;
    };
}

export default function PurchasesReport({ purchases, summary, filters }: PurchasesReportProps) {
    const { format } = useCurrency();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const handleFilter = () => {
        router.get(route('shop.reports.purchases'), { from, to }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Purchases Report', href: route('shop.reports.purchases') }
        ]}>
            <Head title="Purchases & Inward Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Purchases & Vendor Cost Report"
                    description="Inventory acquisitions, procurement costs, supplier payments, and accounts payable"
                />

                <ReportsNav current="purchases" exportType="purchases" from={filters.from} to={filters.to} />

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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Inward Purchases</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(summary.total_amount || 0)}</div>
                            <span className="text-xs text-muted-foreground">{summary.count || 0} purchase orders</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Paid Out</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">
                                {format((summary.total_amount || 0) - (summary.total_due || 0))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-rose-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Outstanding Supplier Due</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-rose-600">{format(summary.total_due || 0)}</div>
                            <span className="text-xs text-muted-foreground">Payable balance</span>
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
                                    <th className="py-3 px-4 text-left">Bill / PO #</th>
                                    <th className="py-3 px-4 text-left">Supplier</th>
                                    <th className="py-3 px-4 text-right">Total Amount</th>
                                    <th className="py-3 px-4 text-right">Paid</th>
                                    <th className="py-3 px-4 text-right">Due</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {purchases.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                            No purchases recorded for this period.
                                        </td>
                                    </tr>
                                ) : (
                                    purchases.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 px-4 font-mono text-muted-foreground">{p.purchase_date}</td>
                                            <td className="py-2.5 px-4 font-mono font-medium">{p.invoice_no || `PO-${p.id}`}</td>
                                            <td className="py-2.5 px-4">{p.supplier?.name || 'Cash Supplier'}</td>
                                            <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">{format(p.total)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono text-emerald-600 font-medium">{format(p.paid_amount)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono text-rose-600 font-medium">{format(p.due_amount)}</td>
                                            <td className="py-2.5 px-4 text-center">
                                                <StatusBadge status={p.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={purchases} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
