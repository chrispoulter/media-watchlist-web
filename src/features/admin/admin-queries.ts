import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import type { UserWithRole } from 'better-auth/plugins/admin';
import { authClient } from '@/lib/auth-client';
import type { UserRole } from '@/lib/permissions';

export type AdminUser = UserWithRole & {
    twoFactorEnabled?: boolean | null;
};

interface ListUsersParams {
    search: string;
    limit: number;
    offset: number;
}

const adminKeys = {
    all: ['admin'] as const,
    users: (params: ListUsersParams) =>
        [...adminKeys.all, 'users', params] as const,
    user: (userId: string) => [...adminKeys.all, 'user', userId] as const,
};

export function useAdminUsers(params: ListUsersParams) {
    return useQuery({
        queryKey: adminKeys.users(params),
        queryFn: async () => {
            const { data, error } = await authClient.admin.listUsers({
                query: {
                    searchValue: params.search || undefined,
                    searchField: 'email',
                    searchOperator: 'contains',
                    limit: params.limit,
                    offset: params.offset,
                    sortBy: 'createdAt',
                    sortDirection: 'desc',
                },
            });

            if (error) {
                throw new Error(error.message ?? 'Failed to load users');
            }

            return {
                users: data.users as AdminUser[],
                total: data.total,
            };
        },
        placeholderData: keepPreviousData,
    });
}

export function useAdminUser(userId: string) {
    return useQuery({
        queryKey: adminKeys.user(userId),
        queryFn: async () => {
            const { data, error } = await authClient.admin.getUser({
                query: { id: userId },
            });

            if (error) {
                throw new Error(error.message ?? 'Failed to load user');
            }

            return data as AdminUser;
        },
    });
}

function useInvalidateAdmin() {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: adminKeys.all });
}

interface CreateUserVariables {
    name: string;
    email: string;
    password: string;
    role: UserRole[];
}

export function useCreateUser() {
    const invalidate = useInvalidateAdmin();
    return useMutation({
        mutationFn: (values: CreateUserVariables) =>
            authClient.admin.createUser(values),
        onSuccess: invalidate,
    });
}

interface UpdateUserVariables {
    userId: string;
    // Including email requires the `user:set-email` permission
    data: { name: string; email?: string };
}

export function useUpdateAdminUser() {
    const invalidate = useInvalidateAdmin();
    return useMutation({
        mutationFn: ({ userId, data }: UpdateUserVariables) =>
            authClient.admin.updateUser({ userId, data }),
        onSuccess: invalidate,
    });
}

interface SetRoleVariables {
    userId: string;
    role: UserRole[];
}

export function useSetRole() {
    const invalidate = useInvalidateAdmin();
    return useMutation({
        mutationFn: ({ userId, role }: SetRoleVariables) =>
            authClient.admin.setRole({ userId, role }),
        onSuccess: invalidate,
    });
}

interface BanUserVariables {
    userId: string;
    banReason?: string;
    banExpiresIn?: number;
}

export function useBanUser() {
    const invalidate = useInvalidateAdmin();
    return useMutation({
        mutationFn: (values: BanUserVariables) =>
            authClient.admin.banUser(values),
        onSuccess: invalidate,
    });
}

export function useUnbanUser() {
    const invalidate = useInvalidateAdmin();
    return useMutation({
        mutationFn: (userId: string) => authClient.admin.unbanUser({ userId }),
        onSuccess: invalidate,
    });
}

export function useRemoveUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => authClient.admin.removeUser({ userId }),
        onSuccess: (_result, userId) => {
            queryClient.removeQueries({ queryKey: adminKeys.user(userId) });
            return queryClient.invalidateQueries({
                queryKey: adminKeys.all,
            });
        },
    });
}
