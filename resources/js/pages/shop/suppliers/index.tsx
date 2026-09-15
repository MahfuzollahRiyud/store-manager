import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Truck, ArrowLeft, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Supplier } from '@/types';

interface SuppliersIndexProps {
    suppliers: PaginatedData<Supplier>;
    filters: {
        search?: string;
    };
}

export default function SuppliersIndex({ suppliers, filters }: SuppliersIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const addForm = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    const editForm = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        status: 'active',
    });

    const handleSearch = () => {
        router.get(
            route('shop.suppliers.index'),
            { search: search || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('shop.suppliers.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditOpen = (s: Supplier) => {
        setEditingSupplier(s);
        editForm.setData({
            name: s.name,
            phone: s.phone || '',
            email: s.email || '',
            address: s.address || '',
            notes: '',
            status: s.status,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSupplier) return;

        editForm.patch(route('shop.suppliers.update', editingSupplier.id), {
            onSuccess: () => {
                setEditingSupplier(null);
                editForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Suppliers', href: route('shop.suppliers.index') }]}>
            <Head title="Suppliers Directory" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Suppliers & Vendors"
                        description="Manage wholesale distributors, payment terms, and outstanding payables"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.purchases.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Purchases
                            </Button>
                        </Link>
                        {can('supplier.create') && (
                            <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground shadow">
                                <Plus className="h-4 w-4 mr-1.5" /> Add Supplier
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by company name or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>
                    <Button size="sm" onClick={handleSearch} className="h-9 text-xs">
                        Search
                    </Button>
                    {filters.search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch('');
                                router.get(route('shop.suppliers.index'));
                            }}
                            className="h-9 text-xs"
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* Suppliers Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Supplier</th>
                                    <th className="py-3.5 px-4 text-left">Contact</th>
                                    <th className="py-3.5 px-4 text-right">Total Purchases</th>
                                    <th className="py-3.5 px-4 text-right">Total Paid</th>
                                    <th className="py-3.5 px-4 text-right">Outstanding Due</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {suppliers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Truck className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No suppliers found</p>
                                                <p className="text-xs text-muted-foreground">Add your distributors to manage supplier balances</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.data.map((s) => (
                                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4">
                                                <Link href={route('shop.suppliers.show', s.id)} className="font-semibold text-xs text-foreground hover:text-primary">
                                                    {s.name}
                                                </Link>
                                                {s.address && (
                                                    <span className="text-[11px] text-muted-foreground block line-clamp-1">
                                                        {s.address}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-muted-foreground">
                                                {s.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{s.phone}</span>
                                                    </div>
                                                )}
                                                {s.email && <span className="block text-[11px]">{s.email}</span>}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-foreground">
                                                {format(s.total_purchase)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-medium">
                                                {format(s.total_paid)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-semibold text-xs text-rose-600">
                                                {format(s.total_due)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <StatusBadge status={s.status} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('shop.suppliers.show', s.id)}>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7" title="View details">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                    {can('supplier.edit') && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-7 w-7 text-blue-600"
                                                            onClick={() => handleEditOpen(s)}
                                                            title="Edit supplier"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={suppliers} />
                    </div>
                </div>

                {/* Add Supplier Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Supplier</DialogTitle>
                            <DialogDescription>Add vendor or distributor contact details</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-sname">Supplier / Company Name *</Label>
                                <Input
                                    id="add-sname"
                                    placeholder="e.g. Meghna Group, Akij Corporation"
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={addForm.errors.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="add-sphone">Phone Number</Label>
                                    <Input
                                        id="add-sphone"
                                        placeholder="017xxxxxxxx"
                                        value={addForm.data.phone}
                                        onChange={(e) => addForm.setData('phone', e.target.value)}
                                    />
                                    <InputError message={addForm.errors.phone} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="add-semail">Email (Optional)</Label>
                                    <Input
                                        id="add-semail"
                                        type="email"
                                        placeholder="supplier@mail.com"
                                        value={addForm.data.email}
                                        onChange={(e) => addForm.setData('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-saddress">Address</Label>
                                <Input
                                    id="add-saddress"
                                    placeholder="Warehouse / Shop location"
                                    value={addForm.data.address}
                                    onChange={(e) => addForm.setData('address', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addForm.processing}>
                                    {addForm.processing ? 'Saving...' : 'Add Supplier'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Supplier Dialog */}
                <Dialog open={!!editingSupplier} onOpenChange={(open) => !open && setEditingSupplier(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Supplier</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-sname">Supplier Name *</Label>
                                <Input
                                    id="edit-sname"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-sphone">Phone Number</Label>
                                    <Input
                                        id="edit-sphone"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-semail">Email</Label>
                                    <Input
                                        id="edit-semail"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-saddress">Address</Label>
                                <Input
                                    id="edit-saddress"
                                    value={editForm.data.address}
                                    onChange={(e) => editForm.setData('address', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-sstatus">Status</Label>
                                <select
                                    id="edit-sstatus"
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingSupplier(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Saving...' : 'Update Supplier'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
