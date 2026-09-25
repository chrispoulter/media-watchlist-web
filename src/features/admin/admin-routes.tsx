import { Navigate, Route } from 'react-router';
import { RequireAdmin } from '@/components/require-admin';
import { AdminLayout } from './admin-layout';
import { UsersPage } from './users/users-page';
import { UserDetailPage } from './users/user-detail-page';

export const adminRoutes = (
    <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
        </Route>
    </Route>
);
