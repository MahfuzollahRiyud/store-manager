import { Head, Link } from '@inertiajs/react';
import { Truck, Phone, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Supplier } from '@/types';

interface SupplierDueReportProps {
    suppliers: PaginatedData<Supplier>;
    total_due: number;
}

export default function SupplierDueReport({ suppliers, total_due }: SupplierDueReportProps) {
    const { format } = useCurrency();

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Supplier Due', href: route('shop.reports.supplier-due') }
        ]}>
            <Head title="Supplier Due Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Supplier Due & Accounts Payable Report"
                    description="Pending payment liabilities owed to wholesale distributors and vendors"
                />

                <ReportsNav current="supplier-due" />

                {/* Total Due Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="shadow-sm border-rose-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Accounts Payable (Supplier Dues)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-3xl font-bold text-rose-600">{format(total_due)}</div>
                            <span className="text-xs text-muted-foreground">Across {suppliers.total} active suppliers</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-left">Supplier / Vendor</th>
                                    <th className="py-3 px-4 text-left">Phone</th>
                                    <th className="py-3 px-4 text-right">Total Purchases</th>
                                    <th className="py-3 px-4 text-right">Total Settled</th>
                                    <th className="py-3 px-4 text-right">Outstanding Payable</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {suppliers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No outstanding supplier dues. All bills are clear!
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.data.map((s) => (
                                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-foreground">
                                                <Link href={route('shop.suppliers.show', s.id)} className="hover:text-primary">
                                                    {s.name}
                                                </Link>
                                                {s.address && <span className="text-[11px] text-muted-foreground block">{s.address}</span>}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-muted-foreground">{s.phone || '—'}</td>
                                            <td className="py-3 px-4 text-right font-mono text-foreground">{format(s.total_purchase)}</td>
                                            <td className="py-3 px-4 text-right font-mono text-emerald-600">{format(s.total_paid)}</td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">{format(s.total_due)}</td>
                                            <td className="py-3 px-4 text-right">
                                                <Link href={route('shop.suppliers.show', s.id)}>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                                        View & Pay
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={suppliers} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
