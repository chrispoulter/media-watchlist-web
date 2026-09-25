import { Badge } from '@/components/ui/badge';
import { isAdmin } from '@/lib/auth-client';
import type { AdminUser } from '../admin-queries';
import { isBanned } from './user-utils';

export function RoleBadge({ user }: { user: AdminUser }) {
    return isAdmin(user) ? (
        <Badge>Administrator</Badge>
    ) : (
        <Badge variant="secondary">User</Badge>
    );
}

export function StatusBadge({ user }: { user: AdminUser }) {
    return isBanned(user) ? (
        <Badge variant="destructive">Banned</Badge>
    ) : (
        <Badge variant="outline">Active</Badge>
    );
}
