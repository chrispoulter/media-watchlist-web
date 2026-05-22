import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';

const profileKeys = {
    all: ['profile'] as const,
};

export function useAccounts() {
    return useQuery({
        queryKey: profileKeys.all,
        queryFn: async () => {
            const { data, error } = await authClient.listAccounts();

            if (error) {
                throw new Error(error.message ?? 'Failed to load accounts');
            }

            return data;
        },
    });
}

export function useUpdateUser() {
    return useMutation({
        mutationFn: (values: { name: string }) => authClient.updateUser(values),
    });
}

export function useChangeEmail() {
    return useMutation({
        mutationFn: (newEmail: string) =>
            authClient.changeEmail({
                newEmail,
                callbackURL: `${window.location.origin}/profile`,
            }),
    });
}

interface ChangePasswordVariables {
    currentPassword: string;
    newPassword: string;
}

export function useChangePassword() {
    return useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: ChangePasswordVariables) =>
            authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            }),
    });
}

export function useSetPasswordReset() {
    return useMutation({
        mutationFn: (email: string) =>
            authClient.requestPasswordReset({
                email,
                redirectTo: `${window.location.origin}/reset-password`,
            }),
    });
}

export function useDeleteUser() {
    return useMutation({
        mutationFn: () => authClient.deleteUser(),
    });
}

export function useLinkSocial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (provider: string) =>
            authClient.linkSocial({
                provider,
                callbackURL: window.location.href,
                errorCallbackURL: `${window.location.origin}/auth/error`,
            }),
        // NOTE: linkSocial redirects for OAuth; onSuccess only fires on error paths.
        // Successful link re-fetches naturally when callbackURL remounts the page.
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: profileKeys.all }),
    });
}

export function useUnlinkAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (providerId: string) =>
            authClient.unlinkAccount({ providerId }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: profileKeys.all }),
    });
}

export function useEnableTwoFactor() {
    return useMutation({
        mutationFn: (password: string) =>
            authClient.twoFactor.enable({ password }),
    });
}

export function useDisableTwoFactor() {
    return useMutation({
        mutationFn: (password: string) =>
            authClient.twoFactor.disable({ password }),
    });
}

export function useVerifyTotpSetup() {
    return useMutation({
        mutationFn: (code: string) => authClient.twoFactor.verifyTotp({ code }),
    });
}

export function useGenerateBackupCodes() {
    return useMutation({
        mutationFn: (password: string) =>
            authClient.twoFactor.generateBackupCodes({ password }),
    });
}
