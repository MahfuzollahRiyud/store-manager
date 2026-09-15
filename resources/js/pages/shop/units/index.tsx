import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface UnitItem {
    id: number;
    name: string;
    abbreviation: string;
    products_count: number;
}

export default function UnitsIndex({ units }: { units: UnitItem[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);

    const addForm = useForm({
        name: '',
        abbreviation: '',
    });

    const editForm = useForm({
        name: '',
        abbreviation: '',
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('shop.units.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditOpen = (unit: UnitItem) => {
        setEditingUnit(unit);
        editForm.setData({
            name: unit.name,
            abbreviation: unit.abbreviation,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUnit) return;

        editForm.patch(route('shop.units.update', editingUnit.id), {
            onSuccess: () => {
                setEditingUnit(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (unit: UnitItem) => {
        if (confirm(`Delete unit "${unit.name}" (${unit.abbreviation})?`)) {
            router.delete(route('shop.units.destroy', unit.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('shop.products.index') },
            { title: 'Units', href: route('shop.units.index') }
        ]}>
            <Head title="Measurement Units" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Measurement Units"
                        description="Define units of measurement for products (e.g. kg, liter, piece, packet, box)"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.products.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Products
                            </Button>
                        </Link>
                        <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground shadow">
                            <Plus className="h-4 w-4 mr-1.5" /> Add Unit
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {units.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-card rounded-xl border border-dashed border-border/70 p-8">
                            <Scale className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                            <h3 className="font-semibold text-sm">No units configured yet</h3>
                            <p className="text-xs text-muted-foreground mt-1 mb-4">Add units such as Piece (pcs), Kilogram (kg), Litre (L)</p>
                            <Button size="sm" onClick={() => setIsAddOpen(true)}>
                                <Plus className="h-4 w-4 mr-1.5" /> Add Unit
                            </Button>
                        </div>
                    ) : (
                        units.map((unit) => (
                            <Card key={unit.id} className="shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                                                <Scale className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-semibold">{unit.name}</CardTitle>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded font-bold">
                                                        {unit.abbreviation}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {unit.products_count} {unit.products_count === 1 ? 'product' : 'products'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-blue-600"
                                                onClick={() => handleEditOpen(unit)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                onClick={() => handleDelete(unit)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    )}
                </div>

                {/* Add Unit Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Unit</DialogTitle>
                            <DialogDescription>Define standard measurement unit</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="unit-name">Unit Name *</Label>
                                <Input
                                    id="unit-name"
                                    placeholder="e.g. Kilogram, Piece, Litre"
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={addForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="unit-abbr">Abbreviation *</Label>
                                <Input
                                    id="unit-abbr"
                                    placeholder="e.g. kg, pcs, L, box"
                                    value={addForm.data.abbreviation}
                                    onChange={(e) => addForm.setData('abbreviation', e.target.value)}
                                    required
                                />
                                <InputError message={addForm.errors.abbreviation} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addForm.processing}>
                                    {addForm.processing ? 'Creating...' : 'Create Unit'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Unit Dialog */}
                <Dialog open={!!editingUnit} onOpenChange={(open) => !open && setEditingUnit(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Unit</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-unit-name">Unit Name *</Label>
                                <Input
                                    id="edit-unit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-unit-abbr">Abbreviation *</Label>
                                <Input
                                    id="edit-unit-abbr"
                                    value={editForm.data.abbreviation}
                                    onChange={(e) => editForm.setData('abbreviation', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.abbreviation} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingUnit(null)}>
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
