import { usePage } from '@inertiajs/react';
import type { Auth, Shop } from '@/types';

/**
 * Returns the authenticated user's permissions array.
 * Use this for frontend UI hints (not security — backend enforces authorization).
 */
export function usePermissions() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const permissions = auth.user?.permissions ?? [];
    const roles = auth.user?.roles ?? [];

    const can = (permission: string): boolean => {
        if (auth.user?.is_super_admin) return true;
        return permissions.includes(permission);
    };

    const hasRole = (role: string): boolean => {
        return roles.includes(role);
    };

    const isShopOwner = (): boolean => hasRole('shop_owner');
    const isSuperAdmin = (): boolean => auth.user?.is_super_admin ?? false;

    return { can, hasRole, isShopOwner, isSuperAdmin, permissions, roles };
}
