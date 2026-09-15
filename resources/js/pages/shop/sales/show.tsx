import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Printer,
    DollarSign,
    ShoppingCart,
    CreditCard,
    User,
    Calendar,
    Receipt,
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

interface SalePayment {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    notes: string | null;
    user?: { name: string };
}

interface SaleItemDetail {
    id: number;
    quantity: number;
    unit_price: number;
    unit_cost: number;
    subtotal: number;
    profit: number;
    product: {
        id: number;
        name: string;
        sku: string | null;
        unit?: { abbreviation: string };
    };
}

interface SaleShowProps {
    sale: {
        id: number;
        invoice_no: string;
        sale_date: string;
        subtotal: number;
        discount: number;
        total: number;
        paid_amount: number;
        due_amount: number;
        change_amount: number;
        gross_profit: number;
        payment_method: string;
        status: string;
        notes: string | null;
        customer?: {
            id: number;
            name: string;
            phone: string | null;
            address: string | null;
        };
        items: SaleItemDetail[];
        payments: SalePayment[];
        user?: { name: string };
        shop?: {
            name: string;
            phone: string | null;
            address: string | null;
        };
    };
}

export default function ShowSale({ sale }: SaleShowProps) {
    const { format } = useCurrency();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const paymentForm = useForm({
        sale_id: sale.id,
        amount: String(sale.due_amount || ''),
        payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sale.customer) {
            alert('Cannot record payment without an attached customer.');
            return;
        }

        paymentForm.post(route('shop.customers.payments.store', sale.customer.id), {
            onSuccess: () => {
                setIsPaymentOpen(false);
                paymentForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Sales', href: route('shop.sales.index') },
            { title: sale.invoice_no, href: route('shop.sales.show', sale.id) }
        ]}>
            <Head title={`Sale Invoice: ${sale.invoice_no}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={`Invoice ${sale.invoice_no}`}
                        description={`Created on ${sale.sale_date} by ${sale.user?.name || 'Cashier'}`}
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.sales.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Sales List
                            </Button>
                        </Link>
                        <Link href={route('shop.sales.receipt', sale.id)} target="_blank">
                            <Button size="sm" variant="outline" className="text-primary border-primary/30">
                                <Printer className="h-4 w-4 mr-1.5" /> Print Receipt
                            </Button>
                        </Link>
                        {Number(sale.due_amount) > 0 && sale.customer && (
                            <Button
                                size="sm"
                                onClick={() => setIsPaymentOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                            >
                                <DollarSign className="h-4 w-4 mr-1.5" /> Collect Due
                            </Button>
                        )}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Bill</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(sale.total)}</div>
                            <span className="text-xs text-muted-foreground">{sale.items.length} items sold</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Paid Amount</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">{format(sale.paid_amount)}</div>
                            <span className="text-xs text-muted-foreground capitalize">Via {sale.payment_method}</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Customer Due</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-rose-600">{format(sale.due_amount)}</div>
                            <div className="mt-1">
                                <StatusBadge status={sale.status} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Gross Profit</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-blue-600">{format(sale.gross_profit)}</div>
                            <span className="text-xs text-muted-foreground">
                                {sale.total > 0 ? `${((sale.gross_profit / sale.total) * 100).toFixed(1)}% margin` : ''}
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* Items Table */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Invoice Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="py-2 text-left">Item</th>
                                        <th className="py-2 text-center">Quantity</th>
                                        <th className="py-2 text-right">Price (৳)</th>
                                        <th className="py-2 text-right">Subtotal</th>
                                        <th className="py-2 text-right">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {sale.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/20 text-xs">
                                            <td className="py-3 font-medium text-foreground">
                                                <Link href={route('shop.products.show', item.product.id)} className="hover:text-primary">
                                                    {item.product.name}
                                                </Link>
                                                {item.product.sku && (
                                                    <span className="text-[11px] text-muted-foreground block">
                                                        SKU: {item.product.sku}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                {item.quantity} {item.product.unit?.abbreviation || ''}
                                            </td>
                                            <td className="py-3 text-right font-mono text-muted-foreground">
                                                {format(item.unit_price)}
                                            </td>
                                            <td className="py-3 text-right font-mono font-semibold text-foreground">
                                                {format(item.subtotal)}
                                            </td>
                                            <td className="py-3 text-right font-mono text-emerald-600 font-medium">
                                                {format(item.profit)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-border/70 text-xs">
                                        <td colSpan={3} className="py-2 text-right text-muted-foreground">Items Subtotal:</td>
                                        <td className="py-2 text-right font-mono font-medium">{format(sale.subtotal)}</td>
                                        <td></td>
                                    </tr>
                                    {Number(sale.discount) > 0 && (
                                        <tr className="text-xs text-emerald-600">
                                            <td colSpan={3} className="py-1 text-right">Discount Applied:</td>
                                            <td className="py-1 text-right font-mono">-{format(sale.discount)}</td>
                                            <td></td>
                                        </tr>
                                    )}
                                    <tr className="text-sm font-bold border-t border-border">
                                        <td colSpan={3} className="py-2 text-right">Net Total:</td>
                                        <td className="py-2 text-right font-mono text-primary">{format(sale.total)}</td>
                                        <td className="py-2 text-right font-mono text-blue-600">{format(sale.gross_profit)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Details & Payment History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-semibold text-foreground">
                                    {sale.customer ? (
                                        <Link href={route('shop.customers.show', sale.customer.id)} className="text-primary hover:underline">
                                            {sale.customer.name}
                                        </Link>
                                    ) : (
                                        'Walking Customer'
                                    )}
                                </span>
                            </div>
                            {sale.customer?.phone && (
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-mono">{sale.customer.phone}</span>
                                </div>
                            )}
                            {sale.customer?.address && (
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span>{sale.customer.address}</span>
                                </div>
                            )}
                            {sale.notes && (
                                <div className="py-1">
                                    <span className="text-muted-foreground block mb-1">Invoice Notes:</span>
                                    <p className="italic text-foreground">{sale.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Payment Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="text-left pb-2">Date</th>
                                            <th className="text-left pb-2">Method</th>
                                            <th className="text-right pb-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {sale.payments.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="py-4 text-center text-muted-foreground">
                                                    Initial cash/tender on creation: {format(sale.paid_amount)}
                                                </td>
                                            </tr>
                                        ) : (
                                            sale.payments.map((p) => (
                                                <tr key={p.id} className="py-2">
                                                    <td className="py-2 font-mono text-muted-foreground">{p.payment_date}</td>
                                                    <td className="py-2 capitalize">{p.payment_method.replace('_', ' ')}</td>
                                                    <td className="py-2 text-right font-mono font-semibold text-emerald-600">
                                                        {format(p.amount)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Due Collection Dialog */}
                {sale.customer && (
                    <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Collect Customer Due</DialogTitle>
                                <DialogDescription>
                                    Customer: <span className="font-bold">{sale.customer.name}</span> | Due: <span className="font-bold text-rose-600">{format(sale.due_amount)}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="pay-amount">Amount (৳) *</Label>
                                    <Input
                                        id="pay-amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={sale.due_amount}
                                        value={paymentForm.data.amount}
                                        onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                        required
                                    />
                                    <InputError message={paymentForm.errors.amount} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="pay-method">Payment Method</Label>
                                    <select
                                        id="pay-method"
                                        value={paymentForm.data.payment_method}
                                        onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="mobile_banking">bKash / Nagad</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="pay-date">Date</Label>
                                    <Input
                                        id="pay-date"
                                        type="date"
                                        value={paymentForm.data.payment_date}
                                        onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="pay-notes">Notes / Transaction Reference</Label>
                                    <Input
                                        id="pay-notes"
                                        placeholder="e.g. bKash TrxID..."
                                        value={paymentForm.data.notes}
                                        onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsPaymentOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={paymentForm.processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        {paymentForm.processing ? 'Saving...' : 'Collect Payment'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AppLayout>
    );
}
