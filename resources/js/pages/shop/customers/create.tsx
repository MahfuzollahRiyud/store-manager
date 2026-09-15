import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';

export default function CreateCustomer() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        address: '',
        notes: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shop.customers.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Customers', href: route('shop.customers.index') },
            { title: 'Add Customer', href: route('shop.customers.create') }
        ]}>
            <Head title="Add Customer" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Add New Customer"
                        description="Register a regular customer for due balance and sale credits"
                    />
                    <Link href={route('shop.customers.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Customers
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
                                    placeholder="e.g. Mohammad Rahim, Anisul Huq"
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
                                    placeholder="01712xxxxxx"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="address">Address / Area</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. House 12, Road 4, Mirpur-10, Dhaka"
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
                                    placeholder="Credit limit, landmark, or guarantor info..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('shop.customers.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground shadow">
                            <Save className="h-4 w-4 mr-1.5" />
                            {processing ? 'Saving...' : 'Save Customer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
