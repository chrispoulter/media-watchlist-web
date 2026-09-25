import { Badge } from '@/components/ui/badge';
import { getRoles } from '@/lib/auth-client';
import { roleOptions, type UserRole } from '@/lib/permissions';
import type { AdminUser } from '../admin-queries';
import { isBanned } from './user-utils';

const roleVariants: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
    admin: 'default',
    moderator: 'outline',
    user: 'secondary',
};

export function RoleBadges({ user }: { user: AdminUser }) {
    const userRoles = getRoles(user);

    return (
        <div className="flex flex-wrap gap-1">
            {roleOptions
                .filter((option) => userRoles.includes(option.value))
                .map((option) => (
                    <Badge
                        key={option.value}
                        variant={roleVariants[option.value]}
                    >
                        {option.label}
                    </Badge>
                ))}
        </div>
    );
}

export function StatusBadge({ user }: { user: AdminUser }) {
    return isBanned(user) ? (
        <Badge variant="destructive">Banned</Badge>
    ) : (
        <Badge variant="outline">Active</Badge>
    );
}
