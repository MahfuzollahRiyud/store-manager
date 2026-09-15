import { Head, Link, router } from '@inertiajs/react';
import { Store, Users, ArrowLeft, Package, ShoppingCart, PackagePlus, Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';

interface ShopShowProps {
    shop: {
        id: number;
        name: string;
        owner_name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        invoice_prefix: string;
        is_active: boolean;
        created_at: string;
        users: Array<{
            id: number;
            name: string;
            email: string;
            phone: string | null;
            roles: Array<{ name: string }>;
            deleted_at: string | null;
        }>;
    };
    stats: {
        total_products: number;
        total_sales: number;
        total_purchases: number;
    };
}

export default function AdminShopShow({ shop, stats }: ShopShowProps) {
    const handleToggle = () => {
        router.patch(route('admin.shops.toggle-status', shop.id));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: route('admin.dashboard') },
            { title: 'Shops', href: route('admin.shops.index') },
            { title: shop.name, href: route('admin.shops.show', shop.id) }
        ]}>
            <Head title={`Admin: ${shop.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={shop.name}
                        description={`Proprietor: ${shop.owner_name} | Registered: ${new Date(shop.created_at).toLocaleDateString('en-GB')}`}
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                            onClick={() => router.post(route('admin.shops.impersonate', shop.id))}
                        >
                            <LogIn className="h-4 w-4 mr-1.5" /> Enter Store Dashboard
                        </Button>
                        <Link href={route('admin.shops.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="outline"
                            className={shop.is_active ? 'text-rose-600 border-rose-500/30' : 'text-emerald-600 border-emerald-500/30'}
                            onClick={handleToggle}
                        >
                            {shop.is_active ? 'Suspend Store' : 'Activate Store'}
                        </Button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Catalog Products</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{stats.total_products}</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Sales Processed</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{stats.total_sales}</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Inward Purchases</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{stats.total_purchases}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shop Details & Users */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Store Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs divide-y divide-border/40">
                            <div className="flex justify-between py-1.5">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`font-bold ${shop.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {shop.is_active ? 'Active' : 'Suspended'}
                                </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-mono">{shop.phone || '—'}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{shop.email || '—'}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-muted-foreground">Address:</span>
                                <span>{shop.address || '—'}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-muted-foreground">Invoice Prefix:</span>
                                <span className="font-mono font-semibold">{shop.invoice_prefix}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff Accounts */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Registered Staff ({shop.users.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 divide-y divide-border/40">
                                {shop.users.map((u) => (
                                    <div key={u.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-semibold text-foreground">{u.name}</p>
                                            <p className="text-muted-foreground">{u.email}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {u.roles.map((r) => (
                                                <span key={r.name} className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px] uppercase">
                                                    {r.name.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
