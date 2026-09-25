import { createAccessControl } from 'better-auth/plugins/access';
import {
    adminAc,
    defaultStatements,
    userAc,
} from 'better-auth/plugins/admin/access';

// Keep in sync with media-watchlist-api/src/lib/permissions.ts
export const ac = createAccessControl(defaultStatements);

export const user = ac.newRole({ ...userAc.statements });

export const moderator = ac.newRole({
    user: ['list', 'get', 'update', 'ban'],
});

export const admin = ac.newRole({ ...adminAc.statements });

export const roles = { user, moderator, admin };

export type UserRole = keyof typeof roles;

export const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'user', label: 'User' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'admin', label: 'Administrator' },
];
