import { useSearchParams, useNavigate } from 'react-router';
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
import { useResetPassword } from '../auth-queries';

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutateAsync: resetPassword, isPending } = useResetPassword();

    const token = searchParams.get('token') ?? '';

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: '', confirmPassword: '' },
    });

    const onSubmit = async (values: ResetPasswordFormValues) => {
        const { error } = await resetPassword({
            newPassword: values.newPassword,
            token,
        });

        if (error) {
            toast.error(error.message ?? 'Failed to reset password');
            return;
        }

        toast.success('Password reset successfully. Please sign in.');
        navigate('/login');
    };

    if (!token) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Invalid or expired reset link. Please request a new one.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="reset-newPassword">
                                New password
                            </FieldLabel>
                            <Input
                                id="reset-newPassword"
                                type="password"
                                placeholder="••••••••"
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
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="reset-confirmPassword">
                                Confirm new password
                            </FieldLabel>
                            <Input
                                id="reset-confirmPassword"
                                type="password"
                                placeholder="••••••••"
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

                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Resetting...' : 'Reset Password'}
                </Button>
            </FieldGroup>
        </form>
    );
}
