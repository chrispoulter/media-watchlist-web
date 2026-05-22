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
import { useSignUp } from '../auth-queries';

const registerSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const navigate = useNavigate();
    const { mutateAsync: signUp, isPending } = useSignUp();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        const { error } = await signUp({
            email: values.email,
            password: values.password,
            name: values.name,
        });

        if (error) {
            toast.error(error.message ?? 'Registration failed');
            return;
        }

        toast.success('Account created! Welcome.');
        navigate('/');
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-name">
                                Name
                            </FieldLabel>
                            <Input
                                id="register-name"
                                placeholder="John Smith"
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

                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-email">
                                Email
                            </FieldLabel>
                            <Input
                                id="register-email"
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

                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-password">
                                Password
                            </FieldLabel>
                            <Input
                                id="register-password"
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
                            <FieldLabel htmlFor="register-confirmPassword">
                                Confirm password
                            </FieldLabel>
                            <Input
                                id="register-confirmPassword"
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
                    {isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
            </FieldGroup>
        </form>
    );
}
