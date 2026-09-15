import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, Search, Shield, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, User } from '@/types';

interface AdminUserItem {
    id: number;
    name: string;
    email: string;
    is_super_admin?: boolean;
    created_at: string;
    shop?: { id: number; name: string };
    roles: Array<string | { name: string }>;
}

interface AdminUsersProps {
    users: PaginatedData<AdminUserItem>;
    filters: {
        search?: string;
    };
}

export default function AdminUsersIndex({ users, filters }: AdminUsersProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get(
            route('admin.users.index'),
            { search: search || undefined },
            { preserveState: true }
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: route('admin.dashboard') },
            { title: 'Users', href: route('admin.users.index') }
        ]}>
            <Head title="Platform Users Directory" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Platform User Accounts"
                    description="All registered shop owners, managers, cashiers, and administrators across tenants"
                />

                {/* Search */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>
                    <Button size="sm" onClick={handleFilter} className="h-9 text-xs">
                        Search
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">User</th>
                                    <th className="py-3.5 px-4 text-left">Email Address</th>
                                    <th className="py-3.5 px-4 text-left">Tenant Store</th>
                                    <th className="py-3.5 px-4 text-center">Platform Role</th>
                                    <th className="py-3.5 px-4 text-left">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-xs">
                                {users.data.map((u) => {
                                    const roleNames = u.roles?.map((r) => typeof r === 'string' ? r : r.name) || [];
                                    return (
                                        <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-foreground">
                                                {u.name}
                                                {u.is_super_admin && (
                                                    <span className="ml-2 text-[10px] bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded font-bold">
                                                        Super Admin
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                                            <td className="py-3 px-4">
                                                {u.shop ? (
                                                    <Link href={route('admin.shops.show', u.shop.id)} className="font-medium text-foreground hover:text-primary">
                                                        {u.shop.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted-foreground">Platform / Global</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                                    {roleNames.map((rn) => (
                                                        <span key={rn} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
                                                            {rn.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-muted-foreground">
                                                {new Date(u.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={users} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
