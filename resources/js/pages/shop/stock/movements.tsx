import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Filter, History, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product, StockMovement } from '@/types';

interface MovementsProps {
    movements: PaginatedData<StockMovement>;
    products: Product[];
    filters: {
        product_id?: string;
        type?: string;
        from?: string;
        to?: string;
    };
}

export default function StockMovements({ movements, products, filters }: MovementsProps) {
    const { format } = useCurrency();

    const [productId, setProductId] = useState(filters.product_id || '');
    const [type, setType] = useState(filters.type || '');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const handleFilter = () => {
        router.get(
            route('shop.stock.movements'),
            {
                product_id: productId || undefined,
                type: type || undefined,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setProductId('');
        setType('');
        setFrom('');
        setTo('');
        router.get(route('shop.stock.movements'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Stock', href: route('shop.stock.index') },
            { title: 'Movements', href: route('shop.stock.movements') }
        ]}>
            <Head title="Stock Movement Audit Trail" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Stock Movement Ledger"
                        description="Comprehensive historical log of every unit added, sold, returned, or adjusted in your shop"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.stock.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Stock
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="h-9 text-xs rounded-md border border-input bg-background px-3 shadow-sm"
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
                        className="h-9 text-xs rounded-md border border-input bg-background px-3 shadow-sm"
                    >
                        <option value="">All Types</option>
                        <option value="purchase">Purchase (Inward)</option>
                        <option value="sale">Sale (Outward)</option>
                        <option value="opening_stock">Opening Stock</option>
                        <option value="adjustment_add">Adjustment (+)</option>
                        <option value="adjustment_subtract">Adjustment (-)</option>
                        <option value="sale_return">Customer Return</option>
                        <option value="purchase_return">Supplier Return</option>
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

                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleFilter} className="h-9 text-xs flex-1">
                            <Filter className="h-3.5 w-3.5 mr-1" /> Filter
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 text-xs">
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Movements Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Timestamp</th>
                                    <th className="py-3.5 px-4 text-left">Product</th>
                                    <th className="py-3.5 px-4 text-left">Type</th>
                                    <th className="py-3.5 px-4 text-right">Quantity</th>
                                    <th className="py-3.5 px-4 text-right">Unit Cost</th>
                                    <th className="py-3.5 px-4 text-left pl-4">Staff / Reference Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {movements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <History className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No stock movement logs found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    movements.data.map((m) => {
                                        const isAddition = ['purchase', 'opening_stock', 'sale_return', 'adjustment_add'].includes(m.type);
                                        return (
                                            <tr key={m.id} className="hover:bg-muted/30 transition-colors text-xs">
                                                <td className="py-3 px-4 font-mono text-muted-foreground">
                                                    {new Date(m.created_at).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-foreground">
                                                    {m.product?.name || 'Deleted Product'}
                                                </td>
                                                <td className="py-3 px-4 capitalize text-foreground font-medium">
                                                    {m.type.replace(/_/g, ' ')}
                                                </td>
                                                <td className={`py-3 px-4 text-right font-mono font-bold ${
                                                    isAddition ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                    {isAddition ? `+${m.quantity}` : `-${m.quantity}`}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                                                    {format(m.unit_cost)}
                                                </td>
                                                <td className="py-3 px-4 pl-4 text-muted-foreground text-[11px]">
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
