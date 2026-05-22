import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';

interface SignInVariables {
    email: string;
    password: string;
    rememberMe: boolean;
}

export function useSignIn() {
    return useMutation({
        mutationFn: (values: SignInVariables) =>
            authClient.signIn.email(values),
    });
}

interface SignUpVariables {
    email: string;
    password: string;
    name: string;
}

export function useSignUp() {
    return useMutation({
        mutationFn: (values: SignUpVariables) =>
            authClient.signUp.email(values),
    });
}

export function useSignOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authClient.signOut(),
        onSuccess: () => queryClient.clear(),
    });
}

export function useSocialSignIn() {
    return useMutation({
        mutationFn: (provider: string) =>
            authClient.signIn.social({
                provider: provider as Parameters<
                    typeof authClient.signIn.social
                >[0]['provider'],
                callbackURL: `${window.location.origin}/`,
                errorCallbackURL: `${window.location.origin}/auth/error`,
            }),
    });
}

export function useVerifyTotpLogin() {
    return useMutation({
        mutationFn: (code: string) => authClient.twoFactor.verifyTotp({ code }),
    });
}

export function useVerifyBackupCode() {
    return useMutation({
        mutationFn: (code: string) =>
            authClient.twoFactor.verifyBackupCode({ code }),
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (email: string) =>
            authClient.requestPasswordReset({
                email,
                redirectTo: `${window.location.origin}/reset-password`,
            }),
    });
}

interface ResetPasswordVariables {
    newPassword: string;
    token: string;
}

export function useResetPassword() {
    return useMutation({
        mutationFn: ({ newPassword, token }: ResetPasswordVariables) =>
            authClient.resetPassword({ newPassword, token }),
    });
}
