import { Link } from '@inertiajs/react';
import {
    BarChart3,
    TrendingUp,
    ShoppingCart,
    PackagePlus,
    Receipt,
    Boxes,
    History,
    Users,
    Truck,
    Award,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportsNavProps {
    current: string;
    exportType?: string;
    from?: string;
    to?: string;
}

const navItems = [
    { title: 'Sales', route: 'shop.reports.sales', key: 'sales', icon: ShoppingCart },
    { title: 'Purchases', route: 'shop.reports.purchases', key: 'purchases', icon: PackagePlus },
    { title: 'Net Profit', route: 'shop.reports.profit', key: 'profit', icon: TrendingUp },
    { title: 'Expenses', route: 'shop.reports.expenses', key: 'expenses', icon: Receipt },
    { title: 'Stock Asset', route: 'shop.reports.stock', key: 'stock', icon: Boxes },
    { title: 'Movements', route: 'shop.reports.stock-movements', key: 'stock-movements', icon: History },
    { title: 'Customer Due', route: 'shop.reports.customer-due', key: 'customer-due', icon: Users },
    { title: 'Supplier Due', route: 'shop.reports.supplier-due', key: 'supplier-due', icon: Truck },
    { title: 'Top Products', route: 'shop.reports.product-performance', key: 'product-performance', icon: Award },
];

export function ReportsNav({ current, exportType, from, to }: ReportsNavProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = current === item.key;
                    return (
                        <Link key={item.key} href={route(item.route)}>
                            <button
                                type="button"
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {item.title}
                            </button>
                        </Link>
                    );
                })}
            </div>

            {exportType && (
                <a
                    href={route('shop.reports.export', { type: exportType, from, to })}
                    className="shrink-0"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
                    </Button>
                </a>
            )}
        </div>
    );
}
