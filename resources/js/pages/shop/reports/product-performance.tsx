import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Filter, Award, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { ReportsNav } from '@/components/reports-nav';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';

interface ProductPerfItem {
    product_id: number;
    name: string;
    sku: string | null;
    total_qty_sold: number;
    total_revenue: number;
    total_profit: number;
    avg_selling_price: number;
}

interface ProductPerformanceReportProps {
    products: PaginatedData<ProductPerfItem>;
    filters: {
        from: string;
        to: string;
    };
}

export default function ProductPerformanceReport({ products, filters }: ProductPerformanceReportProps) {
    const { format } = useCurrency();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const handleFilter = () => {
        router.get(route('shop.reports.product-performance'), { from, to }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: route('shop.reports.sales') },
            { title: 'Product Performance', href: route('shop.reports.product-performance') }
        ]}>
            <Head title="Product Performance & Sales Velocity Report" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Product Performance & Sales Velocity"
                    description="Best-selling items, revenue contributors, and highest gross-profit generating products"
                />

                <ReportsNav current="product-performance" from={filters.from} to={filters.to} />

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

                {/* Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-center w-12">#</th>
                                    <th className="py-3 px-4 text-left">Product Name</th>
                                    <th className="py-3 px-4 text-center">Units Sold</th>
                                    <th className="py-3 px-4 text-right">Avg Unit Price</th>
                                    <th className="py-3 px-4 text-right">Total Revenue</th>
                                    <th className="py-3 px-4 text-right">Gross Profit</th>
                                    <th className="py-3 px-4 text-center">Margin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                            No product sales data found for this date range.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((p, idx) => {
                                        const margin = Number(p.total_revenue) > 0
                                            ? ((Number(p.total_profit) / Number(p.total_revenue)) * 100).toFixed(1)
                                            : '0';

                                        return (
                                            <tr key={p.product_id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4 text-center font-bold text-muted-foreground">
                                                    {(products.current_page - 1) * products.per_page + idx + 1}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link href={route('shop.products.show', p.product_id)} className="font-semibold text-foreground hover:text-primary">
                                                        {p.name}
                                                    </Link>
                                                    {p.sku && <span className="text-[11px] text-muted-foreground block font-mono">SKU: {p.sku}</span>}
                                                </td>
                                                <td className="py-3 px-4 text-center font-mono font-bold text-xs">
                                                    {p.total_qty_sold}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                                                    {format(p.avg_selling_price)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                                                    {format(p.total_revenue)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">
                                                    {format(p.total_profit)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                        Number(margin) >= 20
                                                            ? 'bg-emerald-500/10 text-emerald-600'
                                                            : Number(margin) > 0
                                                            ? 'bg-blue-500/10 text-blue-600'
                                                            : 'bg-rose-500/10 text-rose-600'
                                                    }`}>
                                                        {margin}%
                                                    </span>
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
            </div>
        </AppLayout>
    );
}
