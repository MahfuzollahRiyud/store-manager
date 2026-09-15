import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, ShoppingBag, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';

interface ProductItem {
    id: number;
    name: string;
    sku: string | null;
    purchase_price: number;
    selling_price: number;
    current_stock: number;
    unit?: { abbreviation: string };
}

interface SupplierItem {
    id: number;
    name: string;
    phone: string | null;
}

interface PurchaseLineItem {
    product_id: number;
    name: string;
    unit_abbr: string;
    quantity: number;
    unit_cost: number;
    subtotal: number;
}

interface CreatePurchaseProps {
    suppliers: SupplierItem[];
    products: ProductItem[];
}

export default function CreatePurchase({ suppliers, products }: CreatePurchaseProps) {
    const { format } = useCurrency();

    const [items, setItems] = useState<PurchaseLineItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        invoice_no: '',
        purchase_date: new Date().toISOString().split('T')[0],
        discount: '0',
        additional_cost: '0',
        paid_amount: '0',
        payment_method: 'cash',
        notes: '',
        items: [] as Array<{ product_id: number; quantity: number; unit_cost: number }>,
    });

    const addItem = () => {
        if (!selectedProductId) return;
        const prod = products.find((p) => p.id === Number(selectedProductId));
        if (!prod) return;

        // Check if already in items list
        const existingIdx = items.findIndex((i) => i.product_id === prod.id);
        if (existingIdx >= 0) {
            const updated = [...items];
            updated[existingIdx].quantity += 1;
            updated[existingIdx].subtotal = updated[existingIdx].quantity * updated[existingIdx].unit_cost;
            setItems(updated);
        } else {
            const newItem: PurchaseLineItem = {
                product_id: prod.id,
                name: prod.name,
                unit_abbr: prod.unit?.abbreviation || 'pcs',
                quantity: 1,
                unit_cost: Number(prod.purchase_price) || 0,
                subtotal: Number(prod.purchase_price) || 0,
            };
            setItems([...items, newItem]);
        }
        setSelectedProductId('');
    };

    const updateItemQuantity = (index: number, qty: number) => {
        const updated = [...items];
        const val = Math.max(0.01, qty || 0);
        updated[index].quantity = val;
        updated[index].subtotal = val * updated[index].unit_cost;
        setItems(updated);
    };

    const updateItemCost = (index: number, cost: number) => {
        const updated = [...items];
        const val = Math.max(0, cost || 0);
        updated[index].unit_cost = val;
        updated[index].subtotal = updated[index].quantity * val;
        setItems(updated);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const discount = Number(data.discount) || 0;
    const additionalCost = Number(data.additional_cost) || 0;
    const grandTotal = Math.max(0, subtotal - discount + additionalCost);
    const paidAmount = Number(data.paid_amount) || 0;
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert('Please add at least one product item to the purchase.');
            return;
        }

        data.items = items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_cost: i.unit_cost,
        }));

        post(route('shop.purchases.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Purchases', href: route('shop.purchases.index') },
            { title: 'New Purchase', href: route('shop.purchases.create') }
        ]}>
            <Head title="Record New Purchase" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="New Purchase / Restock"
                        description="Record products received from suppliers and update average costs"
                    />
                    <Link href={route('shop.purchases.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Purchases
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Purchase & Supplier Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="supplier_id">Supplier</Label>
                                    <select
                                        id="supplier_id"
                                        value={data.supplier_id}
                                        onChange={(e) => setData('supplier_id', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="">Cash / One-Time Supplier</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} {s.phone ? `(${s.phone})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.supplier_id} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="purchase_date">Purchase Date *</Label>
                                    <Input
                                        id="purchase_date"
                                        type="date"
                                        value={data.purchase_date}
                                        onChange={(e) => setData('purchase_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.purchase_date} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="invoice_no">Supplier Memo / Bill #</Label>
                                    <Input
                                        id="invoice_no"
                                        placeholder="e.g. BILL-9821"
                                        value={data.invoice_no}
                                        onChange={(e) => setData('invoice_no', e.target.value)}
                                    />
                                    <InputError message={errors.invoice_no} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Items Box */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base font-semibold">Purchase Items</CardTitle>
                                    <CardDescription>Select products to receive into inventory</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="h-9 text-xs w-64 rounded-md border border-input bg-background px-3 shadow-sm"
                                    >
                                        <option value="">-- Select Product to Add --</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Stock: {p.current_stock})
                                            </option>
                                        ))}
                                    </select>
                                    <Button type="button" size="sm" onClick={addItem} disabled={!selectedProductId}>
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold text-muted-foreground uppercase">
                                            <th className="py-2 text-left">Product</th>
                                            <th className="py-2 text-center w-32">Quantity</th>
                                            <th className="py-2 text-center w-36">Unit Cost (৳)</th>
                                            <th className="py-2 text-right w-32">Subtotal</th>
                                            <th className="py-2 text-right w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                                                    No items added yet. Select a product above and click 'Add'.
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((item, idx) => (
                                                <tr key={item.product_id} className="hover:bg-muted/20">
                                                    <td className="py-2.5">
                                                        <span className="font-medium text-xs text-foreground">{item.name}</span>
                                                        <span className="text-[11px] text-muted-foreground block">Unit: {item.unit_abbr}</span>
                                                    </td>
                                                    <td className="py-2.5 text-center">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItemQuantity(idx, parseFloat(e.target.value))}
                                                            className="h-8 text-xs text-center w-28 mx-auto"
                                                        />
                                                    </td>
                                                    <td className="py-2.5 text-center">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={item.unit_cost}
                                                            onChange={(e) => updateItemCost(idx, parseFloat(e.target.value))}
                                                            className="h-8 text-xs text-center w-32 mx-auto"
                                                        />
                                                    </td>
                                                    <td className="py-2.5 text-right font-mono font-semibold text-xs">
                                                        {format(item.subtotal)}
                                                    </td>
                                                    <td className="py-2.5 text-right">
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-7 w-7 text-rose-600"
                                                            onClick={() => removeItem(idx)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <InputError message={errors.items} className="mt-2" />
                        </CardContent>
                    </Card>

                    {/* Financial Summary & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="paid_amount">Paid Now (৳)</Label>
                                    <Input
                                        id="paid_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.paid_amount}
                                        onChange={(e) => setData('paid_amount', e.target.value)}
                                    />
                                    <InputError message={errors.paid_amount} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <select
                                        id="payment_method"
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="mobile_banking">bKash / Nagad / Rocket</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <InputError message={errors.payment_method} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="notes">Notes / Memo</Label>
                                    <textarea
                                        id="notes"
                                        rows={2}
                                        className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-sm"
                                        placeholder="Any special notes about this purchase..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/20 border-border/70">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Items Subtotal:</span>
                                    <span className="font-mono font-semibold">{format(subtotal)}</span>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Discount (৳):</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.discount}
                                        onChange={(e) => setData('discount', e.target.value)}
                                        className="h-7 text-xs w-28 text-right font-mono"
                                    />
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Transport / Other (৳):</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.additional_cost}
                                        onChange={(e) => setData('additional_cost', e.target.value)}
                                        className="h-7 text-xs w-28 text-right font-mono"
                                    />
                                </div>

                                <div className="flex justify-between py-2 border-b border-border text-sm font-bold">
                                    <span>Grand Total:</span>
                                    <span className="text-primary font-mono">{format(grandTotal)}</span>
                                </div>

                                <div className="flex justify-between py-1 text-emerald-600 font-medium">
                                    <span>Amount Paid:</span>
                                    <span className="font-mono">{format(paidAmount)}</span>
                                </div>

                                <div className="flex justify-between py-1 text-rose-600 font-bold text-sm">
                                    <span>Remaining Due:</span>
                                    <span className="font-mono">{format(dueAmount)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('shop.purchases.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing || items.length === 0} className="bg-primary text-primary-foreground shadow">
                            <Save className="h-4 w-4 mr-1.5" />
                            {processing ? 'Saving Purchase...' : 'Save & Restock'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
