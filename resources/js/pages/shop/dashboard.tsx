import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Package,
    AlertTriangle,
    Users,
    Receipt,
    PlusCircle,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Plus,
    Search,
    Boxes,
    HandCoins,
    BarChart3,
    CheckCircle2,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateFilter } from '@/components/date-filter';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';

interface DashboardProps {
    stats: {
        sales: {
            count: number;
            total_revenue: number;
            total_profit: number;
            total_cost: number;
            total_discount: number;
        };
        purchases: {
            count: number;
            total_amount: number;
            total_due: number;
        };
        expenses: {
            total: number;
        };
        stock: {
            total_products: number;
            stock_value: number;
            low_stock_count: number;
        };
        customers: {
            total_customers: number;
            total_due: number;
        };
        recent_sales: Array<{
            id: number;
            invoice_no: string;
            sale_date: string;
            total: number;
            paid_amount: number;
            due_amount: number;
            status: string;
            customer?: { id: number; name: string };
        }>;
        recent_purchases: Array<{
            id: number;
            invoice_no: string;
            purchase_date: string;
            total: number;
            paid_amount: number;
            due_amount: number;
            status: string;
            supplier?: { id: number; name: string };
        }>;
        low_stock: Array<{
            id: number;
            name: string;
            current_stock: number;
            min_stock_level: number;
            unit?: { abbreviation: string };
        }>;
        best_sellers: Array<{
            product_id: number;
            name: string;
            total_qty: number;
            total_revenue: number;
            total_profit: number;
        }>;
        product_sales?: Array<{
            product_id: number;
            product_name: string;
            barcode: string | null;
            category_name: string | null;
            unit_name: string | null;
            current_stock: number;
            min_stock_level: number;
            total_qty: number;
            total_revenue: number;
            total_profit: number;
            avg_price: number;
        }>;
        chart_data: {
            labels: string[];
            data: Array<{
                date: string;
                revenue: number;
                profit: number;
                purchases: number;
            }>;
        };
    };
    period: string;
    from: string | null;
    to: string | null;
}

