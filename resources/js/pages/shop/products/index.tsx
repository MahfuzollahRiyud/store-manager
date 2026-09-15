import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Package,
    AlertTriangle,
    Eye,
    Pencil,
    Trash2,
    Boxes,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { LowStockBadge, StatusBadge } from '@/components/status-badge';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product } from '@/types';

interface ProductsIndexProps {
    products: PaginatedData<Product>;
    categories: Array<{ id: number; name: string }>;
    filters: {
        search?: string;
        category_id?: string;
        status?: string;
        low_stock?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [lowStock, setLowStock] = useState(filters.low_stock === 'true');

    const handleFilter = () => {
        router.get(
            route('shop.products.index'),
            {
                search: search || undefined,
                category_id: categoryId || undefined,
                status: status || undefined,
                low_stock: lowStock ? 'true' : undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setCategoryId('');
        setStatus('');
        setLowStock(false);
        router.get(route('shop.products.index'));
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(route('shop.products.destroy', product.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Products', href: route('shop.products.index') }]}>
            <Head title="Products Inventory" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Products & Inventory"
                        description="Manage your store catalog, pricing, cost tracking, and stock levels"
                    />

                    <div className="flex items-center gap-2">
                        {can('category.view') && (
                            <Link href={route('shop.categories.index')}>
                                <Button variant="outline" size="sm">
                                    Categories
                                </Button>
                            </Link>
                        )}
                        {can('unit.view') && (
                            <Link href={route('shop.units.index')}>
                                <Button variant="outline" size="sm">
                                    Units
                                </Button>
                            </Link>
                        )}
                        {can('product.create') && (
                            <Link href={route('shop.products.create')}>
                                <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Add Product
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, SKU, barcode..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant={lowStock ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLowStock(!lowStock)}
                                className={`text-xs h-9 w-full ${lowStock ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                            >
                                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                Low Stock Only
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs">
                            Reset Filters
                        </Button>
                        <Button size="sm" onClick={handleFilter} className="h-8 text-xs">
                            <Filter className="h-3.5 w-3.5 mr-1" /> Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Product</th>
                                    <th className="py-3.5 px-4 text-left">Category</th>
                                    <th className="py-3.5 px-4 text-right">Avg Cost</th>
                                    <th className="py-3.5 px-4 text-right">Selling Price</th>
                                    <th className="py-3.5 px-4 text-center">Margin</th>
                                    <th className="py-3.5 px-4 text-center">Stock</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Package className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No products found</p>
                                                <p className="text-xs text-muted-foreground">Try adjusting your filters or add a new product</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => {
                                        const cost = Number(product.avg_cost || product.purchase_price);
                                        const price = Number(product.selling_price);
                                        const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : '0';

                                        return (
                                            <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
                                                            {product.image ? (
                                                                <img
                                                                    src={`/storage/${product.image}`}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Boxes className="h-5 w-5 text-muted-foreground/60" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={route('shop.products.show', product.id)}
                                                                className="font-medium text-foreground hover:text-primary transition-colors text-xs sm:text-sm line-clamp-1"
                                                            >
                                                                {product.name}
                                                            </Link>
                                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                                                {product.sku && <span>SKU: {product.sku}</span>}
                                                                {product.barcode && <span>• Barcode: {product.barcode}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-xs text-muted-foreground">
                                                    {product.category?.name || '—'}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-xs text-muted-foreground">
                                                    {format(cost)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-semibold text-xs text-foreground">
                                                    {format(price)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                        Number(margin) >= 20
                                                            ? 'bg-emerald-500/10 text-emerald-600'
                                                            : Number(margin) > 0
                                                            ? 'bg-blue-500/10 text-blue-600'
                                                            : 'bg-rose-500/10 text-rose-600'
                                                    }`}>
                                                        {margin}%
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-semibold text-xs">
                                                            {product.current_stock} {product.unit?.abbreviation || ''}
                                                        </span>
                                                        <LowStockBadge
                                                            currentStock={product.current_stock}
                                                            minStock={product.min_stock_level}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <StatusBadge status={product.status} />
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={route('shop.products.show', product.id)}>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7" title="View details">
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </Link>
                                                        {can('product.edit') && (
                                                            <Link href={route('shop.products.edit', product.id)}>
                                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-600" title="Edit product">
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {can('product.delete') && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                                onClick={() => handleDelete(product)}
                                                                title="Delete product"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-border/60">
                        <Pagination data={products} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
