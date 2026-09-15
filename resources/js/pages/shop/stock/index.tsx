import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Boxes,
    Search,
    Filter,
    AlertTriangle,
    SlidersHorizontal,
    History,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { LowStockBadge } from '@/components/status-badge';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product } from '@/types';

interface StockIndexProps {
    products: PaginatedData<Product>;
    filters: {
        search?: string;
        category_id?: string;
        low_stock?: string;
    };
}

export default function StockIndex({ products, filters }: StockIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search || '');
    const [lowStockOnly, setLowStockOnly] = useState(filters.low_stock === 'true');
    const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

    const adjustForm = useForm({
        product_id: '',
        physical_qty: '',
        reason: '',
    });

    const handleFilter = () => {
        router.get(
            route('shop.stock.index'),
            {
                search: search || undefined,
                low_stock: lowStockOnly ? 'true' : undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setLowStockOnly(false);
        router.get(route('shop.stock.index'));
    };

    const handleOpenAdjust = (p: Product) => {
        setAdjustingProduct(p);
        adjustForm.setData({
            product_id: String(p.id),
            physical_qty: String(p.current_stock),
            reason: '',
        });
    };

    const handleAdjustSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        adjustForm.post(route('shop.stock.adjust'), {
            onSuccess: () => {
                setAdjustingProduct(null);
                adjustForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock', href: route('shop.stock.index') }]}>
            <Head title="Inventory Stock Management" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Stock Management"
                        description="Live warehouse quantities, low-stock warnings, and physical stock reconciliation"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.stock.movements')}>
                            <Button variant="outline" size="sm">
                                <History className="h-4 w-4 mr-1.5" /> Stock Movements
                            </Button>
                        </Link>
                        <Link href={route('shop.purchases.create')}>
                            <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                Restock Purchase
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by product name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>

                    <Button
                        type="button"
                        variant={lowStockOnly ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            const next = !lowStockOnly;
                            setLowStockOnly(next);
                            router.get(
                                route('shop.stock.index'),
                                { search: search || undefined, low_stock: next ? 'true' : undefined },
                                { preserveState: true }
                            );
                        }}
                        className={`text-xs h-9 ${lowStockOnly ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                    >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Low Stock Only
                    </Button>

                    <Button size="sm" onClick={handleFilter} className="h-9 text-xs">
                        Filter
                    </Button>

                    {(filters.search || filters.low_stock) && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 text-xs">
                            Reset
                        </Button>
                    )}
                </div>

                {/* Stock Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Product</th>
                                    <th className="py-3.5 px-4 text-left">Category</th>
                                    <th className="py-3.5 px-4 text-center">Current Stock</th>
                                    <th className="py-3.5 px-4 text-center">Alert Limit</th>
                                    <th className="py-3.5 px-4 text-right">Avg Unit Cost</th>
                                    <th className="py-3.5 px-4 text-right">Stock Valuation</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Boxes className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No inventory records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => {
                                        const cost = Number(product.avg_cost || product.purchase_price);
                                        const stockVal = Number(product.current_stock) * cost;

                                        return (
                                            <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <Link href={route('shop.products.show', product.id)} className="font-semibold text-xs text-foreground hover:text-primary">
                                                        {product.name}
                                                    </Link>
                                                    {product.sku && (
                                                        <span className="text-[11px] text-muted-foreground block font-mono">
                                                            SKU: {product.sku}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-xs text-muted-foreground">
                                                    {product.category?.name || '—'}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-bold text-xs font-mono">
                                                            {product.current_stock} {product.unit?.abbreviation || ''}
                                                        </span>
                                                        <LowStockBadge currentStock={product.current_stock} minStock={product.min_stock_level} />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center font-mono text-xs text-muted-foreground">
                                                    {product.min_stock_level} {product.unit?.abbreviation || ''}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-xs text-muted-foreground">
                                                    {format(cost)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-semibold text-xs text-foreground">
                                                    {format(stockVal)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {can('stock.adjust') && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs"
                                                                onClick={() => handleOpenAdjust(product)}
                                                            >
                                                                <SlidersHorizontal className="h-3 w-3 mr-1" /> Adjust Stock
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={products} />
                    </div>
                </div>

                {/* Stock Adjustment Dialog */}
                <Dialog open={!!adjustingProduct} onOpenChange={(open) => !open && setAdjustingProduct(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Physical Stock Adjustment</DialogTitle>
                            <DialogDescription>
                                Reconcile physical count for: <strong className="text-foreground">{adjustingProduct?.name}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdjustSubmit} className="space-y-4">
                            <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Recorded Stock:</span>
                                    <span className="font-mono font-bold">
                                        {adjustingProduct?.current_stock} {adjustingProduct?.unit?.abbreviation || ''}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Valuation Cost:</span>
                                    <span className="font-mono">{format(adjustingProduct?.avg_cost || adjustingProduct?.purchase_price)}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phys-qty">Actual Count / New Quantity *</Label>
                                <Input
                                    id="phys-qty"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={adjustForm.data.physical_qty}
                                    onChange={(e) => adjustForm.setData('physical_qty', e.target.value)}
                                    required
                                />
                                <InputError message={adjustForm.errors.physical_qty} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="adj-reason">Reason for Adjustment *</Label>
                                <textarea
                                    id="adj-reason"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-sm"
                                    placeholder="e.g. Broken/damaged goods, physical count correction, expired items"
                                    value={adjustForm.data.reason}
                                    onChange={(e) => adjustForm.setData('reason', e.target.value)}
                                    required
                                />
                                <InputError message={adjustForm.errors.reason} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setAdjustingProduct(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={adjustForm.processing} className="bg-primary text-primary-foreground">
                                    {adjustForm.processing ? 'Saving...' : 'Apply Stock Adjustment'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
