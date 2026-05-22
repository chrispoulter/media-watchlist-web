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
import { useDisableTwoFactor } from '../../profile-queries';

const disableTwoFactorSchema = z.object({
    password: z.string().min(1, 'Password is required'),
});

type DisableTwoFactorFormValues = z.infer<typeof disableTwoFactorSchema>;

interface TwoFactorConfirmDisableProps {
    onDisabled: () => void;
    onCancel: () => void;
}

export function TwoFactorConfirmDisable({
    onDisabled,
    onCancel,
}: TwoFactorConfirmDisableProps) {
    const { mutateAsync: disableTwoFactor, isPending } = useDisableTwoFactor();

    const form = useForm<DisableTwoFactorFormValues>({
        resolver: zodResolver(disableTwoFactorSchema),
        defaultValues: { password: '' },
    });

    const onSubmit = async (values: DisableTwoFactorFormValues) => {
        const result = await disableTwoFactor(values.password);

        if (result.error) {
            toast.error(result.error.message ?? 'Failed to disable 2FA');
            return;
        }

        toast.success('Two-factor authentication disabled');
        onDisabled();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="disable-2fa-password">
                                Confirm with your password
                            </FieldLabel>
                            <Input
                                id="disable-2fa-password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
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
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={isPending}
                    >
                        {isPending ? 'Disabling...' : 'Disable 2FA'}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
