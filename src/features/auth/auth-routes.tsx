/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Route } from 'react-router';
import { RequireGuest } from '@/components/require-guest';

const LoginPage = lazy(() =>
    import('./login/login-page').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
    import('./register/register-page').then((m) => ({
        default: m.RegisterPage,
    }))
);
const ForgotPasswordPage = lazy(() =>
    import('./forgot-password/forgot-password-page').then((m) => ({
        default: m.ForgotPasswordPage,
    }))
);
const TwoFactorPage = lazy(() =>
    import('./two-factor/two-factor-page').then((m) => ({
        default: m.TwoFactorPage,
    }))
);
const ResetPasswordPage = lazy(() =>
    import('./reset-password/reset-password-page').then((m) => ({
        default: m.ResetPasswordPage,
    }))
);
const AuthErrorPage = lazy(() =>
    import('./auth-error-page').then((m) => ({ default: m.AuthErrorPage }))
);

export const authRoutes = (
    <>
        <Route element={<RequireGuest />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route path="/two-factor" element={<TwoFactorPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/error" element={<AuthErrorPage />} />
    </>
);
