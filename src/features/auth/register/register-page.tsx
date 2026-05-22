import { Link } from 'react-router';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Metadata } from '@/components/metadata';
import { SocialSignInButtons } from '@/components/social-sign-in-buttons';
import { RegisterForm } from './register-form';

export function RegisterPage() {
    return (
        <>
            <Metadata title="Register" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Create an Account
                            </CardTitle>
                            <CardDescription>
                                Enter your details to get started
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SocialSignInButtons />

                            <div className="relative">
                                <Separator />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                    or
                                </span>
                            </div>

                            <RegisterForm />
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