export default function ShopDashboard({ stats, period, from, to }: DashboardProps) {
    const { format } = useCurrency();
    const { can, hasRole } = usePermissions();
    const [productSearch, setProductSearch] = useState('');

    const isSalesStaffOnly = hasRole('sales_staff') && !can('report.view');
    const netProfit = stats.sales.total_profit - stats.expenses.total;
    const productSales = stats.product_sales || [];

    const filteredProductSales = productSales.filter((item) =>
        item.product_name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (item.barcode && item.barcode.includes(productSearch)) ||
        (item.category_name && item.category_name.toLowerCase().includes(productSearch.toLowerCase()))
    );

    const totalDistinctItemsSold = productSales.length;
    const totalUnitsSold = productSales.reduce((sum, item) => sum + Number(item.total_qty || 0), 0);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: route('shop.dashboard') }]}>
            <Head title="Store Dashboard" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header & Date Filter */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <PageHeader
                        title="Dashboard"
                        description="Real-time performance overview of your shop inventory, sales, and profits"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <DateFilter
                            currentPeriod={period}
                            currentFrom={from || ''}
                            currentTo={to || ''}
                            baseUrl={route('shop.dashboard')}
                        />
                        <Link href={route('shop.sales.create')}>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                POS Sale
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Fast Quick-Action Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link href={route('shop.sales.create')} className="w-full">
                        <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span>নতুন বিক্রি / POS (F2)</span>
                        </Button>
                    </Link>
                    <Link href={route('shop.products.create')} className="w-full">
                        <Button variant="outline" className="w-full h-11 border-primary/30 text-foreground font-medium text-xs sm:text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            <span>নতুন পণ্য / Add Product</span>
                        </Button>
                    </Link>
                    <Link href={route('shop.customers.index')} className="w-full">
                        <Button variant="outline" className="w-full h-11 border-amber-500/30 text-foreground font-medium text-xs sm:text-sm hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all flex items-center justify-center gap-2">
                            <HandCoins className="h-4 w-4 text-amber-600" />
                            <span>বাকি খাতা / Customer Due</span>
                        </Button>
                    </Link>
                    <Link href={route('shop.stock.index')} className="w-full">
                        <Button variant="outline" className="w-full h-11 border-blue-500/30 text-foreground font-medium text-xs sm:text-sm hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-center gap-2">
                            <Boxes className="h-4 w-4 text-blue-600" />
                            <span>স্টক হিসাব / Stock Status</span>
                        </Button>
                    </Link>
                </div>

                {/* Low Stock Warning Banner */}
                {stats.stock.low_stock_count > 0 && (
                    <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <p className="text-sm font-medium">
                                <span className="font-bold">{stats.stock.low_stock_count}</span> products are below the minimum stock alert level!
                            </p>
                        </div>
                        <Link href={route('shop.stock.index', { filter: 'low' })}>
                            <Button size="sm" variant="outline" className="border-amber-500/30 text-xs hover:bg-amber-500/10">
                                View Low Stock
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard
                        title="Total Sales"
                        value={format(stats.sales.total_revenue)}
                        subtitle={`${stats.sales.count} invoices recorded`}
                        icon={DollarSign}
                        className="border-emerald-500/20 hover:border-emerald-500/40"
                    />
                    {!isSalesStaffOnly ? (
                        <>
                            <StatCard
                                title="Gross Profit"
                                value={format(stats.sales.total_profit)}
                                subtitle={`Net: ${format(netProfit)}`}
                                icon={TrendingUp}
                                className="border-blue-500/20 hover:border-blue-500/40"
                            />
                            <StatCard
                                title="Total Expenses"
                                value={format(stats.expenses.total)}
                                subtitle="Operating overheads"
                                icon={Receipt}
                                className="border-purple-500/20 hover:border-purple-500/40"
                            />
                            <StatCard
                                title="Customer Due"
                                value={format(stats.customers.total_due)}
                                subtitle={`Across ${stats.customers.total_customers} customers`}
                                icon={Users}
                                className="border-amber-500/20 hover:border-amber-500/40"
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                title="Invoices Created"
                                value={stats.sales.count}
                                subtitle="Transactions in period"
                                icon={Receipt}
                                className="border-blue-500/20 hover:border-blue-500/40"
                            />
                            <StatCard
                                title="Customer Due"
                                value={format(stats.customers.total_due)}
                                subtitle={`Across ${stats.customers.total_customers} customers`}
                                icon={Users}
                                className="border-amber-500/20 hover:border-amber-500/40"
                            />
                            <StatCard
                                title="Low Stock Items"
                                value={stats.stock.low_stock_count}
                                subtitle="Needs restock"
                                icon={AlertTriangle}
                                className="border-rose-500/20 hover:border-rose-500/40"
                            />
                        </>
                    )}
                </div>

                {/* Secondary Row: Inventory & Purchases overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                <span>Purchases & Restock</span>
                                <PlusCircle className="h-4 w-4 text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{format(stats.purchases.total_amount)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Supplier Due: <span className="font-semibold text-rose-500">{format(stats.purchases.total_due)}</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                <span>Total Stock Asset Value</span>
                                <Package className="h-4 w-4 text-emerald-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{format(stats.stock.stock_value)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Based on {stats.stock.total_products} active items
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                <span>Quick Operations</span>
                                <ShoppingCart className="h-4 w-4 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2 pt-1">
                            <Link href={route('shop.sales.create')}>
                                <Button size="sm" variant="outline" className="text-xs h-8">
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Sale
                                </Button>
                            </Link>
                            <Link href={route('shop.purchases.create')}>
                                <Button size="sm" variant="outline" className="text-xs h-8">
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Purchase
                                </Button>
                            </Link>
                            <Link href={route('shop.products.create')}>
                                <Button size="sm" variant="outline" className="text-xs h-8">
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Product
                                </Button>
                            </Link>
                            <Link href={route('shop.expenses.index')}>
                                <Button size="sm" variant="outline" className="text-xs h-8">
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Expense
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales & Profit Chart */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Sales & Gross Profit Trends</CardTitle>
                                <CardDescription>Daily revenue, profit, and restock purchase volume</CardDescription>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span>Revenue</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                    <span>Gross Profit</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                    <span>Purchases</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.chart_data.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        formatter={(val: any) => [format(Number(val ?? 0)), '']}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Sold Breakdown Table */}
                <Card className="shadow-sm border border-border/70">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">
                                    আজকের বিক্রিত পণ্যের হিসাব / Products Sold Breakdown
                                </CardTitle>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {totalDistinctItemsSold} Products ({totalUnitsSold} Units)
                                </span>
                            </div>
                            <CardDescription>
                                Detailed item-by-item sales performance, quantities moved, and realized revenue for this period
                            </CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="পণ্য বা বারকোড খুঁজুন..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="pl-8 h-8 text-xs bg-muted/30"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b text-[11px] text-muted-foreground bg-muted/20">
                                        <th className="text-left py-2.5 px-3">Product (পণ্য)</th>
                                        <th className="text-left py-2.5 px-3">Category (ক্যাটাগরি)</th>
                                        <th className="text-center py-2.5 px-3">Qty Sold (পরিমাণ)</th>
                                        <th className="text-right py-2.5 px-3">Avg Selling Price</th>
                                        <th className="text-right py-2.5 px-3 font-semibold">Total Revenue (মোট বিক্রি)</th>
                                        {!isSalesStaffOnly && (
                                            <th className="text-right py-2.5 px-3 font-semibold text-emerald-600">
                                                Profit (লাভ)
                                            </th>
                                        )}
                                        <th className="text-center py-2.5 px-3">Stock Left (মজুদ)</th>
                                        <th className="text-right py-2.5 px-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {filteredProductSales.length === 0 ? (
                                        <tr>
                                            <td colSpan={isSalesStaffOnly ? 7 : 8} className="py-8 text-center text-muted-foreground text-xs">
                                                {productSearch ? 'No sold products match your search query.' : 'No products sold in this period yet.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProductSales.map((item) => (
                                            <tr key={item.product_id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    <div className="flex flex-col">
                                                        <span>{item.product_name}</span>
                                                        {item.barcode && (
                                                            <span className="font-mono text-[10px] text-muted-foreground">
                                                                {item.barcode}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3 text-muted-foreground">
                                                    {item.category_name || '—'}
                                                </td>
                                                <td className="py-2.5 px-3 text-center font-bold">
                                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                        {item.total_qty} {item.unit_name || ''}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                                                    {format(item.avg_price)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                                                    {format(item.total_revenue)}
                                                </td>
                                                {!isSalesStaffOnly && (
                                                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                                                        {format(item.total_profit)}
                                                    </td>
                                                )}
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                                                        item.current_stock <= item.min_stock_level
                                                            ? 'bg-rose-500/10 text-rose-600 font-bold'
                                                            : 'text-muted-foreground'
                                                    }`}>
                                                        {item.current_stock} {item.unit_name || ''}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">
                                                    <Link href={route('shop.products.show', item.product_id)}>
                                                        <Button size="icon" variant="ghost" className="h-6 w-6" title="View Product">
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Two-Column Lists: Recent Sales & Top Selling Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Sales */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Recent Sales</CardTitle>
                                <CardDescription>Latest customer transactions</CardDescription>
                            </div>
                            <Link href={route('shop.sales.index')}>
                                <Button variant="ghost" size="sm" className="text-xs text-primary">
                                    View All <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs text-muted-foreground">
                                            <th className="text-left pb-2">Invoice</th>
                                            <th className="text-left pb-2">Customer</th>
                                            <th className="text-right pb-2">Amount</th>
                                            <th className="text-center pb-2">Status</th>
                                            <th className="text-right pb-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {stats.recent_sales.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">
                                                    No sales recorded in this period yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            stats.recent_sales.map((sale) => (
                                                <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="py-3 font-mono text-xs font-medium">{sale.invoice_no}</td>
                                                    <td className="py-3 text-xs">{sale.customer?.name || 'Walking Customer'}</td>
                                                    <td className="py-3 text-right font-semibold text-xs">{format(sale.total)}</td>
                                                    <td className="py-3 text-center">
                                                        <StatusBadge status={sale.status} />
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Link href={route('shop.sales.show', sale.id)}>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7">
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
                        </CardContent>
                    </Card>

                    {/* Top Selling Products */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Top Selling Products</CardTitle>
                                <CardDescription>Highest velocity inventory items</CardDescription>
                            </div>
                            <Link href={route('shop.reports.product-performance')}>
                                <Button variant="ghost" size="sm" className="text-xs text-primary">
                                    Report <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.best_sellers.length === 0 ? (
                                    <p className="py-6 text-center text-muted-foreground text-xs">
                                        No sales item data for this period.
                                    </p>
                                ) : (
                                    stats.best_sellers.map((item, idx) => (
                                        <div key={item.product_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground line-clamp-1">{item.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">Qty Sold: {item.total_qty}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-foreground">{format(item.total_revenue)}</p>
                                                <p className="text-[11px] text-emerald-600 font-medium">Profit: {format(item.total_profit)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
