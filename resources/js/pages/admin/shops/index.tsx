import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Store, Search, Filter, Eye, ShieldAlert, CheckCircle, XCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Shop } from '@/types';

interface ShopTenantItem extends Shop {
    owner_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    is_active: boolean;
    created_at: string;
    users_count: number;
}

interface AdminShopsIndexProps {
    shops: PaginatedData<ShopTenantItem>;
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function AdminShopsIndex({ shops, filters }: AdminShopsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isActive, setIsActive] = useState(filters.is_active || '');

    const handleFilter = () => {
        router.get(
            route('admin.shops.index'),
            {
                search: search || undefined,
                is_active: isActive !== '' ? isActive : undefined,
            },
            { preserveState: true }
        );
    };

    const handleToggle = (shopId: number) => {
        router.patch(route('admin.shops.toggle-status', shopId));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: route('admin.dashboard') },
            { title: 'Shops', href: route('admin.shops.index') }
        ]}>
            <Head title="Platform Tenants (Shops)" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Tenant Stores"
                    description="All retail shops hosted on the StoreManager multi-tenant SaaS platform"
                />

                {/* Filters */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by store name, owner, or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>

                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                        className="h-9 text-xs rounded-md border border-input bg-background px-3 shadow-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="1">Active Only</option>
                        <option value="0">Suspended Only</option>
                    </select>

                    <Button size="sm" onClick={handleFilter} className="h-9 text-xs">
                        Filter
                    </Button>
                </div>

                {/* Shops Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Shop / Store</th>
                                    <th className="py-3.5 px-4 text-left">Proprietor</th>
                                    <th className="py-3.5 px-4 text-left">Phone</th>
                                    <th className="py-3.5 px-4 text-center">Staff Members</th>
                                    <th className="py-3.5 px-4 text-left">Created Date</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {shops.data.map((shop) => (
                                    <tr key={shop.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-3 px-4 font-semibold text-foreground">
                                            <Link href={route('admin.shops.show', shop.id)} className="hover:text-primary">
                                                {shop.name}
                                            </Link>
                                            {shop.address && <span className="text-[11px] text-muted-foreground block">{shop.address}</span>}
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground">{shop.owner_name}</td>
                                        <td className="py-3 px-4 font-mono text-muted-foreground">{shop.phone || '—'}</td>
                                        <td className="py-3 px-4 text-center font-mono font-semibold">{shop.users_count}</td>
                                        <td className="py-3 px-4 font-mono text-muted-foreground">
                                            {new Date(shop.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                                shop.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-600'
                                                    : 'bg-rose-500/10 text-rose-600'
                                            }`}>
                                                {shop.is_active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    size="sm"
                                                    className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1 px-2.5 shadow-sm"
                                                    onClick={() => router.post(route('admin.shops.impersonate', shop.id))}
                                                    title="Enter Store as Owner (1-Click)"
                                                >
                                                    <LogIn className="h-3 w-3" />
                                                    <span>Enter Store</span>
                                                </Button>
                                                <Link href={route('admin.shops.show', shop.id)}>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Inspect Shop">
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className={`h-7 text-xs ${
                                                        shop.is_active
                                                            ? 'text-rose-600 border-rose-500/30'
                                                            : 'text-emerald-600 border-emerald-500/30'
                                                    }`}
                                                    onClick={() => handleToggle(shop.id)}
                                                >
                                                    {shop.is_active ? 'Suspend' : 'Activate'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={shops} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
