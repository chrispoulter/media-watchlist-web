import { memo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MediaCard } from '@/components/media-card';
import {
    useAddToWatchlist,
    useRemoveFromWatchlist,
} from '@/features/watchlist/watchlist-queries';
import type { SearchResponse } from './search-queries';

interface SearchCardProps {
    result: SearchResponse[number];
}

function SearchCardComponent({ result }: SearchCardProps) {
    const [confirming, setConfirming] = useState(false);
    const { mutate: addToWatchlist, isPending: isAdding } = useAddToWatchlist();
    const { mutate: removeFromWatchlist, isPending: isRemoving } =
        useRemoveFromWatchlist();

    const handleAdd = () => {
        addToWatchlist(
            {
                providerId: result.providerId,
                mediaType: result.mediaType,
                title: result.title,
                posterUrl: result.posterUrl,
                overview: result.overview,
                releaseDate: result.releaseDate,
            },
            {
                onSuccess: () =>
                    toast.success(`"${result.title}" added to watchlist`),
                onError: (err) =>
                    toast.error(err.message ?? 'Failed to add to watchlist'),
            }
        );
    };

    const handleRemove = () => {
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
            return;
        }

        removeFromWatchlist(result.watchlistItemId!, {
            onSuccess: () =>
                toast.success(`"${result.title}" removed from watchlist`),
            onError: (err) =>
                toast.error(err.message ?? 'Failed to remove from watchlist'),
            onSettled: () => setConfirming(false),
        });
    };

    return (
        <MediaCard
            title={result.title}
            posterUrl={result.posterUrl}
            overview={result.overview}
            releaseDate={result.releaseDate}
            mediaType={result.mediaType}
            actions={
                <>
                    {result.watchlistItemId ? (
                        <Button
                            size="sm"
                            variant={confirming ? 'destructive' : 'outline'}
                            className="w-full"
                            onClick={handleRemove}
                            disabled={isRemoving}
                        >
                            {confirming ? 'Confirm remove' : 'Remove'}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={handleAdd}
                            disabled={isAdding}
                        >
                            Add to Watchlist
                        </Button>
                    )}
                </>
            }
        />
    );
}

export const SearchCard = memo(SearchCardComponent);
