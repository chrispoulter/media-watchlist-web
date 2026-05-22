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
import { useGenerateBackupCodes } from '../../profile-queries';

const generateBackupCodesSchema = z.object({
    password: z.string().min(1, 'Password is required'),
});

type GenerateBackupCodesFormValues = z.infer<typeof generateBackupCodesSchema>;

interface TwoFactorConfirmBackupCodesProps {
    onRegenerated: (newCodes: string[]) => void;
    onCancel: () => void;
}

export function TwoFactorConfirmBackupCodes({
    onRegenerated,
    onCancel,
}: TwoFactorConfirmBackupCodesProps) {
    const { mutateAsync: generateBackupCodes, isPending } =
        useGenerateBackupCodes();

    const form = useForm<GenerateBackupCodesFormValues>({
        resolver: zodResolver(generateBackupCodesSchema),
        defaultValues: { password: '' },
    });

    const onSubmit = async (values: GenerateBackupCodesFormValues) => {
        const result = await generateBackupCodes(values.password);

        if (result.error) {
            toast.error(
                result.error.message ?? 'Failed to regenerate backup codes'
            );
            return;
        }

        onRegenerated(result.data?.backupCodes ?? []);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="backup-codes-password">
                                Confirm with your password
                            </FieldLabel>
                            <Input
                                id="backup-codes-password"
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
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Regenerating...' : 'Regenerate Codes'}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
