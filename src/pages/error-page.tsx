import { Link } from 'react-router';
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

interface ErrorPageProps {
    resetError: () => void;
}

export function ErrorPage({ resetError }: ErrorPageProps) {
    return (
        <>
            <Metadata title="Error" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Something went wrong
                            </CardTitle>
                            <CardDescription>
                                An unexpected error occurred
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertDescription>
                                    An unexpected error occurred. Please try
                                    again or return to the home page.
                                </AlertDescription>
                            </Alert>
                            <div className="flex flex-col-reverse gap-2">
                                <Button variant="outline" onClick={resetError}>
                                    Try again
                                </Button>
                                <Button asChild>
                                    <Link to="/">Home</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
