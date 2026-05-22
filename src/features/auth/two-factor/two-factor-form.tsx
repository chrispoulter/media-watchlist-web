import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useVerifyTotpLogin } from '../auth-queries';

const twoFactorSchema = z.object({
    code: z.string().length(6, 'Code must be 6 digits'),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

interface TwoFactorFormProps {
    onBack?: () => void;
}

export function TwoFactorForm({ onBack }: TwoFactorFormProps) {
    const navigate = useNavigate();
    const { mutateAsync: verifyTotp, isPending } = useVerifyTotpLogin();

    const form = useForm<TwoFactorFormValues>({
        resolver: zodResolver(twoFactorSchema),
        defaultValues: { code: '' },
        // HACK: prevent RHF from auto-focusing the first invalid field on submit, which breaks error state render
        shouldFocusError: false,
    });

    const onSubmit = async (values: TwoFactorFormValues) => {
        const { error } = await verifyTotp(values.code);

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
                        <Field
                            data-invalid={fieldState.invalid}
                            className="items-center *:w-auto"
                        >
                            <FieldLabel htmlFor="two-factor-code">
                                Authentication code
                            </FieldLabel>
                            <InputOTP
                                id="two-factor-code"
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS}
                                autoComplete="one-time-code"
                                autoFocus
                                aria-invalid={fieldState.invalid}
                                {...field}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
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
                    Use Recovery Code Instead
                </Button>
            </FieldGroup>
        </form>
    );
}
