import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { authClient, hasPermission } from '@/lib/auth-client';
import { useUpdateAdminUser, type AdminUser } from '../admin-queries';

const editUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Enter a valid email address'),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
    user,
    open,
    onOpenChange,
}: EditUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit user</DialogTitle>
                    <DialogDescription>
                        Update the details for this account.
                    </DialogDescription>
                </DialogHeader>
                <EditUserForm user={user} onDone={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

interface EditUserFormProps {
    user: AdminUser;
    onDone: () => void;
}

function EditUserForm({ user, onDone }: EditUserFormProps) {
    const { data: session } = authClient.useSession();
    const { mutateAsync: updateUser, isPending } = useUpdateAdminUser();

    const canSetEmail = hasPermission(session?.user, { user: ['set-email'] });

    const form = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        defaultValues: { name: user.name, email: user.email },
    });

    const onSubmit = async (values: EditUserFormValues) => {
        const emailChanged = canSetEmail && values.email !== user.email;

        const { error } = await updateUser({
            userId: user.id,
            data: {
                name: values.name,
                ...(emailChanged && { email: values.email }),
            },
        });

        if (error) {
            toast.error(error.message ?? 'Failed to update user');
            return;
        }

        toast.success('User updated');
        onDone();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="edit-user-name">
                                Name
                            </FieldLabel>
                            <Input
                                id="edit-user-name"
                                autoComplete="off"
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="edit-user-email">
                                Email
                            </FieldLabel>
                            <Input
                                id="edit-user-email"
                                type="email"
                                autoComplete="off"
                                readOnly={!canSetEmail}
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {!canSetEmail && (
                                <FieldDescription>
                                    Only administrators can change email
                                    addresses.
                                </FieldDescription>
                            )}
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onDone}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </FieldGroup>
        </form>
    );
}
