import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Metadata } from '@/components/metadata';

export function NotFoundPage() {
    return (
        <>
            <Metadata title="Page Not Found" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Page not found
                            </CardTitle>
                            <CardDescription>
                                The page you're looking for doesn't exist.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
