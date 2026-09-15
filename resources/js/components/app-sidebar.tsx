import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3, BookOpen, LayoutDashboard, Package, PackagePlus,
    ShoppingCart, Users, Truck, Receipt, TrendingUp, Settings,
    Boxes, ChevronRight, Shield,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { can, isSuperAdmin } = usePermissions();

    if (isSuperAdmin()) {
        const adminNav: NavItem[] = [
            { title: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard },
            { title: 'Shops', href: route('admin.shops.index'), icon: BookOpen },
            { title: 'Users', href: route('admin.users.index'), icon: Users },
        ];

        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={route('admin.dashboard')}>
                                    <div className="flex items-center gap-2">
                                        <Shield className="size-5 text-primary" />
                                        <span className="font-bold text-sm">Super Admin</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={adminNav} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        );
    }

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: route('shop.dashboard'), icon: LayoutDashboard },
        ...(can('product.view') ? [{ title: 'Products', href: route('shop.products.index'), icon: Package }] : []),
        ...(can('purchase.view') ? [{ title: 'Purchases', href: route('shop.purchases.index'), icon: PackagePlus }] : []),
        ...(can('sale.view') ? [{ title: 'Sales', href: route('shop.sales.index'), icon: ShoppingCart }] : []),
        ...(can('customer.view') ? [{ title: 'Customers', href: route('shop.customers.index'), icon: Users }] : []),
        ...(can('supplier.view') ? [{ title: 'Suppliers', href: route('shop.suppliers.index'), icon: Truck }] : []),
        ...(can('expense.view') ? [{ title: 'Expenses', href: route('shop.expenses.index'), icon: Receipt }] : []),
        ...(can('stock.view') ? [{ title: 'Stock', href: route('shop.stock.index'), icon: Boxes }] : []),
        ...(can('report.view') ? [{ title: 'Reports', href: route('shop.reports.sales'), icon: BarChart3 }] : []),
        ...(can('settings.manage') ? [{ title: 'Settings', href: route('shop.settings.index'), icon: Settings }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('shop.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
