import { router, usePage } from '@inertiajs/react';
import { ShieldAlert, UserCheck, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Impersonator } from '@/types';

export function ImpersonationBanner() {
    const page = usePage();
    const impersonator = (page.props as unknown as { impersonator?: Impersonator | null }).impersonator;

    if (!impersonator) {
        return null;
    }

    const handleLeave = () => {
        router.post(route('impersonate.leave'));
    };

    if (impersonator.type === 'super_admin') {
        return (
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-purple-500/30 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40 animate-pulse">
                        <ShieldAlert className="h-3.5 w-3.5 text-purple-300" />
                    </span>
                    <div>
                        <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] mr-1.5 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                            Super Admin Mode
                        </span>
                        <span className="text-white/90">
                            Viewing store as: <strong className="text-white">{impersonator.shop_name || 'Store'}</strong> (Admin: {impersonator.name})
                        </span>
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLeave}
                    className="h-7 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 shadow-sm"
                >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Exit to Admin Panel
                </Button>
            </div>
        );
    }

    // Shop Owner viewing as Staff member
    return (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-blue-500/30 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40 animate-pulse">
                    <UserCheck className="h-3.5 w-3.5 text-blue-300" />
                </span>
                <div>
                    <span className="font-bold text-blue-300 uppercase tracking-wider text-[10px] mr-1.5 px-1.5 py-0.5 rounded bg-blue-400/10 border border-blue-400/30">
                        Staff Counter Mode
                    </span>
                    <span className="text-white/90">
                        Currently viewing as Salesman: <strong className="text-white">{impersonator.staff_name || 'Staff'}</strong> (Owner: {impersonator.name})
                    </span>
                </div>
            </div>

            <Button
                size="sm"
                variant="outline"
                onClick={handleLeave}
                className="h-7 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 shadow-sm"
            >
                <LogOut className="h-3 w-3 mr-1" />
                Return to Owner Dashboard
            </Button>
        </div>
    );
}
