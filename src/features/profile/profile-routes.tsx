/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Route } from 'react-router';
import { RequireAuth } from '@/components/require-auth';
import { ProfileLayout } from './profile-layout';

const ProfileTab = lazy(() =>
    import('./info/profile-tab').then((m) => ({ default: m.ProfileTab }))
);
const SecurityTab = lazy(() =>
    import('./security/security-tab').then((m) => ({ default: m.SecurityTab }))
);
const DangerTab = lazy(() =>
    import('./danger/danger-tab').then((m) => ({ default: m.DangerTab }))
);

export const profileRoutes = (
    <Route element={<RequireAuth />}>
        <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileTab />} />
            <Route path="security" element={<SecurityTab />} />
            <Route path="danger" element={<DangerTab />} />
        </Route>
    </Route>
);
