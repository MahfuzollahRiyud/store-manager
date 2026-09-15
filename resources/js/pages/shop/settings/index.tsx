import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Settings, Store, Users, Plus, Trash2, Save, Shield, Upload, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';

interface ShopData {
    id: number;
    name: string;
    owner_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    invoice_prefix: string;
    logo: string | null;
}

interface StaffUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    roles: Array<{ id: number; name: string }>;
}

interface ShopSettingsProps {
    shop: ShopData;
    staff: StaffUser[];
    roles: Array<{ id: number; name: string }>;
}

export default function ShopSettings({ shop, staff, roles }: ShopSettingsProps) {
    const { auth } = usePage().props;
    const { can } = usePermissions();
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

    // Shop Info Form
    const shopForm = useForm({
        _method: 'PATCH',
        name: shop.name || '',
        owner_name: shop.owner_name || '',
        phone: shop.phone || '',
        email: shop.email || '',
        address: shop.address || '',
        invoice_prefix: shop.invoice_prefix || 'INV-',
        logo: null as File | null,
    });

    // Staff Form
    const staffForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'sales_staff',
    });

    const handleShopSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        shopForm.post(route('shop.settings.shop.update'), {
            forceFormData: true,
        });
    };

    const handleStaffSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        staffForm.post(route('shop.settings.staff.store'), {
            onSuccess: () => {
                setIsAddStaffOpen(false);
                staffForm.reset();
            },
        });
    };

    const handleRemoveStaff = (user: StaffUser) => {
        if (confirm(`Remove staff member "${user.name}"? They will lose access to the shop immediately.`)) {
            router.delete(route('shop.settings.staff.destroy', user.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Settings', href: route('shop.settings.index') }]}>
            <Head title="Shop Settings & Staff" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <PageHeader
                    title="Shop Settings"
                    description="Configure store profile, invoice format, and manage staff user permissions"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Store Profile & Invoice Settings */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleShopSubmit} className="space-y-6">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-primary" />
                                        <div>
                                            <CardTitle className="text-base font-semibold">Shop Profile</CardTitle>
                                            <CardDescription>Store name and contact info displayed on invoices</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="shop-name">Shop / Business Name *</Label>
                                        <Input
                                            id="shop-name"
                                            value={shopForm.data.name}
                                            onChange={(e) => shopForm.setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={shopForm.errors.name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="owner-name">Owner / Proprietor Name *</Label>
                                        <Input
                                            id="owner-name"
                                            value={shopForm.data.owner_name}
                                            onChange={(e) => shopForm.setData('owner_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={shopForm.errors.owner_name} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="shop-phone">Contact Phone</Label>
                                            <Input
                                                id="shop-phone"
                                                value={shopForm.data.phone}
                                                onChange={(e) => shopForm.setData('phone', e.target.value)}
                                            />
                                            <InputError message={shopForm.errors.phone} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="shop-email">Store Email</Label>
                                            <Input
                                                id="shop-email"
                                                type="email"
                                                value={shopForm.data.email}
                                                onChange={(e) => shopForm.setData('email', e.target.value)}
                                            />
                                            <InputError message={shopForm.errors.email} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="shop-address">Store Address / Location</Label>
                                        <textarea
                                            id="shop-address"
                                            rows={2}
                                            className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-sm"
                                            value={shopForm.data.address}
                                            onChange={(e) => shopForm.setData('address', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="inv-prefix">Invoice Number Prefix *</Label>
                                        <Input
                                            id="inv-prefix"
                                            placeholder="e.g. INV-, BILL-, SHOP-"
                                            value={shopForm.data.invoice_prefix}
                                            onChange={(e) => shopForm.setData('invoice_prefix', e.target.value)}
                                            required
                                        />
                                        <span className="text-[11px] text-muted-foreground block">
                                            Preview: {shopForm.data.invoice_prefix}00001
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 pt-2 border-t border-border/60">
                                        <Label htmlFor="logo">Shop Logo (For Printed Receipts)</Label>
                                        {shop.logo && (
                                            <img
                                                src={`/storage/${shop.logo}`}
                                                alt={shop.name}
                                                className="h-12 w-auto object-contain mb-2 rounded"
                                            />
                                        )}
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => shopForm.setData('logo', e.target.files ? e.target.files[0] : null)}
                                        />
                                        <InputError message={shopForm.errors.logo} />
                                    </div>

                                    <div className="pt-2">
                                        <Button type="submit" disabled={shopForm.processing} className="bg-primary text-primary-foreground">
                                            <Save className="h-4 w-4 mr-1.5" />
                                            {shopForm.processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Right: Staff & Team Management */}
                    <div className="lg:col-span-5 space-y-4">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <CardTitle className="text-base font-semibold">Staff & Permissions</CardTitle>
                                        <CardDescription>Assign roles and access levels</CardDescription>
                                    </div>
                                </div>
                                {can('staff.manage') && (
                                    <Button size="sm" onClick={() => setIsAddStaffOpen(true)}>
                                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Staff
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 divide-y divide-border/40">
                                    {staff.map((u) => (
                                        <div key={u.id} className="pt-3 first:pt-0 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-xs text-foreground">{u.name}</p>
                                                <p className="text-[11px] text-muted-foreground">{u.email}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    {u.roles.map((r) => (
                                                        <span
                                                            key={r.id}
                                                            className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                                                        >
                                                            {r.name.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {can('staff.manage') && u.id !== auth.user.id && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10 gap-1 px-2.5 shadow-sm"
                                                        onClick={() => router.post(route('shop.staff.impersonate', u.id))}
                                                        title="Switch to Staff View (1-Click)"
                                                    >
                                                        <LogIn className="h-3 w-3" />
                                                        <span>Switch View</span>
                                                    </Button>
                                                )}
                                                {can('staff.manage') && u.id !== auth.user.id && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                        onClick={() => handleRemoveStaff(u)}
                                                        title="Remove Staff"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add Staff Dialog */}
                <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Staff Member</DialogTitle>
                            <DialogDescription>Create a login for your shop staff with role-based permissions</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleStaffSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="staff-name">Staff Name *</Label>
                                <Input
                                    id="staff-name"
                                    placeholder="e.g. Shakil Ahmed"
                                    value={staffForm.data.name}
                                    onChange={(e) => staffForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={staffForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="staff-email">Email Address *</Label>
                                <Input
                                    id="staff-email"
                                    type="email"
                                    placeholder="staff@store.com"
                                    value={staffForm.data.email}
                                    onChange={(e) => staffForm.setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={staffForm.errors.email} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="staff-phone">Phone Number</Label>
                                <Input
                                    id="staff-phone"
                                    placeholder="017xxxxxxxx"
                                    value={staffForm.data.phone}
                                    onChange={(e) => staffForm.setData('phone', e.target.value)}
                                />
                                <InputError message={staffForm.errors.phone} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="staff-pwd">Password *</Label>
                                <Input
                                    id="staff-pwd"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    value={staffForm.data.password}
                                    onChange={(e) => staffForm.setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={staffForm.errors.password} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="staff-role">Role & Access Level *</Label>
                                <select
                                    id="staff-role"
                                    value={staffForm.data.role}
                                    onChange={(e) => staffForm.setData('role', e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>
                                            {r.name.replace(/_/g, ' ').toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddStaffOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={staffForm.processing} className="bg-primary text-primary-foreground">
                                    {staffForm.processing ? 'Creating...' : 'Create Staff Login'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
