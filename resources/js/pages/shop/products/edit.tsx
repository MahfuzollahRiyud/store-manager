import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { Product } from '@/types';

interface EditProductProps {
    product: Product & { description?: string };
    categories: Array<{ id: number; name: string }>;
    units: Array<{ id: number; name: string; abbreviation: string }>;
}

export default function EditProduct({ product, categories, units }: EditProductProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        name: product.name,
        sku: product.sku || '',
        barcode: product.barcode || '',
        category_id: product.category?.id ? String(product.category.id) : '',
        unit_id: product.unit?.id ? String(product.unit.id) : '',
        brand: product.brand || '',
        description: product.description || '',
        purchase_price: String(product.purchase_price),
        selling_price: String(product.selling_price),
        min_stock_level: String(product.min_stock_level),
        status: product.status,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shop.products.update', product.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('shop.products.index') },
            { title: product.name, href: route('shop.products.show', product.id) },
            { title: 'Edit', href: route('shop.products.edit', product.id) }
        ]}>
            <Head title={`Edit Product: ${product.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Edit Product"
                        description={`Updating details for ${product.name}`}
                    />
                    <Link href={route('shop.products.show', product.id)}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Product
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sku">SKU Code</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                    />
                                    <InputError message={errors.sku} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="barcode">Barcode / EAN</Label>
                                    <Input
                                        id="barcode"
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
                                        <option value="">None / Uncategorized</option>
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
                                        <option value="">None / Standard</option>
                                        {units.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.abbreviation})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.unit_id} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                    />
                                    <InputError message={errors.brand} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Pricing & Alert Threshold</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="purchase_price">Purchase Price (৳) *</Label>
                                    <Input
                                        id="purchase_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.purchase_price}
                                        onChange={(e) => setData('purchase_price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.purchase_price} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="selling_price">Selling Price (৳) *</Label>
                                    <Input
                                        id="selling_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.selling_price}
                                        onChange={(e) => setData('selling_price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.selling_price} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="min_stock_level">Low Stock Alert *</Label>
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Image & Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.image && (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="h-16 w-16 object-cover rounded-lg border border-border"
                                    />
                                    <span className="text-xs text-muted-foreground">Current image</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="image">Replace Image (Optional)</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                />
                                <InputError message={errors.image} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Notes / Description</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('shop.products.show', product.id)}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground shadow">
                            <Save className="h-4 w-4 mr-1.5" />
                            {processing ? 'Saving...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
