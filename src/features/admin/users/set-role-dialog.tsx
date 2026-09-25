import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { getRoles } from '@/lib/auth-client';
import type { UserRole } from '@/lib/permissions';
import { useSetRole, type AdminUser } from '../admin-queries';
import { RoleCheckboxes } from './role-checkboxes';

interface SetRoleDialogProps {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SetRoleDialog({
    user,
    open,
    onOpenChange,
}: SetRoleDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change roles</DialogTitle>
                    <DialogDescription>
                        Moderators can view, rename and ban users.
                        Administrators can manage all user accounts.
                    </DialogDescription>
                </DialogHeader>
                <SetRoleForm user={user} onDone={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

interface SetRoleFormProps {
    user: AdminUser;
    onDone: () => void;
}

function SetRoleForm({ user, onDone }: SetRoleFormProps) {
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(() =>
        getRoles(user)
    );
    const { mutateAsync: setRole, isPending } = useSetRole();

    const handleSave = async () => {
        const { error } = await setRole({
            userId: user.id,
            role: selectedRoles,
        });

        if (error) {
            toast.error(error.message ?? 'Failed to change roles');
            return;
        }

        toast.success('Roles updated');
        onDone();
    };

    return (
        <FieldGroup>
            <RoleCheckboxes
                idPrefix="set-role"
                value={selectedRoles}
                onChange={setSelectedRoles}
            />
            {!selectedRoles.length && (
                <FieldError>Select at least one role</FieldError>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={onDone}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isPending || !selectedRoles.length}
                >
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </DialogFooter>
        </FieldGroup>
    );
}
