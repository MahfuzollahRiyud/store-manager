import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    Search,
    Barcode,
    Plus,
    Minus,
    Trash2,
    Check,
    AlertCircle,
    User,
    ArrowLeft,
    Printer,
    DollarSign,
    ShoppingCart,
    CreditCard,
    Smartphone,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { useCurrency } from '@/hooks/use-shop';
import AppLayout from '@/layouts/app-layout';

interface PosProduct {
    id: number;
    name: string;
    sku: string | null;
    barcode: string | null;
    selling_price: number;
    avg_cost: number;
    current_stock: number;
    unit?: { abbreviation: string };
}

interface PosCustomer {
    id: number;
    name: string;
    phone: string | null;
    total_due: number;
}

interface CartItem {
    product_id: number;
    name: string;
    unit_abbr: string;
    quantity: number;
    unit_price: number;
    max_stock: number;
}

interface CreateSaleProps {
    products: PosProduct[];
    customers: PosCustomer[];
}

export default function CreateSale({ products, customers }: CreateSaleProps) {
    const { format, symbol } = useCurrency();

    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer | null>(null);
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        sale_date: new Date().toISOString().split('T')[0],
        discount: '0',
        paid_amount: '0',
        payment_method: 'cash',
        notes: '',
        items: [] as Array<{ product_id: number; quantity: number; unit_price: number }>,
    });

    // Auto-focus barcode input on load
    useEffect(() => {
        barcodeInputRef.current?.focus();
    }, []);

    // Filtered products for visual grid
    const filteredProducts = products.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
            p.name.toLowerCase().includes(query) ||
            (p.sku && p.sku.toLowerCase().includes(query)) ||
            (p.barcode && p.barcode.toLowerCase().includes(query))
        );
    });

    const addToCart = (product: PosProduct) => {
        if (product.current_stock <= 0) {
            alert(`"${product.name}" is out of stock!`);
            return;
        }

        const existingIndex = cart.findIndex((i) => i.product_id === product.id);

        if (existingIndex >= 0) {
            const currentItem = cart[existingIndex];
            if (currentItem.quantity + 1 > product.current_stock) {
                alert(`Cannot add more than available stock (${product.current_stock}) for "${product.name}".`);
                return;
            }
            const updated = [...cart];
            updated[existingIndex].quantity += 1;
            setCart(updated);
        } else {
            setCart([
                ...cart,
                {
                    product_id: product.id,
                    name: product.name,
                    unit_abbr: product.unit?.abbreviation || 'pcs',
                    quantity: 1,
                    unit_price: Number(product.selling_price),
                    max_stock: Number(product.current_stock),
                },
            ]);
        }
    };

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = barcodeInput.trim();
        if (!code) return;

        const found = products.find(
            (p) => (p.barcode && p.barcode === code) || (p.sku && p.sku === code)
        );

        if (found) {
            addToCart(found);
            setBarcodeInput('');
        } else {
            alert(`Product with barcode/SKU "${code}" not found.`);
        }
    };

    const updateQuantity = (index: number, newQty: number) => {
        if (newQty <= 0) {
            removeFromCart(index);
            return;
        }

        const item = cart[index];
        if (newQty > item.max_stock) {
            alert(`Maximum available stock is ${item.max_stock}`);
            return;
        }

        const updated = [...cart];
        updated[index].quantity = newQty;
        setCart(updated);
    };

    const updatePrice = (index: number, newPrice: number) => {
        const updated = [...cart];
        updated[index].unit_price = Math.max(0, newPrice);
        setCart(updated);
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        if (cart.length > 0 && confirm('Clear current sale cart?')) {
            setCart([]);
            setData('discount', '0');
            setData('paid_amount', '0');
        }
    };

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    const discount = Math.max(0, Number(data.discount) || 0);
    const total = Math.max(0, subtotal - discount);
    const paidAmount = Math.max(0, Number(data.paid_amount) || 0);
    const changeAmount = paidAmount > total ? paidAmount - total : 0;
    const dueAmount = total > paidAmount ? total - paidAmount : 0;

    // Fast quick-cash button handler
    const setExactCash = () => {
        setData('paid_amount', String(total));
    };

    const setQuickCash = (amount: number) => {
        setData('paid_amount', String(amount));
    };

    const handleCustomerChange = (customerId: string) => {
        setData('customer_id', customerId);
        const found = customers.find((c) => c.id === Number(customerId)) || null;
        setSelectedCustomer(found);
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty. Add at least one item to proceed.');
            return;
        }

        // If there's due amount and no customer selected, warn user
        if (dueAmount > 0 && !data.customer_id) {
            alert('For sales with remaining due, please select or add a Customer to record the due balance.');
            return;
        }

        data.items = cart.map((c) => ({
            product_id: c.product_id,
            quantity: c.quantity,
            unit_price: c.unit_price,
        }));

        post(route('shop.sales.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Sales', href: route('shop.sales.index') },
            { title: 'POS / Quick Sale', href: route('shop.sales.create') }
        ]}>
            <Head title="Point of Sale (POS) — Quick Sale" />

            <div className="p-2 sm:p-4 lg:p-6 max-w-[1600px] mx-auto">
                {(errors as any).stock && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{(errors as any).stock}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left 7 cols: Product Search & Visual Catalog */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Top Bar: Barcode Scan & Search */}
                        <div className="p-3 bg-card rounded-xl border border-border/60 shadow-sm flex flex-col sm:flex-row gap-3">
                            {/* Barcode scanner input */}
                            <form onSubmit={handleBarcodeSubmit} className="flex-1 relative">
                                <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                                <Input
                                    ref={barcodeInputRef}
                                    placeholder="Scan Barcode / Enter SKU..."
                                    value={barcodeInput}
                                    onChange={(e) => setBarcodeInput(e.target.value)}
                                    className="pl-9 h-9 text-xs font-mono bg-muted/30"
                                />
                            </form>

                            {/* Name Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Filter by product name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 h-9 text-xs"
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="bg-card rounded-xl border border-border/60 shadow-sm p-4 h-[calc(100vh-250px)] overflow-y-auto">
                            {filteredProducts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs">
                                    <ShoppingCart className="h-10 w-10 text-muted-foreground/40 mb-2" />
                                    <p className="font-semibold">No products match your search</p>
                                    <p className="text-muted-foreground">Try clearing your search query</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {filteredProducts.map((p) => {
                                        const isOutOfStock = p.current_stock <= 0;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => !isOutOfStock && addToCart(p)}
                                                disabled={isOutOfStock}
                                                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                                                    isOutOfStock
                                                        ? 'opacity-40 border-border/40 cursor-not-allowed bg-muted/20'
                                                        : 'border-border/60 hover:border-primary/50 hover:shadow-md hover:scale-[1.01] bg-card active:scale-95'
                                                }`}
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug">
                                                        {p.name}
                                                    </h4>
                                                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                                                        Stock: <strong className={p.current_stock <= 5 ? 'text-rose-600' : 'text-foreground'}>
                                                            {p.current_stock} {p.unit?.abbreviation || ''}
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
                                                    <span className="font-mono font-bold text-xs text-primary">
                                                        {format(p.selling_price)}
                                                    </span>
                                                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                        +
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right 5 cols: Live Cart & Instant Checkout */}
                    <div className="lg:col-span-5 flex flex-col h-[calc(100vh-180px)]">
                        <form onSubmit={handleCheckout} className="flex-1 flex flex-col bg-card rounded-xl border border-border/60 shadow-lg overflow-hidden">
                            {/* Cart Header */}
                            <div className="p-3 border-b border-border/60 bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-primary" />
                                    <span className="font-bold text-sm">Active Cart</span>
                                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-mono rounded-full font-bold">
                                        {cart.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearCart}
                                        disabled={cart.length === 0}
                                        className="h-7 text-xs text-rose-600 hover:bg-rose-50"
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1" /> Clear
                                    </Button>
                                    <Link href={route('shop.sales.index')}>
                                        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
                                            <ArrowLeft className="h-3 w-3 mr-1" /> Sales
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Customer & Date Selection */}
                            <div className="p-3 border-b border-border/60 bg-muted/10 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-[11px] text-muted-foreground">Customer</Label>
                                        <select
                                            value={data.customer_id}
                                            onChange={(e) => handleCustomerChange(e.target.value)}
                                            className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 shadow-sm"
                                        >
                                            <option value="">Walking / Cash Customer</option>
                                            {customers.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-[11px] text-muted-foreground">Sale Date</Label>
                                        <Input
                                            type="date"
                                            value={data.sale_date}
                                            onChange={(e) => setData('sale_date', e.target.value)}
                                            className="h-8 text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                {selectedCustomer && Number(selectedCustomer.total_due) > 0 && (
                                    <div className="p-1.5 px-2 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 rounded text-[11px] flex justify-between">
                                        <span>Customer Previous Due:</span>
                                        <strong className="font-mono">{format(selectedCustomer.total_due)}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Cart Items List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-border/40">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
                                        <ShoppingCart className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                        <p className="text-xs font-medium">Cart is empty</p>
                                        <p className="text-[11px] text-muted-foreground">Click products on the left or scan barcode to add</p>
                                    </div>
                                ) : (
                                    cart.map((item, idx) => (
                                        <div key={item.product_id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-[11px] text-muted-foreground">৳</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.unit_price}
                                                        onChange={(e) => updatePrice(idx, parseFloat(e.target.value))}
                                                        className="w-16 h-6 text-xs px-1 font-mono border rounded bg-background"
                                                    />
                                                    <span className="text-[10px] text-muted-foreground">/{item.unit_abbr}</span>
                                                </div>
                                            </div>

                                            {/* Quantity modifier */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(idx, item.quantity - 1)}
                                                    className="h-6 w-6 rounded bg-muted hover:bg-muted/80 flex items-center justify-center text-xs font-bold"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(idx, parseFloat(e.target.value))}
                                                    className="w-12 h-6 text-xs text-center font-mono font-bold border rounded bg-background"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(idx, item.quantity + 1)}
                                                    className="h-6 w-6 rounded bg-muted hover:bg-muted/80 flex items-center justify-center text-xs font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-right min-w-[65px]">
                                                <span className="font-mono font-bold text-xs block">
                                                    {format(item.quantity * item.unit_price)}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(idx)}
                                                className="h-6 w-6 text-rose-500 hover:text-rose-700 flex items-center justify-center"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Checkout Box */}
                            <div className="p-3 border-t border-border/60 bg-muted/20 space-y-2 text-xs">
                                {/* Subtotal & Discount */}
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span className="font-mono font-bold">{format(subtotal)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Discount (৳):</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.discount}
                                        onChange={(e) => setData('discount', e.target.value)}
                                        className="w-24 h-7 text-right font-mono text-xs"
                                    />
                                </div>

                                {/* Net Total */}
                                <div className="flex justify-between items-center pt-1 border-t border-border/50 text-sm font-bold">
                                    <span>Net Payable:</span>
                                    <span className="text-primary font-mono text-base">{format(total)}</span>
                                </div>

                                {/* Paid Amount & Quick Buttons */}
                                <div className="space-y-1 pt-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-foreground">Paid Amount:</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.paid_amount}
                                            onChange={(e) => setData('paid_amount', e.target.value)}
                                            className="w-28 h-8 text-right font-mono text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={setExactCash}
                                            className="h-6 text-[10px] px-2"
                                        >
                                            Exact
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setQuickCash(500)}
                                            className="h-6 text-[10px] px-2"
                                        >
                                            500
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setQuickCash(1000)}
                                            className="h-6 text-[10px] px-2"
                                        >
                                            1000
                                        </Button>
                                    </div>
                                </div>

                                {/* Change or Due indicator */}
                                {changeAmount > 0 && (
                                    <div className="flex justify-between items-center p-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded font-bold">
                                        <span>Change / Return to Customer:</span>
                                        <span className="font-mono text-sm">{format(changeAmount)}</span>
                                    </div>
                                )}
                                {dueAmount > 0 && (
                                    <div className="flex justify-between items-center p-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-300 rounded font-bold">
                                        <span>Remaining Customer Due:</span>
                                        <span className="font-mono text-sm">{format(dueAmount)}</span>
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div className="grid grid-cols-4 gap-1 pt-1">
                                    {(['cash', 'mobile_banking', 'bank', 'other'] as const).map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setData('payment_method', m)}
                                            className={`py-1.5 text-[11px] font-medium rounded border text-center capitalize transition-all ${
                                                data.payment_method === m
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-border/60 hover:bg-muted'
                                            }`}
                                        >
                                            {m === 'mobile_banking' ? 'bKash/Nagad' : m}
                                        </button>
                                    ))}
                                </div>

                                {/* Complete Sale Button */}
                                <Button
                                    type="submit"
                                    disabled={processing || cart.length === 0}
                                    className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md mt-2"
                                >
                                    <Check className="h-4 w-4 mr-1.5" />
                                    {processing ? 'Processing Sale...' : `Complete Sale (${format(total)})`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
