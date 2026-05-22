/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Route } from 'react-router';
import { RequireAuth } from '@/components/require-auth';

const SearchPage = lazy(() =>
    import('./search-page').then((m) => ({ default: m.SearchPage }))
);

export const searchRoutes = (
    <Route element={<RequireAuth />}>
        <Route path="/search" element={<SearchPage />} />
    </Route>
);
