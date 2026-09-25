import type { AdminUser } from '../admin-queries';

export function isBanned(user: AdminUser) {
    if (!user.banned) {
        return false;
    }

    return !user.banExpires || new Date(user.banExpires) > new Date();
}
