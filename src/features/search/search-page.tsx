import { Metadata } from '@/components/metadata';
import { SearchGrid } from './search-grid';

export function SearchPage() {
    return (
        <>
            <Metadata title="Search" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Search
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Find movies and TV shows to add to your watchlist
                    </p>
                </div>
                <SearchGrid />
            </div>
        </>
    );
}
