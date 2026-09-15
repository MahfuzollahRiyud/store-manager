import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { Customer } from '@/types';

export default function EditCustomer({ customer }: { customer: Customer & { notes?: string } }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: customer.name,
        phone: customer.phone || '',
        address: customer.address || '',
        notes: customer.notes || '',
        status: customer.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('shop.customers.update', customer.id));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Customers', href: route('shop.customers.index') },
            { title: customer.name, href: route('shop.customers.show', customer.id) },
            { title: 'Edit', href: route('shop.customers.edit', customer.id) }
        ]}>
            <Head title={`Edit Customer: ${customer.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Edit Customer"
                        description={`Updating profile for ${customer.name}`}
                    />
                    <Link href={route('shop.customers.show', customer.id)}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Profile
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Customer Full Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Mobile / Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="address">Address / Area</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="notes">Notes / Remarks</Label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-sm"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('shop.customers.show', customer.id)}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground shadow">
                            <Save className="h-4 w-4 mr-1.5" />
                            {processing ? 'Saving...' : 'Update Customer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
