import { useNavigate, useLocation } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useSignIn } from '../auth-queries';

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutateAsync: signIn, isPending } = useSignIn();

    const from = location.state?.from?.pathname ?? '/';

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', rememberMe: false },
    });

    const onSubmit = async (values: LoginFormValues) => {
        const { error } = await signIn(values);

        if (error) {
            toast.error(error.message ?? 'Sign in failed');
            return;
        }

        navigate(from, { replace: true });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-email">Email</FieldLabel>
                            <Input
                                id="login-email"
                                type="email"
                                placeholder="john@example.com"
                                autoComplete="username"
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
                            <FieldLabel htmlFor="login-password">
                                Password
                            </FieldLabel>
                            <Input
                                id="login-password"
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

                <div className="flex items-center justify-between">
                    <Controller
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="login-remember-me"
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <FieldLabel
                                    htmlFor="login-remember-me"
                                    className="font-normal"
                                >
                                    Remember me
                                </FieldLabel>
                            </Field>
                        )}
                    />
                    <a
                        href="/forgot-password"
                        className="text-sm whitespace-nowrap text-muted-foreground underline-offset-4 hover:underline"
                    >
                        Forgot password?
                    </a>
                </div>

                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Signing In...' : 'Sign In'}
                </Button>
            </FieldGroup>
        </form>
    );
}
