import { memo, useState } from 'react';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/react/sortable';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaCard } from '@/components/media-card';
import { cn } from '@/lib/utils';
import {
    useRemoveFromWatchlist,
    type WatchlistResponse,
} from './watchlist-queries';

interface WatchlistCardProps {
    item: WatchlistResponse[number];
    index: number;
}

export function WatchlistCardComponent({ item, index }: WatchlistCardProps) {
    const [confirming, setConfirming] = useState(false);
    const { ref, handleRef, isDragging } = useSortable({ id: item.id, index });
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
        <div
            ref={ref}
            className={cn(
                'rounded-xl transition-shadow',
                isDragging && 'opacity-80 shadow-lg'
            )}
        >
            <MediaCard
                title={item.title}
                posterUrl={item.posterUrl}
                overview={item.overview}
                releaseDate={item.releaseDate}
                mediaType={item.mediaType}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            ref={handleRef}
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Reorder "${item.title}"`}
                            // Enlarge the touch target to 44px and stop the page scrolling while dragging
                            className="relative shrink-0 cursor-grab touch-none after:absolute after:-inset-1.5 active:cursor-grabbing"
                        >
                            <GripVertical />
                        </Button>
                        <Button
                            size="sm"
                            variant={confirming ? 'destructive' : 'outline'}
                            className="flex-1"
                            onClick={handleRemove}
                            disabled={isRemoving}
                        >
                            {confirming ? 'Confirm remove' : 'Remove'}
                        </Button>
                    </div>
                }
            />
        </div>
    );
}

export const WatchlistCard = memo(WatchlistCardComponent);
