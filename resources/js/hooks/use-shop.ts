import { usePage } from '@inertiajs/react';
import type { Shop } from '@/types';

/**
 * Returns the current shop (tenant) context shared by the server.
 */
export function useShop(): Shop | null {
    const { shop } = usePage<{ shop: Shop | null }>().props;
    return shop;
}

/**
 * Format a number as currency using the shop's currency symbol.
 */
export function useCurrency() {
    const shop = useShop();
    const symbol = shop?.currency_symbol ?? '৳';

    const format = (amount: number | string | null | undefined): string => {
        const num = Number(amount ?? 0);
        return `${symbol}${num.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return { format, symbol };
}
