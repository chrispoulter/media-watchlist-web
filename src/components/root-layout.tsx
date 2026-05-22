import { Outlet } from 'react-router';
import { ErrorBoundary } from '@sentry/react';
import { ErrorPage } from '@/pages/error-page';
import { Header } from './header';
import { Footer } from './footer';
import { useSentryUser } from '@/lib/use-sentry-user';

export function RootLayout() {
    useSentryUser();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col px-4 py-8">
                <ErrorBoundary
                    fallback={(props) => <ErrorPage {...props} />}
                    beforeCapture={(scope) =>
                        scope.setTag('section', 'root-layout')
                    }
                >
                    <Outlet />
                </ErrorBoundary>
            </main>
            <Footer />
        </div>
    );
}
