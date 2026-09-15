import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Plus,
    Eye,
    DollarSign,
    PackagePlus,
} from 'lucide-react';
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
import Pagination from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Purchase, Supplier } from '@/types';

interface SupplierShowProps {
    supplier: Supplier & { notes?: string };
    purchases: PaginatedData<Purchase>;
}

export default function ShowSupplier({ supplier, purchases }: SupplierShowProps) {
    const { format } = useCurrency();
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

    const paymentForm = useForm({
        purchase_id: '',
        amount: '',
        payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handleOpenPayment = (purchase: Purchase) => {
        setSelectedPurchase(purchase);
        paymentForm.setData({
            purchase_id: String(purchase.id),
            amount: String(purchase.due_amount),
            payment_method: 'cash',
            payment_date: new Date().toISOString().split('T')[0],
            notes: '',
        });
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(route('shop.suppliers.payments.store', supplier.id), {
            onSuccess: () => {
                setSelectedPurchase(null);
                paymentForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Suppliers', href: route('shop.suppliers.index') },
            { title: supplier.name, href: route('shop.suppliers.show', supplier.id) }
        ]}>
            <Head title={`Supplier: ${supplier.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={supplier.name}
                        description="Supplier account balance, order history, and payment transactions"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.suppliers.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Suppliers
                            </Button>
                        </Link>
                        <Link href={route('shop.purchases.create')}>
                            <Button size="sm" className="bg-primary text-primary-foreground shadow">
                                <Plus className="h-4 w-4 mr-1.5" /> New Purchase
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Inward Purchased</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(supplier.total_purchase)}</div>
                            <span className="text-xs text-muted-foreground">{purchases.total} total orders</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Settled / Paid</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">{format(supplier.total_paid)}</div>
                            <span className="text-xs text-muted-foreground">Cleared payments</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Outstanding Due Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-rose-600">{format(supplier.total_due)}</div>
                            <span className="text-xs text-muted-foreground">Payable to this vendor</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Card */}
                {(supplier.phone || supplier.email || supplier.address) && (
                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                            {supplier.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-foreground" />
                                    <span className="text-foreground font-medium">{supplier.phone}</span>
                                </div>
                            )}
                            {supplier.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4 text-foreground" />
                                    <span>{supplier.email}</span>
                                </div>
                            )}
                            {supplier.address && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-foreground" />
                                    <span>{supplier.address}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Purchase Orders Table */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Purchase History</CardTitle>
                        <CardDescription>Orders placed with this supplier</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="py-2.5 text-left">Date</th>
                                        <th className="py-2.5 text-left">Bill / PO #</th>
                                        <th className="py-2.5 text-right">Total</th>
                                        <th className="py-2.5 text-right">Paid</th>
                                        <th className="py-2.5 text-right">Due</th>
                                        <th className="py-2.5 text-center">Status</th>
                                        <th className="py-2.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {purchases.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                                                No purchase orders found for this supplier.
                                            </td>
                                        </tr>
                                    ) : (
                                        purchases.data.map((p) => (
                                            <tr key={p.id} className="hover:bg-muted/20 text-xs">
                                                <td className="py-3 font-mono text-muted-foreground">{p.purchase_date}</td>
                                                <td className="py-3 font-mono font-medium text-foreground">
                                                    {p.invoice_no || `PO-${p.id}`}
                                                </td>
                                                <td className="py-3 text-right font-mono font-semibold text-foreground">
                                                    {format(p.total)}
                                                </td>
                                                <td className="py-3 text-right font-mono text-emerald-600 font-medium">
                                                    {format(p.paid_amount)}
                                                </td>
                                                <td className="py-3 text-right font-mono text-rose-600 font-medium">
                                                    {format(p.due_amount)}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <StatusBadge status={p.status} />
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={route('shop.purchases.show', p.id)}>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7" title="View details">
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </Link>
                                                        {Number(p.due_amount) > 0 && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs text-emerald-600 border-emerald-500/30"
                                                                onClick={() => handleOpenPayment(p)}
                                                            >
                                                                Pay Due
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

                        <div className="pt-4 border-t border-border/60">
                            <Pagination data={purchases} />
                        </div>
                    </CardContent>
                </Card>

                {/* Record Due Payment Modal */}
                <Dialog open={!!selectedPurchase} onOpenChange={(open) => !open && setSelectedPurchase(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Pay Purchase Due</DialogTitle>
                            <DialogDescription>
                                Invoice: <span className="font-mono font-bold">{selectedPurchase?.invoice_no || `PO-${selectedPurchase?.id}`}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="supp-pay-amount">Amount (৳) *</Label>
                                <Input
                                    id="supp-pay-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={selectedPurchase?.due_amount}
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={paymentForm.errors.amount} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="supp-pay-method">Payment Method</Label>
                                <select
                                    id="supp-pay-method"
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank</option>
                                    <option value="mobile_banking">bKash / Nagad</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="supp-pay-date">Date</Label>
                                <Input
                                    id="supp-pay-date"
                                    type="date"
                                    value={paymentForm.data.payment_date}
                                    onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="supp-pay-notes">Notes / Reference</Label>
                                <Input
                                    id="supp-pay-notes"
                                    placeholder="e.g. TrxID or receipt notes"
                                    value={paymentForm.data.notes}
                                    onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setSelectedPurchase(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={paymentForm.processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {paymentForm.processing ? 'Saving...' : 'Record Payment'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
