import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Filter, Pencil, Trash2, Receipt, DollarSign, FolderPlus } from 'lucide-react';
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
import Pagination from '@/components/pagination';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { Expense, PaginatedData } from '@/types';

interface ExpenseItem extends Expense {
    user?: { name: string };
}

interface ExpenseCategoryItem {
    id: number;
    name: string;
}

interface ExpensesIndexProps {
    expenses: PaginatedData<ExpenseItem>;
    categories: ExpenseCategoryItem[];
    total_amount: number;
    filters: {
        category_id?: string;
        from?: string;
        to?: string;
    };
}

export default function ExpensesIndex({ expenses, categories, total_amount, filters }: ExpensesIndexProps) {
    const { format } = useCurrency();
    const { can } = usePermissions();

    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

    const addForm = useForm({
        expense_category_id: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        description: '',
        payment_method: 'cash',
    });

    const categoryForm = useForm({
        name: '',
    });

    const editForm = useForm({
        expense_category_id: '',
        amount: '',
        expense_date: '',
        description: '',
        payment_method: 'cash',
    });

    const handleFilter = () => {
        router.get(
            route('shop.expenses.index'),
            {
                category_id: categoryId || undefined,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setCategoryId('');
        setFrom('');
        setTo('');
        router.get(route('shop.expenses.index'));
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('shop.expenses.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        categoryForm.post(route('shop.expense-categories.store'), {
            onSuccess: () => {
                setIsCategoryOpen(false);
                categoryForm.reset();
            },
        });
    };

    const handleEditOpen = (exp: ExpenseItem) => {
        setEditingExpense(exp);
        editForm.setData({
            expense_category_id: exp.category?.id ? String(exp.category.id) : '',
            amount: String(exp.amount),
            expense_date: exp.expense_date,
            description: exp.description || '',
            payment_method: exp.payment_method || 'cash',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExpense) return;

        editForm.patch(route('shop.expenses.update', editingExpense.id), {
            onSuccess: () => {
                setEditingExpense(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (exp: ExpenseItem) => {
        if (confirm('Delete this expense record?')) {
            router.delete(route('shop.expenses.destroy', exp.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Expenses', href: route('shop.expenses.index') }]}>
            <Head title="Store Expenses" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title="Operating Expenses"
                        description="Track shop bills, rent, utilities, transport, and daily business overheads"
                    />

                    <div className="flex items-center gap-2">
                        {can('expense.create') && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setIsCategoryOpen(true)}>
                                    <FolderPlus className="h-4 w-4 mr-1.5" /> New Category
                                </Button>
                                <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground shadow">
                                    <Plus className="h-4 w-4 mr-1.5" /> Record Expense
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Total Stats Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm border-purple-500/20">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Expenses (Selected Period)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{format(total_amount)}</div>
                            <span className="text-xs text-muted-foreground">{expenses.total} transaction records</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full sm:w-48 h-9 text-xs rounded-md border border-input bg-background px-3 shadow-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full sm:w-40 h-9 text-xs"
                    />

                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full sm:w-40 h-9 text-xs"
                    />

                    <Button size="sm" onClick={handleFilter} className="h-9 text-xs">
                        <Filter className="h-3.5 w-3.5 mr-1" /> Filter
                    </Button>

                    {(filters.category_id || filters.from || filters.to) && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 text-xs">
                            Reset
                        </Button>
                    )}
                </div>

                {/* Expenses Table */}
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-left">Date</th>
                                    <th className="py-3.5 px-4 text-left">Category</th>
                                    <th className="py-3.5 px-4 text-left">Description / Notes</th>
                                    <th className="py-3.5 px-4 text-left">Method</th>
                                    <th className="py-3.5 px-4 text-right">Amount</th>
                                    <th className="py-3.5 px-4 text-left pl-4">Staff</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {expenses.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Receipt className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="font-medium text-sm">No expenses found</p>
                                                <p className="text-xs text-muted-foreground">Record daily operating costs like tea, electricity, shop rent</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.data.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-muted/30 transition-colors text-xs">
                                            <td className="py-3 px-4 font-mono text-muted-foreground">
                                                {exp.expense_date}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-foreground">
                                                {exp.category?.name || 'General Expense'}
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground">
                                                {exp.description || '—'}
                                            </td>
                                            <td className="py-3 px-4 capitalize text-muted-foreground">
                                                {exp.payment_method?.replace('_', ' ') || 'Cash'}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                                                {format(exp.amount)}
                                            </td>
                                            <td className="py-3 px-4 pl-4 text-muted-foreground text-[11px]">
                                                {exp.user?.name || 'Staff'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can('expense.edit') && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-7 w-7 text-blue-600"
                                                            onClick={() => handleEditOpen(exp)}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                    {can('expense.delete') && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                            onClick={() => handleDelete(exp)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
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
                        <Pagination data={expenses} />
                    </div>
                </div>

                {/* Add Expense Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Expense</DialogTitle>
                            <DialogDescription>Log an operating expenditure</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exp-amount">Amount (৳) *</Label>
                                <Input
                                    id="exp-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={addForm.data.amount}
                                    onChange={(e) => addForm.setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={addForm.errors.amount} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="exp-cat">Category</Label>
                                    <select
                                        id="exp-cat"
                                        value={addForm.data.expense_category_id}
                                        onChange={(e) => addForm.setData('expense_category_id', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                    >
                                        <option value="">General Expense</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="exp-date">Date *</Label>
                                    <Input
                                        id="exp-date"
                                        type="date"
                                        value={addForm.data.expense_date}
                                        onChange={(e) => addForm.setData('expense_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="exp-method">Payment Method</Label>
                                <select
                                    id="exp-method"
                                    value={addForm.data.payment_method}
                                    onChange={(e) => addForm.setData('payment_method', e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank</option>
                                    <option value="mobile_banking">bKash / Nagad</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="exp-desc">Description / Notes</Label>
                                <Input
                                    id="exp-desc"
                                    placeholder="e.g. Electric bill for August, tea/snacks for staff"
                                    value={addForm.data.description}
                                    onChange={(e) => addForm.setData('description', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addForm.processing} className="bg-primary text-primary-foreground">
                                    {addForm.processing ? 'Saving...' : 'Save Expense'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Add Category Dialog */}
                <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Expense Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="cat-name">Category Name *</Label>
                                <Input
                                    id="cat-name"
                                    placeholder="e.g. Rent, Utilities, Transport, Entertainment"
                                    value={categoryForm.data.name}
                                    onChange={(e) => categoryForm.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={categoryForm.errors.name} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCategoryOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={categoryForm.processing}>
                                    {categoryForm.processing ? 'Creating...' : 'Create Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Expense Dialog */}
                <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Expense</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-exp-amount">Amount (৳) *</Label>
                                <Input
                                    id="edit-exp-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={editForm.data.amount}
                                    onChange={(e) => editForm.setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.amount} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-exp-cat">Category</Label>
                                    <select
                                        id="edit-exp-cat"
                                        value={editForm.data.expense_category_id}
                                        onChange={(e) => editForm.setData('expense_category_id', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                    >
                                        <option value="">General Expense</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-exp-date">Date *</Label>
                                    <Input
                                        id="edit-exp-date"
                                        type="date"
                                        value={editForm.data.expense_date}
                                        onChange={(e) => editForm.setData('expense_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-exp-desc">Description</Label>
                                <Input
                                    id="edit-exp-desc"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingExpense(null)}>
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
