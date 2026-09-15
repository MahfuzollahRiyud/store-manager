import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Tag, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';

interface CategoryItem {
    id: number;
    name: string;
    description: string | null;
    products_count: number;
}

export default function CategoriesIndex({ categories }: { categories: CategoryItem[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

    const addForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('shop.categories.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditOpen = (cat: CategoryItem) => {
        setEditingCategory(cat);
        editForm.setData({
            name: cat.name,
            description: cat.description || '',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        editForm.patch(route('shop.categories.update', editingCategory.id), {
            onSuccess: () => {
                setEditingCategory(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (cat: CategoryItem) => {
        if (confirm(`Delete category "${cat.name}"? Products will remain uncategorized.`)) {
            router.delete(route('shop.categories.destroy', cat.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('shop.products.index') },
            { title: 'Categories', href: route('shop.categories.index') }
        ]}>
            <Head title="Product Categories" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Categories"
                        description="Organize your store items into logical product categories"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.products.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Products
                            </Button>
                        </Link>
                        <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground shadow">
                            <Plus className="h-4 w-4 mr-1.5" /> Add Category
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-card rounded-xl border border-dashed border-border/70 p-8">
                            <Layers className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                            <h3 className="font-semibold text-sm">No categories created yet</h3>
                            <p className="text-xs text-muted-foreground mt-1 mb-4">Create your first category to group products (e.g. Grocery, Beverages, Snacks)</p>
                            <Button size="sm" onClick={() => setIsAddOpen(true)}>
                                <Plus className="h-4 w-4 mr-1.5" /> Add Category
                            </Button>
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <Card key={cat.id} className="shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-semibold">{cat.name}</CardTitle>
                                                <span className="text-xs text-muted-foreground">
                                                    {cat.products_count} {cat.products_count === 1 ? 'product' : 'products'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-blue-600"
                                                onClick={() => handleEditOpen(cat)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                onClick={() => handleDelete(cat)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                {cat.description && (
                                    <CardContent className="pt-0">
                                        <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    )}
                </div>

                {/* Add Category Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>Create a product group for inventory organization</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-name">Category Name *</Label>
                                <Input
                                    id="add-name"
                                    placeholder="e.g. Grocery / মুদি, Spices, Dairy"
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={addForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-desc">Description (Optional)</Label>
                                <Input
                                    id="add-desc"
                                    placeholder="Short description"
                                    value={addForm.data.description}
                                    onChange={(e) => addForm.setData('description', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addForm.processing}>
                                    {addForm.processing ? 'Creating...' : 'Create Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Category Dialog */}
                <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update category details</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name">Category Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-desc">Description</Label>
                                <Input
                                    id="edit-desc"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Updating...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
