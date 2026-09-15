import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Filter, Eye, PackagePlus, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Purchase } from '@/types';

interface PurchasesIndexProps {
    purchases: PaginatedData<Purchase & { user?: { name: string } }>;
    suppliers: Array<{ id: number; name: string }>;
    filters: {
        search?: string;
        supplier_id?: string;
        status?: string;
        from?: string;
        to?: string;
    };
}

export default function PurchasesIndex({ purchases, suppliers, filters }: PurchasesIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search || '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const handleFilter = () => {
        router.get(
            route('shop.purchases.index'),
            {
                search: search || undefined,
                supplier_id: supplierId || undefined,
                status: status || undefined,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setSupplierId('');
        setStatus('');
        setFrom('');
        setTo('');
        router.get(route('shop.purchases.index'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Purchases', href: route('shop.purchases.index') }]}>
            <Head title="Purchases & Restock" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Purchases & Inward Stock"
                        description="Track restock purchases from suppliers, payments, and supplier dues"
                    />

                    <div className="flex items-center gap-2">
                        {can('supplier.view') && (
                            <Link href={route('shop.suppliers.index')}>
                                <Button variant="outline" size="sm">
                                    <Truck className="h-4 w-4 mr-1.5" /> Suppliers
                                </Button>
                            </Link>
                        )}
                        {can('purchase.create') && (
                            <Link href={route('shop.purchases.create')}>
                                <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                    <Plus className="h-4 w-4 mr-1.5" /> New Purchase
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
                                placeholder="Invoice or PO number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>

                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            className="h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Suppliers</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Payment Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="pending">Pending</option>
                        </select>

                        <Input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="h-9 text-xs"
                            placeholder="From Date"
                        />

                        <Input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="h-9 text-xs"
                            placeholder="To Date"
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

                {/* Purchases Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Date</th>
                                    <th className="py-3.5 px-4 text-left">PO / Invoice #</th>
                                    <th className="py-3.5 px-4 text-left">Supplier</th>
                                    <th className="py-3.5 px-4 text-right">Total</th>
                                    <th className="py-3.5 px-4 text-right">Paid</th>
                                    <th className="py-3.5 px-4 text-right">Due</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {purchases.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <PackagePlus className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No purchases recorded yet</p>
                                                <p className="text-xs text-muted-foreground">Click 'New Purchase' to record inward stock from a supplier</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    purchases.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                {p.purchase_date}
                                            </td>
                                            <td className="py-3 px-4 font-mono font-medium text-xs text-foreground">
                                                {p.invoice_no || `PO-${p.id}`}
                                            </td>
                                            <td className="py-3 px-4 text-xs font-medium text-foreground">
                                                {p.supplier?.name || 'Cash Supplier'}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-semibold text-xs text-foreground">
                                                {format(p.total)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-medium">
                                                {format(p.paid_amount)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-rose-600 font-medium">
                                                {format(p.due_amount)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Link href={route('shop.purchases.show', p.id)}>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7" title="View details">
                                                        <Eye className="h-3.5 w-3.5" />
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
                        <Pagination data={purchases} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
