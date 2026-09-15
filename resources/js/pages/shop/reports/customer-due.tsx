import { Head, Link } from '@inertiajs/react';
import { Users, Phone, MapPin, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { Customer, PaginatedData } from '@/types';

interface CustomerDueReportProps {
    customers: PaginatedData<Customer>;
    total_due: number;
}

export default function CustomerDueReport({ customers, total_due }: CustomerDueReportProps) {
    const { format } = useCurrency();

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Customer Due', href: route('shop.reports.customer-due') }
        ]}>
            <Head title="Customer Due Accounts Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Customer Due & Credit Report (বাকি খাতা)"
                    description="Complete summary of outstanding balances owed by retail and credit customers"
                />

                <ReportsNav current="customer-due" />

                {/* Total Due Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="shadow-sm border-rose-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Customer Due Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-3xl font-bold text-rose-600">{format(total_due)}</div>
                            <span className="text-xs text-muted-foreground">Across {customers.total} due accounts</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-left">Customer</th>
                                    <th className="py-3 px-4 text-left">Phone</th>
                                    <th className="py-3 px-4 text-right">Lifetime Sales</th>
                                    <th className="py-3 px-4 text-right">Total Paid</th>
                                    <th className="py-3 px-4 text-right">Remaining Due (বাকি)</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No customers with outstanding due balances. Great job!
                                        </td>
                                    </tr>
                                ) : (
                                    customers.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-foreground">
                                                <Link href={route('shop.customers.show', c.id)} className="hover:text-primary">
                                                    {c.name}
                                                </Link>
                                                {c.address && <span className="text-[11px] text-muted-foreground block">{c.address}</span>}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-muted-foreground">{c.phone || '—'}</td>
                                            <td className="py-3 px-4 text-right font-mono text-foreground">{format(c.total_purchase)}</td>
                                            <td className="py-3 px-4 text-right font-mono text-emerald-600">{format(c.total_paid)}</td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">{format(c.total_due)}</td>
                                            <td className="py-3 px-4 text-right">
                                                <Link href={route('shop.customers.show', c.id)}>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                                        Collect Due
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
                        <Pagination data={customers} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
