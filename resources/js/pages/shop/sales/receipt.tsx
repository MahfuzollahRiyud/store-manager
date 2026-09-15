import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/use-shop';

interface ReceiptItem {
    id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        unit?: { abbreviation: string };
    };
}

interface ReceiptProps {
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
        payment_method: string;
        notes: string | null;
        created_at: string;
        customer?: {
            name: string;
            phone: string | null;
            address: string | null;
        };
        items: ReceiptItem[];
        user?: { name: string };
        shop?: {
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            currency_symbol?: string;
        };
    };
}

export default function SaleReceipt({ sale }: ReceiptProps) {
    const { format } = useCurrency();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-muted/40 py-8 px-4 flex flex-col items-center justify-center font-mono">
            <Head title={`Receipt - ${sale.invoice_no}`} />

            {/* Action Bar (hidden when printing) */}
            <div className="print:hidden mb-6 flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button size="sm" onClick={handlePrint} className="bg-primary text-primary-foreground shadow">
                    <Printer className="h-4 w-4 mr-1.5" /> Print Receipt
                </Button>
            </div>

            {/* Thermal Receipt Paper (approx 80mm / 300px width standard) */}
            <div className="w-[320px] bg-white text-black p-4 shadow-md rounded border border-gray-200 text-xs leading-tight print:border-none print:shadow-none print:m-0 print:p-0 print:w-[300px]">
                {/* Shop Header */}
                <div className="text-center pb-3 border-b border-dashed border-gray-400">
                    <h2 className="font-bold text-base uppercase tracking-wider">{sale.shop?.name || 'Retail Store'}</h2>
                    {sale.shop?.address && <p className="text-[11px] text-gray-600 mt-0.5">{sale.shop.address}</p>}
                    {sale.shop?.phone && <p className="text-[11px] text-gray-600">Phone: {sale.shop.phone}</p>}
                </div>

                {/* Invoice Meta */}
                <div className="py-2.5 border-b border-dashed border-gray-400 text-[11px] space-y-1">
                    <div className="flex justify-between">
                        <span>Invoice:</span>
                        <span className="font-bold">{sale.invoice_no}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{sale.sale_date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Served By:</span>
                        <span>{sale.user?.name || 'Staff'}</span>
                    </div>
                    {sale.customer && (
                        <div className="flex justify-between pt-1 border-t border-dotted border-gray-300">
                            <span>Customer:</span>
                            <span className="font-semibold">{sale.customer.name}</span>
                        </div>
                    )}
                </div>

                {/* Items Table */}
                <div className="py-2.5 border-b border-dashed border-gray-400">
                    <div className="grid grid-cols-12 text-[10px] font-bold uppercase pb-1 mb-1 border-b border-gray-300">
                        <span className="col-span-6">Item</span>
                        <span className="col-span-2 text-center">Qty</span>
                        <span className="col-span-2 text-right">Price</span>
                        <span className="col-span-2 text-right">Total</span>
                    </div>

                    <div className="space-y-1.5">
                        {sale.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 text-[11px]">
                                <span className="col-span-6 font-medium truncate">{item.product.name}</span>
                                <span className="col-span-2 text-center">
                                    {item.quantity}
                                </span>
                                <span className="col-span-2 text-right">{item.unit_price}</span>
                                <span className="col-span-2 text-right font-semibold">{item.subtotal}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals Breakdown */}
                <div className="py-2.5 border-b border-dashed border-gray-400 text-[11px] space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{format(sale.subtotal)}</span>
                    </div>
                    {Number(sale.discount) > 0 && (
                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>-{format(sale.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300">
                        <span>Grand Total:</span>
                        <span>{format(sale.total)}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                        <span>Paid Amount:</span>
                        <span>{format(sale.paid_amount)}</span>
                    </div>
                    {Number(sale.change_amount) > 0 && (
                        <div className="flex justify-between font-bold">
                            <span>Change Returned:</span>
                            <span>{format(sale.change_amount)}</span>
                        </div>
                    )}
                    {Number(sale.due_amount) > 0 && (
                        <div className="flex justify-between font-bold text-red-600">
                            <span>Due Balance:</span>
                            <span>{format(sale.due_amount)}</span>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="text-center pt-3 text-[10px] text-gray-600 space-y-1">
                    <p className="font-semibold">*** Thank You! Come Again ***</p>
                    <p className="text-[9px] text-gray-400">Powered by StoreManager</p>
                </div>
            </div>
        </div>
    );
}
