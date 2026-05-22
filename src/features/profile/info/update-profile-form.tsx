import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { useUpdateUser } from '../profile-queries';

const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export function UpdateProfileForm() {
    const { data: session } = authClient.useSession();
    const { mutateAsync: updateUser, isPending } = useUpdateUser();

    const user = session?.user;

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name ?? '',
        },
    });

    const onSubmit = async (values: UpdateProfileFormValues) => {
        const { error } = await updateUser({ name: values.name });

        if (error) {
            toast.error(error.message ?? 'Failed to update profile');
            return;
        }

        toast.success('Profile updated');
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                            <Input
                                id="profile-name"
                                autoComplete="name"
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
