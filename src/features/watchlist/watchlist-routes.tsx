/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Route } from 'react-router';
import { RequireAuth } from '@/components/require-auth';

const WatchlistPage = lazy(() =>
    import('./watchlist-page').then((m) => ({ default: m.WatchlistPage }))
);

export const watchlistRoutes = (
    <Route element={<RequireAuth />}>
        <Route path="/" element={<WatchlistPage />} />
    </Route>
);
