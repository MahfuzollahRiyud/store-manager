import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    DollarSign,
    Package,
    Receipt,
    Truck,
    CreditCard,
    Plus,
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
import { StatusBadge } from '@/components/status-badge';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';

interface PurchasePayment {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    notes: string | null;
    user?: { name: string };
}

interface PurchaseItemDetail {
    id: number;
    quantity: number;
    unit_cost: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        sku: string | null;
        unit?: { abbreviation: string };
    };
}

interface PurchaseShowProps {
    purchase: {
        id: number;
        invoice_no: string | null;
        purchase_date: string;
        subtotal: number;
        discount: number;
        additional_cost: number;
        total: number;
        paid_amount: number;
        due_amount: number;
        status: string;
        notes: string | null;
        supplier?: {
            id: number;
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
        };
        items: PurchaseItemDetail[];
        payments: PurchasePayment[];
        user?: { name: string };
    };
}

export default function ShowPurchase({ purchase }: PurchaseShowProps) {
    const { format } = useCurrency();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const paymentForm = useForm({
        amount: String(purchase.due_amount || ''),
        payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(route('shop.purchases.payments.store', purchase.id), {
            onSuccess: () => {
                setIsPaymentOpen(false);
                paymentForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Purchases', href: route('shop.purchases.index') },
            { title: purchase.invoice_no || `PO-${purchase.id}`, href: route('shop.purchases.show', purchase.id) }
        ]}>
            <Head title={`Purchase: ${purchase.invoice_no || `PO-${purchase.id}`}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={`Purchase ${purchase.invoice_no || `PO-${purchase.id}`}`}
                        description={`Purchased on ${purchase.purchase_date} by ${purchase.user?.name || 'Staff'}`}
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.purchases.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Purchases
                            </Button>
                        </Link>
                        {Number(purchase.due_amount) > 0 && (
                            <Button
                                size="sm"
                                onClick={() => setIsPaymentOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                            >
                                <DollarSign className="h-4 w-4 mr-1.5" /> Pay Supplier Due
                            </Button>
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Bill</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(purchase.total)}</div>
                            <span className="text-xs text-muted-foreground">{purchase.items.length} product items</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Paid Amount</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">{format(purchase.paid_amount)}</div>
                            <span className="text-xs text-muted-foreground">Via cash / bank</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Remaining Due</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-rose-600">{format(purchase.due_amount)}</div>
                            <div className="mt-1">
                                <StatusBadge status={purchase.status} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Supplier</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-base font-semibold text-foreground line-clamp-1">
                                {purchase.supplier?.name || 'Cash Supplier'}
                            </div>
                            <span className="text-xs text-muted-foreground">{purchase.supplier?.phone || 'No phone'}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Items Table */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Purchased Items</CardTitle>
                        <CardDescription>Stock received and added to inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="py-2 text-left">Product</th>
                                        <th className="py-2 text-center">Quantity</th>
                                        <th className="py-2 text-right">Unit Cost</th>
                                        <th className="py-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {purchase.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/20">
                                            <td className="py-3 font-medium text-xs text-foreground">
                                                <Link href={route('shop.products.show', item.product.id)} className="hover:text-primary">
                                                    {item.product.name}
                                                </Link>
                                                {item.product.sku && (
                                                    <span className="text-[11px] text-muted-foreground block">
                                                        SKU: {item.product.sku}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center text-xs">
                                                {item.quantity} {item.product.unit?.abbreviation || ''}
                                            </td>
                                            <td className="py-3 text-right font-mono text-xs text-muted-foreground">
                                                {format(item.unit_cost)}
                                            </td>
                                            <td className="py-3 text-right font-mono font-semibold text-xs text-foreground">
                                                {format(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-border/70 text-xs">
                                        <td colSpan={3} className="py-2 text-right text-muted-foreground">Subtotal:</td>
                                        <td className="py-2 text-right font-mono font-medium">{format(purchase.subtotal)}</td>
                                    </tr>
                                    {Number(purchase.discount) > 0 && (
                                        <tr className="text-xs text-emerald-600">
                                            <td colSpan={3} className="py-1 text-right">Discount:</td>
                                            <td className="py-1 text-right font-mono">-{format(purchase.discount)}</td>
                                        </tr>
                                    )}
                                    {Number(purchase.additional_cost) > 0 && (
                                        <tr className="text-xs text-muted-foreground">
                                            <td colSpan={3} className="py-1 text-right">Additional Cost:</td>
                                            <td className="py-1 text-right font-mono">+{format(purchase.additional_cost)}</td>
                                        </tr>
                                    )}
                                    <tr className="text-sm font-bold border-t border-border">
                                        <td colSpan={3} className="py-2 text-right">Grand Total:</td>
                                        <td className="py-2 text-right font-mono text-primary">{format(purchase.total)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Section */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Payment History</CardTitle>
                            <CardDescription>Installments and payments made towards this bill</CardDescription>
                        </div>
                        {Number(purchase.due_amount) > 0 && (
                            <Button size="sm" variant="outline" onClick={() => setIsPaymentOpen(true)}>
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add Payment
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="py-2 text-left">Date</th>
                                        <th className="py-2 text-left">Method</th>
                                        <th className="py-2 text-right">Amount</th>
                                        <th className="py-2 text-left pl-4">Staff / Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {purchase.payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                                                No payment records logged yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        purchase.payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-muted/20 text-xs">
                                                <td className="py-2.5 font-mono text-muted-foreground">{p.payment_date}</td>
                                                <td className="py-2.5 capitalize">{p.payment_method.replace('_', ' ')}</td>
                                                <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">
                                                    {format(p.amount)}
                                                </td>
                                                <td className="py-2.5 pl-4 text-muted-foreground text-[11px]">
                                                    {p.user?.name && <span className="font-medium text-foreground">{p.user.name}: </span>}
                                                    {p.notes || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Add Payment Dialog */}
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Supplier Payment</DialogTitle>
                            <DialogDescription>
                                Remaining due on this purchase: <span className="font-bold text-rose-600">{format(purchase.due_amount)}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="payment-amount">Payment Amount (৳) *</Label>
                                <Input
                                    id="payment-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={purchase.due_amount}
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={paymentForm.errors.amount} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="payment-method">Payment Method *</Label>
                                <select
                                    id="payment-method"
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="mobile_banking">bKash / Nagad</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="payment-date">Date *</Label>
                                <Input
                                    id="payment-date"
                                    type="date"
                                    value={paymentForm.data.payment_date}
                                    onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="payment-notes">Notes / Transaction ID</Label>
                                <Input
                                    id="payment-notes"
                                    placeholder="e.g. TrxID 847289 or Cheque # 12903"
                                    value={paymentForm.data.notes}
                                    onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsPaymentOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={paymentForm.processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {paymentForm.processing ? 'Recording...' : 'Record Payment'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
