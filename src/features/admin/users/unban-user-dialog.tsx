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
import { useUnbanUser, type AdminUser } from '../admin-queries';

interface UnbanUserDialogProps {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UnbanUserDialog({
    user,
    open,
    onOpenChange,
}: UnbanUserDialogProps) {
    const { mutateAsync: unbanUser, isPending } = useUnbanUser();

    const handleUnban = async () => {
        const { error } = await unbanUser(user.id);

        if (error) {
            toast.error(error.message ?? 'Failed to unban user');
            return;
        }

        onOpenChange(false);
        toast.success('User unbanned');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unban {user.name}?</DialogTitle>
                    <DialogDescription>
                        The user will be able to sign in again.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUnban} disabled={isPending}>
                        {isPending ? 'Unbanning...' : 'Unban'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
