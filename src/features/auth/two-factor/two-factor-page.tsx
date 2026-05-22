import { useState } from 'react';
import { Link } from 'react-router';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';
import { TwoFactorForm } from './two-factor-form';
import { RecoveryCodeForm } from './recovery-code-form';

type TwoFactorMode = 'totp' | 'recovery';

export function TwoFactorPage() {
    const [mode, setMode] = useState<TwoFactorMode>('totp');

    return (
        <>
            <Metadata title="Two-Factor Authentication" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Two-factor authentication
                            </CardTitle>
                            <CardDescription>
                                {mode === 'totp' &&
                                    'Enter the 6-digit code from your authenticator app'}
                                {mode === 'recovery' &&
                                    'Enter one of your backup recovery codes'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mode === 'totp' && (
                                <TwoFactorForm
                                    onBack={() => setMode('recovery')}
                                />
                            )}
                            {mode === 'recovery' && (
                                <RecoveryCodeForm
                                    onBack={() => setMode('totp')}
                                />
                            )}
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
