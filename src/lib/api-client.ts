import ky, { HTTPError } from 'ky';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import { config } from '@/lib/config';

type ApiError = {
    error?: string;
};

export const apiClient = ky.create({
    prefix: config.VITE_API_URL,
    credentials: 'include',
    hooks: {
        afterResponse: [
            async ({ response }) => {
                switch (response.status) {
                    case 401:
                        await authClient.signOut();
                        queryClient.clear();
                        break;
                }
                return response;
            },
        ],
        beforeError: [
            async ({ error }) => {
                if (error instanceof HTTPError) {
                    const body = error.data as ApiError;
                    error.message = body?.error || error.message;
                }
                return error;
            },
        ],
    },
});
