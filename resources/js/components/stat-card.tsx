import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: { value: number; label: string };
    colorClass?: string;
    className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, colorClass = 'text-primary', className }: StatCardProps) {
    return (
        <div className={cn(
            'rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{title}</p>
                    <p className={cn('mt-1 text-2xl font-bold tracking-tight', colorClass)}>{value}</p>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">{subtitle}</p>
                    )}
                </div>
                <div className={cn('p-2.5 rounded-lg bg-opacity-10 shrink-0', colorClass.replace('text-', 'bg-').replace('-500', '-100').replace('-600', '-100'))}>
                    <Icon className={cn('size-5', colorClass)} />
                </div>
            </div>
            {trend && (
                <div className="mt-3 pt-3 border-t flex items-center gap-1">
                    <span className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                        {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%
                    </span>
                    <span className="text-xs text-muted-foreground">{trend.label}</span>
                </div>
            )}
        </div>
    );
}
