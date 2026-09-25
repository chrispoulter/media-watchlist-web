import { createAuthClient } from 'better-auth/react';
import { adminClient, twoFactorClient } from 'better-auth/client/plugins';
import { config } from '@/lib/config';

export const authClient = createAuthClient({
    baseURL: config.VITE_API_URL,
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = '/two-factor';
            },
        }),
        adminClient(),
    ],
});

export type Session = typeof authClient.$Infer.Session;

// Extended user type including additional fields from the API
export type AppUser = Session['user'] & {};

export const ADMIN_ROLE = 'admin';

export function isAdmin(user?: { role?: string | null } | null) {
    return user?.role === ADMIN_ROLE;
}
