import { memo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MediaCard } from '@/components/media-card';
import type { WatchlistItem } from '@/types';
import { useRemoveFromWatchlist } from './watchlist-queries';

interface WatchlistCardProps {
    item: WatchlistItem;
}

export function WatchlistCardComponent({ item }: WatchlistCardProps) {
    const [confirming, setConfirming] = useState(false);
    const { mutate: removeFromWatchlist, isPending: isRemoving } =
        useRemoveFromWatchlist();

    const handleRemove = () => {
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
            return;
        }

        removeFromWatchlist(item.id, {
            onSuccess: () =>
                toast.success(`"${item.title}" removed from watchlist`),
            onError: (err) =>
                toast.error(err.message ?? 'Failed to remove from watchlist'),
            onSettled: () => setConfirming(false),
        });
    };

    return (
        <MediaCard
            title={item.title}
            posterUrl={item.posterUrl}
            overview={item.overview}
            releaseDate={item.releaseDate}
            mediaType={item.mediaType}
            actions={
                <Button
                    size="sm"
                    variant={confirming ? 'destructive' : 'outline'}
                    className="w-full"
                    onClick={handleRemove}
                    disabled={isRemoving}
                >
                    {confirming ? 'Confirm remove' : 'Remove'}
                </Button>
            }
        />
    );
}

export const WatchlistCard = memo(WatchlistCardComponent);
