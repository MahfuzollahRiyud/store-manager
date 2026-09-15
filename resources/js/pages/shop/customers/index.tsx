import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Filter, Eye, Pencil, Trash2, Users, AlertCircle, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { Customer, PaginatedData } from '@/types';

interface CustomersIndexProps {
    customers: PaginatedData<Customer>;
    filters: {
        search?: string;
        has_due?: string;
    };
}

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search || '');
    const [hasDue, setHasDue] = useState(filters.has_due === 'true' || filters.has_due === '1');

    const handleFilter = () => {
        router.get(
            route('shop.customers.index'),
            {
                search: search || undefined,
                has_due: hasDue ? '1' : undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setHasDue(false);
        router.get(route('shop.customers.index'));
    };

    const handleDelete = (c: Customer) => {
        if (confirm(`Are you sure you want to delete customer "${c.name}"?`)) {
            router.delete(route('shop.customers.destroy', c.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Customers', href: route('shop.customers.index') }]}>
            <Head title="Customer Directory & Dues" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Customers & Ledger"
                        description="Manage registered retail customers, purchase history, and outstanding due accounts (বাকি খাতা)"
                    />

                    <div className="flex items-center gap-2">
                        {can('sale.view') && (
                            <Link href={route('shop.sales.index')}>
                                <Button variant="outline" size="sm">
                                    Sales List
                                </Button>
                            </Link>
                        )}
                        {can('customer.create') && (
                            <Link href={route('shop.customers.create')}>
                                <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                    <Plus className="h-4 w-4 mr-1.5" /> Add Customer
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by customer name or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>

                    <Button
                        type="button"
                        variant={hasDue ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            const next = !hasDue;
                            setHasDue(next);
                            router.get(
                                route('shop.customers.index'),
                                { search: search || undefined, has_due: next ? '1' : undefined },
                                { preserveState: true }
                            );
                        }}
                        className={`text-xs h-9 ${hasDue ? 'bg-rose-600 hover:bg-rose-700 text-white' : ''}`}
                    >
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        Due Customers Only
                    </Button>

                    <Button size="sm" onClick={handleFilter} className="h-9 text-xs">
                        <Filter className="h-3.5 w-3.5 mr-1" /> Filter
                    </Button>

                    {(filters.search || filters.has_due) && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 text-xs">
                            Reset
                        </Button>
                    )}
                </div>

                {/* Customers Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Customer</th>
                                    <th className="py-3.5 px-4 text-left">Phone</th>
                                    <th className="py-3.5 px-4 text-right">Total Purchases</th>
                                    <th className="py-3.5 px-4 text-right">Total Paid</th>
                                    <th className="py-3.5 px-4 text-right">Outstanding Due (বাকি)</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Users className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No customers found</p>
                                                <p className="text-xs text-muted-foreground">Add regular customers to keep track of sales credit & dues</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    customers.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4">
                                                <Link href={route('shop.customers.show', c.id)} className="font-semibold text-xs text-foreground hover:text-primary">
                                                    {c.name}
                                                </Link>
                                                {c.address && (
                                                    <span className="text-[11px] text-muted-foreground block line-clamp-1">
                                                        {c.address}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                {c.phone || '—'}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-foreground">
                                                {format(c.total_purchase)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-medium">
                                                {format(c.total_paid)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-xs text-rose-600">
                                                {format(c.total_due)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <StatusBadge status={c.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('shop.customers.show', c.id)}>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7" title="View Customer Ledger">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                    {can('customer.edit') && (
                                                        <Link href={route('shop.customers.edit', c.id)}>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-600" title="Edit Customer">
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('customer.delete') && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                            onClick={() => handleDelete(c)}
                                                            title="Delete Customer"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
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
