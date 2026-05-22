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
import { useVerifyTotpSetup } from '../../profile-queries';

const verifyTotpSchema = z.object({
    code: z.string().length(6, 'Code must be 6 digits'),
});

type VerifyTotpFormValues = z.infer<typeof verifyTotpSchema>;

interface TwoFactorVerifyProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function TwoFactorVerify({ onSuccess, onCancel }: TwoFactorVerifyProps) {
    const { mutateAsync: verifyTotp, isPending } = useVerifyTotpSetup();

    const form = useForm<VerifyTotpFormValues>({
        resolver: zodResolver(verifyTotpSchema),
        defaultValues: { code: '' },
        // HACK: prevent RHF from auto-focusing the first invalid field on submit, which breaks error state render
        shouldFocusError: false,
    });

    const onSubmit = async (values: VerifyTotpFormValues) => {
        const result = await verifyTotp(values.code);

        if (result.error) {
            toast.error(result.error.message ?? 'Invalid code');
            return;
        }

        toast.success('Two-factor authentication enabled');
        onSuccess();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="code"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="two-factor-code">
                                Enter the 6-digit code from your app
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

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Back
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Verifying...' : 'Verify & Enable'}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
