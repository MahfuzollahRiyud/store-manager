import { Head, Link, router } from '@inertiajs/react';
import { Shield, Store, Users, CheckCircle, XCircle, ArrowUpRight, Plus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import AppLayout from '@/layouts/app-layout';

interface AdminDashboardProps {
    stats: {
        total_shops: number;
        active_shops: number;
        inactive_shops: number;
        total_users: number;
    };
    recentShops: Array<{
        id: number;
        name: string;
        owner_name: string;
        phone: string | null;
        is_active: boolean;
        created_at: string;
    }>;
}

export default function AdminDashboard({ stats, recentShops }: AdminDashboardProps) {
    const handleToggle = (shopId: number) => {
        router.patch(route('admin.shops.toggle-status', shopId));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: route('admin.dashboard') }]}>
            <Head title="Super Admin Dashboard" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Platform Super Admin"
                        description="SaaS Multi-tenant platform overview, tenant stores, and user accounts"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('admin.shops.index')}>
                            <Button variant="outline" size="sm">
                                View All Stores
                            </Button>
                        </Link>
                        <Link href={route('admin.users.index')}>
                            <Button variant="outline" size="sm">
                                View All Users
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Platform Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard
                        title="Total Registered Shops"
                        value={stats.total_shops}
                        subtitle="Multi-tenant stores"
                        icon={Store}
                    />
                    <StatCard
                        title="Active Subscriptions"
                        value={stats.active_shops}
                        subtitle="Operating stores"
                        icon={CheckCircle}
                        className="border-emerald-500/20"
                    />
                    <StatCard
                        title="Suspended / Inactive"
                        value={stats.inactive_shops}
                        subtitle="Deactivated shops"
                        icon={XCircle}
                        className="border-rose-500/20"
                    />
                    <StatCard
                        title="Total Platform Users"
                        value={stats.total_users}
                        subtitle="Owners, managers & staff"
                        icon={Users}
                    />
                </div>

                {/* Recent Tenant Shops */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                            <CardTitle className="text-base font-semibold">Recently Registered Stores</CardTitle>
                            <CardDescription>Latest tenant signups on the StoreManager platform</CardDescription>
                        </div>
                        <Link href={route('admin.shops.index')}>
                            <Button variant="ghost" size="sm" className="text-xs text-primary">
                                All Shops <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs text-muted-foreground">
                                        <th className="text-left pb-2">Store Name</th>
                                        <th className="text-left pb-2">Owner</th>
                                        <th className="text-left pb-2">Phone</th>
                                        <th className="text-left pb-2">Registered</th>
                                        <th className="text-center pb-2">Status</th>
                                        <th className="text-right pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40 text-xs">
                                    {recentShops.map((s) => (
                                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 font-semibold text-foreground">
                                                <Link href={route('admin.shops.show', s.id)} className="hover:text-primary">
                                                    {s.name}
                                                </Link>
                                            </td>
                                            <td className="py-3 text-muted-foreground">{s.owner_name}</td>
                                            <td className="py-3 font-mono text-muted-foreground">{s.phone || '—'}</td>
                                            <td className="py-3 font-mono text-muted-foreground">
                                                {new Date(s.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                                    s.is_active
                                                        ? 'bg-emerald-500/10 text-emerald-600'
                                                        : 'bg-rose-500/10 text-rose-600'
                                                }`}>
                                                    {s.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1 px-2.5 shadow-sm"
                                                        onClick={() => router.post(route('admin.shops.impersonate', s.id))}
                                                        title="Enter Store as Owner"
                                                    >
                                                        <LogIn className="h-3 w-3" />
                                                        <span>Enter Store</span>
                                                    </Button>
                                                    <Link href={route('admin.shops.show', s.id)}>
                                                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggle(s.id)}
                                                        className={`h-7 text-xs ${
                                                            s.is_active
                                                                ? 'text-rose-600 border-rose-500/30 hover:bg-rose-50'
                                                                : 'text-emerald-600 border-emerald-500/30 hover:bg-emerald-50'
                                                        }`}
                                                    >
                                                        {s.is_active ? 'Suspend' : 'Activate'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
