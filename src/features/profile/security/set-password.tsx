import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useSetPasswordReset } from '../profile-queries';

export function SetPassword() {
    const [isSent, setIsSent] = useState(false);
    const { data: session } = authClient.useSession();
    const { mutateAsync: requestReset, isPending } = useSetPasswordReset();

    const email = session?.user.email ?? '';

    const handleSend = async () => {
        const { error } = await requestReset(email);

        if (error) {
            toast.error(error.message ?? 'Failed to send password setup email');
            return;
        }

        setIsSent(true);
    };

    if (isSent) {
        return (
            <Alert>
                <AlertDescription>
                    <p>
                        We've sent a link to{' '}
                        <strong className="break-all">{email}</strong> to set up
                        your password.
                    </p>
                    <p>
                        Once set, you'll be able to sign in with your email
                        address in addition to Google.
                    </p>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                You currently sign in with a linked account. Add a password to
                also sign in with your email address.
            </p>
            <Button
                onClick={handleSend}
                disabled={isPending}
                className="w-full sm:w-auto"
            >
                {isPending ? 'Setting...' : 'Set Password'}
            </Button>
        </div>
    );
}
