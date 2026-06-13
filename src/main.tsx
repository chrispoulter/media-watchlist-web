import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { queryClient } from '@/lib/query-client';
import App from './app.tsx';

import './index.css';

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
                    >
                        <App />
                    </ErrorBoundary>
                    <Toaster richColors />
                </ThemeProvider>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);
