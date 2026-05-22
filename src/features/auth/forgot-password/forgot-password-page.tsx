import { Link } from 'react-router';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';
import { ForgotPasswordForm } from './forgot-password-form';

export function ForgotPasswordPage() {
    return (
        <>
            <Metadata title="Forgot Password" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Forgot Your Password?
                            </CardTitle>
                            <CardDescription>
                                Enter your email and we'll send you a reset link
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ForgotPasswordForm />
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground">
                        <Link
                            to="/login"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
