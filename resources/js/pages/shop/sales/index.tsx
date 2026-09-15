import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Filter, Eye, Printer, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { Customer, PaginatedData, Sale } from '@/types';

interface SalesIndexProps {
    sales: PaginatedData<Sale & { user?: { name: string } }>;
    customers: Customer[];
    filters: {
        search?: string;
        customer_id?: string;
        status?: string;
        from?: string;
        to?: string;
    };
}

export default function SalesIndex({ sales, customers, filters }: SalesIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search || '');
    const [customerId, setCustomerId] = useState(filters.customer_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const handleFilter = () => {
        router.get(
            route('shop.sales.index'),
            {
                search: search || undefined,
                customer_id: customerId || undefined,
                status: status || undefined,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setCustomerId('');
        setStatus('');
        setFrom('');
        setTo('');
        router.get(route('shop.sales.index'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Sales', href: route('shop.sales.index') }]}>
            <Head title="Sales & Orders History" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Sales & Invoices"
                        description="View completed customer sales, print receipts, and track payment receipts"
                    />

                    <div className="flex items-center gap-2">
                        {can('customer.view') && (
                            <Link href={route('shop.customers.index')}>
                                <Button variant="outline" size="sm">
                                    <Users className="h-4 w-4 mr-1.5" /> Customers
                                </Button>
                            </Link>
                        )}
                        {can('sale.create') && (
                            <Link href={route('shop.sales.create')}>
                                <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                    <ShoppingCart className="h-4 w-4 mr-1.5" /> POS Sale
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by invoice number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>

                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm"
                        >
                            <option value="">All Customers</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm"
                        >
                            <option value="">All Payment Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial Due</option>
                            <option value="pending">Pending</option>
                        </select>

                        <Input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="h-9 text-xs"
                        />

                        <Input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="h-9 text-xs"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs">
                            Reset Filters
                        </Button>
                        <Button size="sm" onClick={handleFilter} className="h-8 text-xs">
                            <Filter className="h-3.5 w-3.5 mr-1" /> Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Date</th>
                                    <th className="py-3.5 px-4 text-left">Invoice</th>
                                    <th className="py-3.5 px-4 text-left">Customer</th>
                                    <th className="py-3.5 px-4 text-right">Total</th>
                                    <th className="py-3.5 px-4 text-right">Paid</th>
                                    <th className="py-3.5 px-4 text-right">Due</th>
                                    <th className="py-3.5 px-4 text-right">Gross Profit</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {sales.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No sales found</p>
                                                <p className="text-xs text-muted-foreground">Process a POS sale to record your first transaction</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sales.data.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                {sale.sale_date}
                                            </td>
                                            <td className="py-3 px-4 font-mono font-medium text-xs text-foreground">
                                                {sale.invoice_no}
                                            </td>
                                            <td className="py-3 px-4 text-xs font-medium text-foreground">
                                                {sale.customer?.name || 'Walking Customer'}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-semibold text-xs text-foreground">
                                                {format(sale.total)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-medium">
                                                {format(sale.paid_amount)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-rose-600 font-medium">
                                                {format(sale.due_amount)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-blue-600 font-medium">
                                                {format(sale.gross_profit)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <StatusBadge status={sale.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('shop.sales.show', sale.id)}>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7" title="View details">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('shop.sales.receipt', sale.id)} target="_blank">
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" title="Print Receipt">
                                                            <Printer className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                </div>
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
