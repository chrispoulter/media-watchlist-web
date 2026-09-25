import { createAuthClient } from 'better-auth/react';
import { adminClient, twoFactorClient } from 'better-auth/client/plugins';
import { config } from '@/lib/config';
import { ac, roles, type UserRole } from '@/lib/permissions';

export const authClient = createAuthClient({
    baseURL: config.VITE_API_URL,
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = '/two-factor';
            },
        }),
        adminClient({ ac, roles }),
    ],
});

export type Session = typeof authClient.$Infer.Session;

// Extended user type including additional fields from the API
export type AppUser = Session['user'] & {};

type Permissions = Parameters<
    typeof authClient.admin.checkRolePermission
>[0]['permissions'];

// Roles are stored as a comma-separated string by the admin plugin
export function getRoles(user?: { role?: string | null } | null) {
    return (user?.role || 'user').split(',') as UserRole[];
}

// Client-side check for UI gating only; the API enforces the same rules
export function hasPermission(
    user: { role?: string | null } | null | undefined,
    permissions: Permissions
) {
    if (!user) {
        return false;
    }

    return getRoles(user).some((role) =>
        authClient.admin.checkRolePermission({ role, permissions })
    );
}

export function canAccessAdmin(user?: { role?: string | null } | null) {
    return hasPermission(user, { user: ['list'] });
}
