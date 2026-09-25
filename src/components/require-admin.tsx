import { Navigate, Outlet, useLocation } from 'react-router';
import { Spinner } from '@/components/ui/spinner';
import { authClient, canAccessAdmin } from '@/lib/auth-client';

export function RequireAdmin() {
    const { data: session, isPending } = authClient.useSession();
    const location = useLocation();

    if (isPending) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!canAccessAdmin(session.user)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
