import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';

interface CreateProductProps {
    categories: Array<{ id: number; name: string }>;
    units: Array<{ id: number; name: string; abbreviation: string }>;
}

export default function CreateProduct({ categories, units }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        barcode: '',
        category_id: '',
        unit_id: '',
        brand: '',
        description: '',
        purchase_price: '',
        selling_price: '',
        current_stock: '0',
        min_stock_level: '5',
        status: 'active',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shop.products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('shop.products.index') },
            { title: 'Add Product', href: route('shop.products.create') }
        ]}>
            <Head title="Add New Product" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Add New Product"
                        description="Enter product details, pricing, and initial stock level"
                    />
                    <Link href={route('shop.products.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Products
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
                            <CardDescription>Primary identification details of the item</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Miniket Rice 25kg, Lux Soap 100g"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sku">SKU Code (Optional)</Label>
                                    <Input
                                        id="sku"
                                        placeholder="e.g. RICE-MIN-25"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                    />
                                    <InputError message={errors.sku} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="barcode">Barcode / EAN (Optional)</Label>
                                    <Input
                                        id="barcode"
                                        placeholder="Scan or type barcode"
                                        value={data.barcode}
                                        onChange={(e) => setData('barcode', e.target.value)}
                                    />
                                    <InputError message={errors.barcode} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="category_id">Category</Label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="unit_id">Measurement Unit</Label>
                                    <select
                                        id="unit_id"
                                        value={data.unit_id}
                                        onChange={(e) => setData('unit_id', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="">Select Unit (kg, pcs, etc.)</option>
                                        {units.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.abbreviation})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.unit_id} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="brand">Brand / Manufacturer</Label>
                                    <Input
                                        id="brand"
                                        placeholder="e.g. Pran, Square, ACI"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                    />
                                    <InputError message={errors.brand} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Product Status</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="active">Active (Available for Sale)</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Stock */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Pricing & Inventory</CardTitle>
                            <CardDescription>Setup cost price, retail price, and opening inventory count</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="purchase_price">Purchase / Cost Price (৳) *</Label>
                                    <Input
                                        id="purchase_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={data.purchase_price}
                                        onChange={(e) => setData('purchase_price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.purchase_price} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="selling_price">Selling / Retail Price (৳) *</Label>
                                    <Input
                                        id="selling_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={data.selling_price}
                                        onChange={(e) => setData('selling_price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.selling_price} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="current_stock">Opening Stock Quantity *</Label>
                                    <Input
                                        id="current_stock"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.current_stock}
                                        onChange={(e) => setData('current_stock', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.current_stock} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="min_stock_level">Low Stock Alert Level *</Label>
                                    <Input
                                        id="min_stock_level"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={data.min_stock_level}
                                        onChange={(e) => setData('min_stock_level', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.min_stock_level} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image & Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Additional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="image">Product Image (Optional)</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                />
                                <InputError message={errors.image} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Notes / Description (Optional)</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Add any extra notes or supplier information..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('shop.products.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground shadow">
                            <Save className="h-4 w-4 mr-1.5" />
                            {processing ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
