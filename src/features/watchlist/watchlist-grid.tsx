import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { MediaCardSkeleton } from '@/components/media-card-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { WatchlistCard } from './watchlist-card';
import { useWatchlist } from './watchlist-queries';

export function WatchlistGrid() {
    const { data: items, isLoading, error } = useWatchlist();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
                <MediaCardSkeleton />
                <MediaCardSkeleton />
                <MediaCardSkeleton />
                <MediaCardSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load watchlist. Please try again.
                </AlertDescription>
            </Alert>
        );
    }

    if (!items?.length) {
        return (
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyTitle>Your watchlist is empty</EmptyTitle>
                    <EmptyDescription>
                        Search for movies and TV shows to add them here
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild className="w-full sm:w-auto">
                        <Link to="/search">Browse titles</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
            {items.map((item) => (
                <WatchlistCard key={item.id} item={item} />
            ))}
        </div>
    );
}
