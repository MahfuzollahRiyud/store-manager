import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DateFilterProps {
    currentPeriod: string;
    currentFrom?: string;
    currentTo?: string;
    baseUrl?: string;
}

const periods = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Custom', value: 'custom' },
];

export function DateFilter({ currentPeriod, currentFrom = '', currentTo = '', baseUrl }: DateFilterProps) {
    const [period, setPeriod] = useState(currentPeriod);
    const [from, setFrom] = useState(currentFrom);
    const [to, setTo] = useState(currentTo);
    const [showCustom, setShowCustom] = useState(currentPeriod === 'custom');

    const handlePeriodChange = (val: string) => {
        setPeriod(val);
        if (val === 'custom') {
            setShowCustom(true);
        } else {
            setShowCustom(false);
            const url = baseUrl || window.location.pathname;
            router.get(url, { period: val }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = baseUrl || window.location.pathname;
        router.get(url, { period: 'custom', from, to }, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                {periods.map((p) => (
                    <button
                        key={p.value}
                        type="button"
                        onClick={() => handlePeriodChange(p.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            period === p.value
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {showCustom && (
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-8 text-xs w-36"
                        required
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-8 text-xs w-36"
                        required
                    />
                    <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs px-2.5">
                        Filter
                    </Button>
                </form>
            )}
        </div>
    );
}
