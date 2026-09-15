import { Head } from '@inertiajs/react';
import { Boxes, Package, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { LowStockBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product } from '@/types';

interface StockReportProps {
    products: PaginatedData<Product>;
    summary: {
        total_products: number;
        stock_value: number;
    };
}

export default function StockReport({ products, summary }: StockReportProps) {
    const { format } = useCurrency();

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Stock Valuation', href: route('shop.reports.stock') }
        ]}>
            <Head title="Stock Valuation Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Inventory Valuation Report"
                    description="Current warehouse valuation, stock holding cost, and product distribution"
                />

                <ReportsNav current="stock" exportType="stock" />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="shadow-sm border-emerald-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Stock Asset Value</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">{format(summary.stock_value || 0)}</div>
                            <span className="text-xs text-muted-foreground">Based on weighted average unit cost</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Active Catalog Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{summary.total_products || 0}</div>
                            <span className="text-xs text-muted-foreground">Products in stock system</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-left">Product</th>
                                    <th className="py-3 px-4 text-left">Category</th>
                                    <th className="py-3 px-4 text-center">In Stock</th>
                                    <th className="py-3 px-4 text-right">Avg Unit Cost</th>
                                    <th className="py-3 px-4 text-right">Selling Price</th>
                                    <th className="py-3 px-4 text-right">Stock Valuation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {products.data.map((p) => {
                                    const cost = Number(p.avg_cost || p.purchase_price);
                                    const val = Number(p.current_stock) * cost;
                                    return (
                                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 px-4 font-medium text-foreground">
                                                {p.name}
                                                {p.sku && <span className="text-[11px] text-muted-foreground block font-mono">SKU: {p.sku}</span>}
                                            </td>
                                            <td className="py-2.5 px-4 text-muted-foreground">{p.category?.name || '—'}</td>
                                            <td className="py-2.5 px-4 text-center font-bold font-mono">
                                                {p.current_stock} {p.unit?.abbreviation || ''}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">{format(cost)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono font-medium">{format(p.selling_price)}</td>
                                            <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">{format(val)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={products} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
