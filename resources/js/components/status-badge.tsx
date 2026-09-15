import { cn } from '@/lib/utils';

interface BadgeStatusProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    active:   { label: 'Active',   className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    paid:     { label: 'Paid',     className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    partial:  { label: 'Partial',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    pending:  { label: 'Pending',  className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    low_stock:{ label: 'Low Stock',className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function StatusBadge({ status, className }: BadgeStatusProps) {
    const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', config.className, className)}>
            {config.label}
        </span>
    );
}

export function LowStockBadge({ currentStock, minStock, className }: { currentStock?: number; minStock?: number; className?: string } = {}) {
    return (
        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", className)}>
            <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
            Low Stock
        </span>
    );
}
