import { Link, useSearchParams } from 'react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';

const ERROR_MESSAGES: Record<string, string> = {
    "email_doesn't_match":
        "The Google account email doesn't match your account email. Please link a Google account that uses the same email address.",
    account_already_linked_to_different_user:
        'This Google account is already linked to a different user. Please use a different Google account.',
    unable_to_link_account:
        'Unable to link this account. Please try again or contact support if the issue persists.',
    invalid_code:
        'The authentication code was invalid or expired. Please try signing in again.',
    unable_to_get_user_info:
        'Could not retrieve your account information from Google. Please try again.',
    email_not_found:
        'No email address was returned by Google. Please ensure your Google account has a verified email.',
    oauth_provider_not_found:
        'The requested sign-in provider is not configured. Please contact support.',
};

const DEFAULT_MESSAGE =
    'An unexpected authentication error occurred. Please try again.';

export function AuthErrorPage() {
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error') ?? '';
    const message = ERROR_MESSAGES[error] ?? DEFAULT_MESSAGE;

    return (
        <>
            <Metadata title="Authentication Error" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Authentication error
                            </CardTitle>
                            <CardDescription>
                                Something went wrong during authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                            <Button asChild className="w-full">
                                <Link to="/">Home</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
