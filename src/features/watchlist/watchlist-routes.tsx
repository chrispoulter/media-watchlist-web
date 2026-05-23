import { Route } from 'react-router';
import { RequireAuth } from '@/components/require-auth';
import { WatchlistPage } from './watchlist-page';

export const watchlistRoutes = (
    <Route element={<RequireAuth />}>
        <Route path="/" element={<WatchlistPage />} />
    </Route>
);
