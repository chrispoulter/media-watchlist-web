import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from '@sentry/react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { queryClient } from '@/lib/query-client';
import { init } from '@/lib/instrument';
import App from './app.tsx';

import './index.css';

init();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                    <ErrorBoundary
                        fallback={
                            <div className="flex min-h-screen items-center justify-center p-8 text-center">
                                Something went wrong. Please refresh the page.
                            </div>
                        }
                        beforeCapture={(scope) =>
                            scope.setTag('section', 'main')
                        }
                    >
                        <App />
                    </ErrorBoundary>
                    <Toaster invert />
                </ThemeProvider>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);
