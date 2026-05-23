import { Route } from 'react-router';
import { RequireAuth } from '@/components/require-auth';
import { SearchPage } from './search-page';

export const searchRoutes = (
    <Route element={<RequireAuth />}>
        <Route path="/search" element={<SearchPage />} />
    </Route>
);
