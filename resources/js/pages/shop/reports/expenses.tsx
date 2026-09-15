import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Filter, Receipt, PieChart as PieIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { Expense, PaginatedData } from '@/types';

interface ExpenseReportProps {
    expenses: PaginatedData<Expense & { user?: { name: string } }>;
    by_category: Array<{
        expense_category_id: number | null;
        total: number;
        category?: { id: number; name: string };
    }>;
    filters: {
        from: string;
        to: string;
    };
}

export default function ExpensesReport({ expenses, by_category, filters }: ExpenseReportProps) {
    const { format } = useCurrency();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const handleFilter = () => {
        router.get(route('shop.reports.expenses'), { from, to }, { preserveState: true });
    };

    const totalExpense = by_category.reduce((sum, item) => sum + Number(item.total), 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Expenses Report', href: route('shop.reports.expenses') }
        ]}>
            <Head title="Expense Analysis Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Expense Analysis Report"
                    description="Category-wise expense breakdown, operational costs, and outflow ledger"
                />

                <ReportsNav current="expenses" exportType="expenses" from={filters.from} to={filters.to} />

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

                {/* Category Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-purple-500/20 col-span-1 sm:col-span-2 md:col-span-1">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Period Expenses</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-purple-600">{format(totalExpense)}</div>
                            <span className="text-xs text-muted-foreground">{expenses.total} transaction items</span>
                        </CardContent>
                    </Card>

                    {by_category.slice(0, 3).map((c, idx) => (
                        <Card key={idx} className="shadow-sm">
                            <CardHeader className="p-4 pb-1">
                                <CardTitle className="text-xs font-medium text-muted-foreground line-clamp-1">
                                    {c.category?.name || 'General / Uncategorized'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-1">
                                <div className="text-xl font-bold text-foreground">{format(c.total)}</div>
                                <span className="text-xs text-muted-foreground">
                                    {totalExpense > 0 ? `${((Number(c.total) / totalExpense) * 100).toFixed(1)}% of total` : ''}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Expenses Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Category</th>
                                    <th className="py-3 px-4 text-left">Description</th>
                                    <th className="py-3 px-4 text-left">Method</th>
                                    <th className="py-3 px-4 text-right">Amount</th>
                                    <th className="py-3 px-4 text-left pl-4">Staff</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {expenses.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No expenses logged for this period.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.data.map((e) => (
                                        <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 px-4 font-mono text-muted-foreground">{e.expense_date}</td>
                                            <td className="py-2.5 px-4 font-medium">{e.category?.name || 'General Expense'}</td>
                                            <td className="py-2.5 px-4 text-muted-foreground">{e.description || '—'}</td>
                                            <td className="py-2.5 px-4 capitalize">{e.payment_method?.replace('_', ' ') || 'Cash'}</td>
                                            <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600">{format(e.amount)}</td>
                                            <td className="py-2.5 px-4 pl-4 text-muted-foreground text-[11px]">{e.user?.name || 'Staff'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={expenses} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
