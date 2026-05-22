import { useNavigate } from 'react-router';
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
import { useVerifyBackupCode } from '../auth-queries';

const recoveryCodeSchema = z.object({
    code: z.string().min(1, 'Recovery code is required'),
});

type RecoveryCodeFormValues = z.infer<typeof recoveryCodeSchema>;

interface RecoveryCodeFormProps {
    onBack?: () => void;
}

export function RecoveryCodeForm({ onBack }: RecoveryCodeFormProps) {
    const navigate = useNavigate();
    const { mutateAsync: verifyBackupCode, isPending } = useVerifyBackupCode();

    const form = useForm<RecoveryCodeFormValues>({
        resolver: zodResolver(recoveryCodeSchema),
        defaultValues: { code: '' },
    });

    const onSubmit = async (values: RecoveryCodeFormValues) => {
        const { error } = await verifyBackupCode(values.code);

        if (error) {
            toast.error(error.message ?? 'Invalid code');
            return;
        }

        navigate('/');
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="code"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="recovery-code">
                                Recovery code
                            </FieldLabel>
                            <Input
                                id="recovery-code"
                                placeholder="xxxxx-xxxxx"
                                autoFocus
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

                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Verifying...' : 'Verify'}
                </Button>
                <Button type="button" variant="link" onClick={onBack}>
                    Use Authenticator App Instead
                </Button>
            </FieldGroup>
        </form>
    );
}
