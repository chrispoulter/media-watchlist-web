import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { useChangeEmail } from '../profile-queries';

const verificationErrorMessages: Record<string, string> = {
    USER_NOT_FOUND:
        'This verification link has already been used or has expired.',
};

const updateEmailSchema = z.object({
    newEmail: z.email('Invalid email address'),
});

type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;

export function UpdateEmailForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const { data: session } = authClient.useSession();
    const { mutateAsync: changeEmail, isPending } = useChangeEmail();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            toast.error(
                verificationErrorMessages[error] ?? 'Email verification failed.'
            );

            setSearchParams((prev) => {
                prev.delete('error');
                return prev;
            });
        }
    }, [searchParams, setSearchParams]);

    const form = useForm<UpdateEmailFormValues>({
        resolver: zodResolver(updateEmailSchema),
        defaultValues: { newEmail: '' },
    });

    const onSubmit = async (values: UpdateEmailFormValues) => {
        const { error } = await changeEmail(values.newEmail);

        if (error) {
            toast.error(error.message ?? 'Failed to update email');
            return;
        }

        setPendingEmail(values.newEmail);
        form.reset();
    };

    if (pendingEmail) {
        return (
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Current email:{' '}
                    <span className="font-medium break-all text-foreground">
                        {session?.user.email}
                    </span>
                </p>
                <Alert>
                    <AlertDescription>
                        <p>
                            A verification link has been sent to{' '}
                            <strong className="break-all">
                                {pendingEmail}
                            </strong>
                            .
                        </p>
                        <p>
                            Click the link in that email to confirm the change.
                            Your current email remains active until then.
                        </p>
                    </AlertDescription>
                </Alert>
                <Button
                    variant="outline"
                    onClick={() => setPendingEmail(null)}
                    className="w-full sm:w-auto"
                >
                    Use a Different Email
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Current email:{' '}
                <span className="font-medium break-all text-foreground">
                    {session?.user.email}
                </span>
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        control={form.control}
                        name="newEmail"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email-newEmail">
                                    New email address
                                </FieldLabel>
                                <Input
                                    id="email-newEmail"
                                    type="email"
                                    placeholder="new@example.com"
                                    autoComplete="email"
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
                            {isPending
                                ? 'Sending Verification...'
                                : 'Update Email'}
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </div>
    );
}
