import type { Auth, Impersonator } from '@/types/auth';
import type { route as ziggyRoute } from 'ziggy-js';

declare global {
    var route: typeof ziggyRoute;
}

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            impersonator?: Impersonator | null;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
