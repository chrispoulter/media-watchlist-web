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
import { useRemoveUser, type AdminUser } from '../admin-queries';

interface RemoveUserDialogProps {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRemoved?: () => void;
}

export function RemoveUserDialog({
    user,
    open,
    onOpenChange,
    onRemoved,
}: RemoveUserDialogProps) {
    const { mutateAsync: removeUser, isPending } = useRemoveUser();

    const handleRemove = async () => {
        const { error } = await removeUser(user.id);

        if (error) {
            toast.error(error.message ?? 'Failed to delete user');
            return;
        }

        onOpenChange(false);
        toast.success('User deleted');
        onRemoved?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {user.name}?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. The account for{' '}
                        {user.email} and all associated data, including their
                        watchlist, will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleRemove}
                        disabled={isPending}
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
