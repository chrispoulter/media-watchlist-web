import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useForgotPassword } from '../auth-queries';

const forgotPasswordSchema = z.object({
    email: z.email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const [isSent, setIsSent] = useState(false);
    const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        const { error } = await forgotPassword(values.email);

        if (error) {
            toast.error(error.message ?? 'Failed to send reset email');
            return;
        }

        setIsSent(true);
    };

    if (isSent) {
        return (
            <Alert>
                <AlertDescription>
                    <p>
                        If an account with that email exists, we've sent a
                        password reset link.
                    </p>
                    <p>Please check your inbox.</p>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="forgot-email">
                                Email
                            </FieldLabel>
                            <Input
                                id="forgot-email"
                                type="email"
                                placeholder="john@example.com"
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

                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </FieldGroup>
        </form>
    );
}
