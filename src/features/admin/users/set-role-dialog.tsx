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
import { Field, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { isAdmin } from '@/lib/auth-client';
import { useSetRole, type AdminUser, type UserRole } from '../admin-queries';

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
                    <DialogTitle>Change role</DialogTitle>
                    <DialogDescription>
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
    const [role, setRole] = useState<UserRole>(() =>
        isAdmin(user) ? 'admin' : 'user'
    );
    const { mutateAsync: updateRole, isPending } = useSetRole();

    const handleSave = async () => {
        const { error } = await updateRole({ userId: user.id, role });

        if (error) {
            toast.error(error.message ?? 'Failed to change role');
            return;
        }

        toast.success('Role updated');
        onDone();
    };

    return (
        <>
            <Field>
                <FieldLabel htmlFor="set-role">Role</FieldLabel>
                <Select
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                >
                    <SelectTrigger id="set-role" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                </Select>
            </Field>
            <DialogFooter>
                <Button variant="outline" onClick={onDone}>
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </DialogFooter>
        </>
    );
}
