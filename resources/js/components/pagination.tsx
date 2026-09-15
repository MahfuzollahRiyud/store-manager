import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginatedData } from '@/types';

interface PaginationProps {
    data: PaginatedData<unknown>;
}

export function Pagination({ data }: PaginationProps) {
    if (data.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2 py-3 border-t">
            <p className="text-sm text-muted-foreground">
                Showing {data.from ?? 0}–{data.to ?? 0} of {data.total} results
            </p>
            <div className="flex items-center gap-1">
                {data.links.map((link, i) => {
                    if (link.label === '&laquo; Previous') {
                        return (
                            <Button key={i} variant="outline" size="sm" disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}>
                                <ChevronLeft className="size-4" />
                            </Button>
                        );
                    }
                    if (link.label === 'Next &raquo;') {
                        return (
                            <Button key={i} variant="outline" size="sm" disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}>
                                <ChevronRight className="size-4" />
                            </Button>
                        );
                    }
                    return (
                        <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}>
                            {link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}

export default Pagination;
