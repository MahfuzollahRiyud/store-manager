import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Boxes,
    Tag,
    Scale,
    TrendingUp,
    Receipt,
    History,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { LowStockBadge, StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product, StockMovement } from '@/types';

interface ShowProductProps {
    product: Product & { description?: string; brand?: string };
    movements: PaginatedData<StockMovement>;
}

export default function ShowProduct({ product, movements }: ShowProductProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const cost = Number(product.avg_cost || product.purchase_price);
    const price = Number(product.selling_price);
    const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : '0';
    const totalStockValue = Number(product.current_stock) * cost;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('shop.products.index') },
            { title: product.name, href: route('shop.products.show', product.id) }
        ]}>
            <Head title={`Product: ${product.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={product.name}
                        description={product.brand ? `Brand: ${product.brand}` : 'Product details and stock movement ledger'}
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.products.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                            </Button>
                        </Link>
                        {can('product.edit') && (
                            <Link href={route('shop.products.edit', product.id)}>
                                <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                    <Pencil className="h-4 w-4 mr-1.5" /> Edit Product
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Current Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">
                                {product.current_stock} <span className="text-sm font-normal text-muted-foreground">{product.unit?.abbreviation || ''}</span>
                            </div>
                            <div className="mt-1">
                                <LowStockBadge currentStock={product.current_stock} minStock={product.min_stock_level} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Selling Price</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(price)}</div>
                            <span className="text-xs text-emerald-600 font-medium">Margin: {margin}%</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Weighted Avg Cost</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(cost)}</div>
                            <span className="text-xs text-muted-foreground">Original: {format(product.purchase_price)}</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Stock Value</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(totalStockValue)}</div>
                            <span className="text-xs text-muted-foreground">At average cost</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Product Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg border border-border"
                                />
                            ) : (
                                <div className="w-full h-48 bg-muted/40 rounded-lg border border-border/60 flex items-center justify-center">
                                    <Boxes className="h-12 w-12 text-muted-foreground/40" />
                                </div>
                            )}

                            <div className="space-y-2 text-xs divide-y divide-border/60">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-muted-foreground">Category:</span>
                                    <span className="font-medium text-foreground">{product.category?.name || '—'}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-muted-foreground">SKU:</span>
                                    <span className="font-mono text-foreground">{product.sku || '—'}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-muted-foreground">Barcode:</span>
                                    <span className="font-mono text-foreground">{product.barcode || '—'}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-muted-foreground">Alert Level:</span>
                                    <span className="font-medium text-foreground">{product.min_stock_level}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-muted-foreground">Status:</span>
                                    <StatusBadge status={product.status} />
                                </div>
                            </div>

                            {product.description && (
                                <div className="pt-2 border-t border-border/60">
                                    <p className="text-xs text-muted-foreground mb-1 font-medium">Description:</p>
                                    <p className="text-xs text-foreground whitespace-pre-wrap">{product.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stock Movement History */}
                    <Card className="lg:col-span-2 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold">Stock Movement Ledger</CardTitle>
                                    <CardDescription>Complete audit trail of stock entries, sales, purchases, and adjustments</CardDescription>
                                </div>
                                <History className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold text-muted-foreground">
                                            <th className="text-left pb-2">Date & Time</th>
                                            <th className="text-left pb-2">Movement Type</th>
                                            <th className="text-right pb-2">Quantity</th>
                                            <th className="text-right pb-2">Unit Cost</th>
                                            <th className="text-left pb-2 pl-3">Staff / Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {movements.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                                                    No movement history recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            movements.data.map((m) => {
                                                const isAdd = ['purchase', 'opening_stock', 'sale_return', 'adjustment_add'].includes(m.type);
                                                return (
                                                    <tr key={m.id} className="hover:bg-muted/30 transition-colors text-xs">
                                                        <td className="py-2.5 font-mono text-[11px] text-muted-foreground">
                                                            {new Date(m.created_at).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </td>
                                                        <td className="py-2.5">
                                                            <span className="capitalize font-medium text-foreground">
                                                                {m.type.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td className={`py-2.5 text-right font-semibold font-mono ${
                                                            isAdd ? 'text-emerald-600' : 'text-rose-600'
                                                        }`}>
                                                            {isAdd ? `+${m.quantity}` : `-${m.quantity}`}
                                                        </td>
                                                        <td className="py-2.5 text-right font-mono text-muted-foreground">
                                                            {format(m.unit_cost)}
                                                        </td>
                                                        <td className="py-2.5 pl-3 text-muted-foreground text-[11px]">
                                                            {m.user?.name && <span className="font-medium text-foreground">{m.user.name}: </span>}
                                                            {m.notes || '—'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pt-4 border-t border-border/60">
                                <Pagination data={movements} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
