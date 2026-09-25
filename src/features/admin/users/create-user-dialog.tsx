import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useCreateUser } from '../admin-queries';
import { RoleCheckboxes } from './role-checkboxes';

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z
        .array(z.enum(['user', 'moderator', 'admin']))
        .min(1, 'Select at least one role'),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function CreateUserDialog() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus />
                    Create User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create user</DialogTitle>
                    <DialogDescription>
                        Create a new account with an email and password.
                    </DialogDescription>
                </DialogHeader>
                <CreateUserForm onDone={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

function CreateUserForm({ onDone }: { onDone: () => void }) {
    const { mutateAsync: createUser, isPending } = useCreateUser();

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { name: '', email: '', password: '', role: ['user'] },
    });

    const onSubmit = async (values: CreateUserFormValues) => {
        const { error } = await createUser(values);

        if (error) {
            toast.error(error.message ?? 'Failed to create user');
            return;
        }

        toast.success('User created');
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
                            <FieldLabel htmlFor="create-user-name">
                                Name
                            </FieldLabel>
                            <Input
                                id="create-user-name"
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
                            <FieldLabel htmlFor="create-user-email">
                                Email
                            </FieldLabel>
                            <Input
                                id="create-user-email"
                                type="email"
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
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="create-user-password">
                                Password
                            </FieldLabel>
                            <Input
                                id="create-user-password"
                                type="password"
                                autoComplete="new-password"
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
                    name="role"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Roles</FieldLabel>
                            <RoleCheckboxes
                                idPrefix="create-user-role"
                                value={field.value}
                                onChange={field.onChange}
                            />
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
                        {isPending ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </FieldGroup>
        </form>
    );
}
