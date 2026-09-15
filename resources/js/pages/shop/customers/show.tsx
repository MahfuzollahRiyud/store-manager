import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    DollarSign,
    Phone,
    MapPin,
    Eye,
    Receipt,
    Pencil,
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
import Pagination from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';
import type { Customer, PaginatedData, Sale } from '@/types';

interface CustomerPaymentRecord {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    notes: string | null;
    user?: { name: string };
}

interface CustomerShowProps {
    customer: Customer & { notes?: string };
    sales: PaginatedData<Sale>;
    payments: PaginatedData<CustomerPaymentRecord>;
}

export default function ShowCustomer({ customer, sales, payments }: CustomerShowProps) {
    const { format } = useCurrency();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const paymentForm = useForm({
        amount: String(customer.total_due || ''),
        payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        sale_id: '',
        notes: '',
    });

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(route('shop.customers.payments.store', customer.id), {
            onSuccess: () => {
                setIsPaymentOpen(false);
                paymentForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Customers', href: route('shop.customers.index') },
            { title: customer.name, href: route('shop.customers.show', customer.id) }
        ]}>
            <Head title={`Customer: ${customer.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={customer.name}
                        description="Customer ledger (খতিয়ান), credit history, and payment collection"
                    />

                    <div className="flex items-center gap-2">
                        <Link href={route('shop.customers.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Customers
                            </Button>
                        </Link>
                        <Link href={route('shop.customers.edit', customer.id)}>
                            <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-1.5" /> Edit Customer
                            </Button>
                        </Link>
                        {Number(customer.total_due) > 0 && (
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

                {/* Financial Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Lifetime Purchases</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-foreground">{format(customer.total_purchase)}</div>
                            <span className="text-xs text-muted-foreground">{sales.total} orders placed</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Paid</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-emerald-600">{format(customer.total_paid)}</div>
                            <span className="text-xs text-muted-foreground">Cleared payments</span>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="p-4 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Current Due (বাকি)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold text-rose-600">{format(customer.total_due)}</div>
                            <span className="text-xs text-muted-foreground">Total outstanding receivable</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Card */}
                {(customer.phone || customer.address || customer.notes) && (
                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                            {customer.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-foreground" />
                                    <span className="text-foreground font-medium">{customer.phone}</span>
                                </div>
                            )}
                            {customer.address && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-foreground" />
                                    <span>{customer.address}</span>
                                </div>
                            )}
                            {customer.notes && (
                                <div className="w-full pt-1 border-t border-border/40 text-[11px] italic">
                                    Note: {customer.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Sales Ledger */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Sales Ledger</CardTitle>
                        <CardDescription>Invoices generated for this customer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="py-2.5 text-left">Date</th>
                                        <th className="py-2.5 text-left">Invoice</th>
                                        <th className="py-2.5 text-right">Total</th>
                                        <th className="py-2.5 text-right">Paid</th>
                                        <th className="py-2.5 text-right">Due</th>
                                        <th className="py-2.5 text-center">Status</th>
                                        <th className="py-2.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {sales.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-6 text-center text-xs text-muted-foreground">
                                                No sales recorded for this customer yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        sales.data.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-muted/20 text-xs">
                                                <td className="py-3 font-mono text-muted-foreground">{sale.sale_date}</td>
                                                <td className="py-3 font-mono font-medium text-foreground">{sale.invoice_no}</td>
                                                <td className="py-3 text-right font-mono font-semibold text-foreground">
                                                    {format(sale.total)}
                                                </td>
                                                <td className="py-3 text-right font-mono text-emerald-600 font-medium">
                                                    {format(sale.paid_amount)}
                                                </td>
                                                <td className="py-3 text-right font-mono text-rose-600 font-medium">
                                                    {format(sale.due_amount)}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <StatusBadge status={sale.status} />
                                                </td>
                                                <td className="py-3 text-right">
                                                    <Link href={route('shop.sales.show', sale.id)}>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-4 border-t border-border/60">
                            <Pagination data={sales} />
                        </div>
                    </CardContent>
                </Card>

                {/* Due Payments History */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Payment Receipts</CardTitle>
                            <CardDescription>Installments collected against due balances</CardDescription>
                        </div>
                        {Number(customer.total_due) > 0 && (
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
                                        <th className="py-2 text-left">Payment Method</th>
                                        <th className="py-2 text-right">Amount</th>
                                        <th className="py-2 text-left pl-4">Staff / Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {payments.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                                                No payment collection records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.data.map((p) => (
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

                        <div className="pt-4 border-t border-border/60">
                            <Pagination data={payments} />
                        </div>
                    </CardContent>
                </Card>

                {/* Due Collection Dialog */}
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Collect Customer Due</DialogTitle>
                            <DialogDescription>
                                Total Outstanding Due: <span className="font-bold text-rose-600">{format(customer.total_due)}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="cust-pay-amount">Amount (৳) *</Label>
                                <Input
                                    id="cust-pay-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={customer.total_due}
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={paymentForm.errors.amount} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="cust-pay-method">Payment Method *</Label>
                                <select
                                    id="cust-pay-method"
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
                                <Label htmlFor="cust-pay-date">Date *</Label>
                                <Input
                                    id="cust-pay-date"
                                    type="date"
                                    value={paymentForm.data.payment_date}
                                    onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="cust-pay-notes">Notes / Memo</Label>
                                <Input
                                    id="cust-pay-notes"
                                    placeholder="e.g. Cleared via bKash TrxID..."
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
            </div>
        </AppLayout>
    );
}
