import { Route } from 'react-router';
import { RequireGuest } from '@/components/require-guest';
import { LoginPage } from './login/login-page';
import { RegisterPage } from './register/register-page';
import { ForgotPasswordPage } from './forgot-password/forgot-password-page';
import { TwoFactorPage } from './two-factor/two-factor-page';
import { ResetPasswordPage } from './reset-password/reset-password-page';
import { AuthErrorPage } from './auth-error-page';

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
