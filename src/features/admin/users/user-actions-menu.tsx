import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import type { AdminUser } from '../admin-queries';
import { isBanned } from './user-utils';
import { EditUserDialog } from './edit-user-dialog';
import { SetRoleDialog } from './set-role-dialog';
import { BanUserDialog } from './ban-user-dialog';
import { UnbanUserDialog } from './unban-user-dialog';
import { RemoveUserDialog } from './remove-user-dialog';

type ActionDialog = 'edit' | 'role' | 'ban' | 'unban' | 'remove';

interface UserActionsMenuProps {
    user: AdminUser;
    trigger: ReactNode;
    showViewDetails?: boolean;
    onRemoved?: () => void;
}

export function UserActionsMenu({
    user,
    trigger,
    showViewDetails = false,
    onRemoved,
}: UserActionsMenuProps) {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const [dialog, setDialog] = useState<ActionDialog | null>(null);

    // Admins can't lock themselves out
    const isSelf = session?.user.id === user.id;
    const banned = isBanned(user);

    const dialogProps = (name: ActionDialog) => ({
        user,
        open: dialog === name,
        onOpenChange: (open: boolean) => setDialog(open ? name : null),
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    {showViewDetails && (
                        <>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigate(`/admin/users/${user.id}`)
                                }
                            >
                                View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem onClick={() => setDialog('edit')}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setDialog('role')}
                        disabled={isSelf}
                    >
                        Change role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {banned ? (
                        <DropdownMenuItem onClick={() => setDialog('unban')}>
                            Unban
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => setDialog('ban')}
                            disabled={isSelf}
                        >
                            Ban
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDialog('remove')}
                        disabled={isSelf}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditUserDialog {...dialogProps('edit')} />
            <SetRoleDialog {...dialogProps('role')} />
            <BanUserDialog {...dialogProps('ban')} />
            <UnbanUserDialog {...dialogProps('unban')} />
            <RemoveUserDialog
                {...dialogProps('remove')}
                onRemoved={onRemoved}
            />
        </>
    );
}
