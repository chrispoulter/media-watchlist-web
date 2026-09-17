import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    searchKeys,
    type SearchResponse,
} from '@/features/search/search-queries';
import type { MediaType } from '@/types';
import { apiClient } from '@/lib/api-client';

const watchlistKeys = {
    all: ['watchlist'] as const,
};

export type WatchlistResponse = {
    id: number;
    providerId: string;
    mediaType: MediaType;
    title: string;
    posterUrl?: string;
    overview?: string;
    releaseDate?: string;
    addedAt: string;
}[];

export function useWatchlist() {
    return useQuery({
        queryKey: watchlistKeys.all,
        queryFn: ({ signal }) =>
            apiClient
                .get('/api/watchlist', { signal })
                .json<WatchlistResponse>(),
    });
}

interface AddToWatchlistVariables {
    providerId: string;
    mediaType: MediaType;
    title: string;
    posterUrl?: string;
    overview?: string;
    releaseDate?: string;
}

interface AddWatchListItemResponse {
    id: number;
    providerId: string;
    mediaType: MediaType;
    title: string;
    posterUrl?: string;
    overview?: string;
    releaseDate?: string;
    addedAt: string;
}

export function useAddToWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: AddToWatchlistVariables) =>
            apiClient
                .post('/api/watchlist', { json: item })
                .json<AddWatchListItemResponse>(),
        onSuccess: (data, variables) => {
            queryClient.setQueryData<WatchlistResponse>(
                watchlistKeys.all,
                (old) => (old ? [...old, data] : [data])
            );

            queryClient.setQueriesData<SearchResponse>(
                { queryKey: searchKeys.all },
                (old) =>
                    old?.map((r) =>
                        r.providerId === variables.providerId &&
                        r.mediaType === variables.mediaType
                            ? { ...r, watchlistItemId: data.id }
                            : r
                    )
            );
        },
    });
}

export function useRemoveFromWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(`/api/watchlist/${id}`),
        onSuccess: (_, id) => {
            queryClient.setQueryData<WatchlistResponse>(
                watchlistKeys.all,
                (old) => old?.filter((item) => item.id !== id)
            );

            queryClient.setQueriesData<SearchResponse>(
                { queryKey: searchKeys.all },
                (old) =>
                    old?.map((r) =>
                        r.watchlistItemId === id
                            ? { ...r, watchlistItemId: undefined }
                            : r
                    )
            );
        },
    });
}
