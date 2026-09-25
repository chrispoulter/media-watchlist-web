import { Routes, Route } from 'react-router';
import { RootLayout } from '@/components/root-layout';
import { NotFoundPage } from '@/pages/not-found-page';
import { adminRoutes } from '@/features/admin/admin-routes';
import { authRoutes } from '@/features/auth/auth-routes';
import { profileRoutes } from '@/features/profile/profile-routes';
import { searchRoutes } from '@/features/search/search-routes';
import { watchlistRoutes } from '@/features/watchlist/watchlist-routes';

export default function App() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                {adminRoutes}
                {authRoutes}
                {profileRoutes}
                {searchRoutes}
                {watchlistRoutes}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
