import { Metadata } from '@/components/metadata';
import { WatchlistGrid } from './watchlist-grid';

export function WatchlistPage() {
    return (
        <>
            <Metadata title="My Watchlist" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        My Watchlist
                    </h1>
                </div>
                <WatchlistGrid />
            </div>
        </>
    );
}
