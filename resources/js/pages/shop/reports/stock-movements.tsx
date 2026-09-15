import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Filter, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product, StockMovement } from '@/types';

interface StockMovementsReportProps {
    movements: PaginatedData<StockMovement>;
    products: Product[];
    filters: {
        from: string;
        to: string;
        product_id?: string;
        type?: string;
    };
}

export default function StockMovementsReport({ movements, products, filters }: StockMovementsReportProps) {
    const { format } = useCurrency();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [productId, setProductId] = useState(filters.product_id || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = () => {
        router.get(
            route('shop.reports.stock-movements'),
            {
                from,
                to,
                product_id: productId || undefined,
                type: type || undefined,
            },
            { preserveState: true }
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Stock Movements', href: route('shop.reports.stock-movements') }
        ]}>
            <Head title="Stock Movements Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Stock Movement Ledger Report"
                    description="Audit trail of all inward and outward inventory transactions"
                />

                <ReportsNav current="stock-movements" from={filters.from} to={filters.to} />

                {/* Filter */}
                <div className="p-3 bg-card rounded-xl border border-border/60 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="h-8 text-xs rounded-md border border-input bg-background px-2"
                    >
                        <option value="">All Products</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-8 text-xs rounded-md border border-input bg-background px-2"
                    >
                        <option value="">All Movement Types</option>
                        <option value="purchase">Purchase</option>
                        <option value="sale">Sale</option>
                        <option value="opening_stock">Opening Stock</option>
                        <option value="adjustment_add">Adjustment (+)</option>
                        <option value="adjustment_subtract">Adjustment (-)</option>
                        <option value="sale_return">Sale Return</option>
                    </select>

                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-8 text-xs"
                    />

                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-8 text-xs"
                    />

                    <Button size="sm" onClick={handleFilter} className="h-8 text-xs">
                        <Filter className="h-3 w-3 mr-1" /> Filter
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-left">Date & Time</th>
                                    <th className="py-3 px-4 text-left">Product</th>
                                    <th className="py-3 px-4 text-left">Movement Type</th>
                                    <th className="py-3 px-4 text-right">Quantity</th>
                                    <th className="py-3 px-4 text-right">Unit Cost</th>
                                    <th className="py-3 px-4 text-left pl-4">Staff / Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {movements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No stock movement records found for this period.
                                        </td>
                                    </tr>
                                ) : (
                                    movements.data.map((m) => {
                                        const isAdd = ['purchase', 'opening_stock', 'sale_return', 'adjustment_add'].includes(m.type);
                                        return (
                                            <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-2.5 px-4 font-mono text-muted-foreground">
                                                    {new Date(m.created_at).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="py-2.5 px-4 font-medium">{m.product?.name || 'Deleted Product'}</td>
                                                <td className="py-2.5 px-4 capitalize">{m.type.replace(/_/g, ' ')}</td>
                                                <td className={`py-2.5 px-4 text-right font-mono font-bold ${
                                                    isAdd ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                    {isAdd ? `+${m.quantity}` : `-${m.quantity}`}
                                                </td>
                                                <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">{format(m.unit_cost)}</td>
                                                <td className="py-2.5 px-4 pl-4 text-muted-foreground text-[11px]">
                                                    {m.user?.name && <span className="font-semibold text-foreground">{m.user.name}: </span>}
                                                    {m.notes || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={movements} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
