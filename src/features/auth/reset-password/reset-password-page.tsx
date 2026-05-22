import { Link } from 'react-router';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';
import { ResetPasswordForm } from './reset-password-form';

export function ResetPasswordPage() {
    return (
        <>
            <Metadata title="Reset Password" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Reset your password
                            </CardTitle>
                            <CardDescription>
                                Enter your new password below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResetPasswordForm />
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
