import { Badge } from '@/components/ui/badge';
import type { MediaType } from '@/types';

interface MediaCardProps {
    title: string;
    posterUrl?: string;
    overview?: string;
    releaseDate?: string;
    mediaType: MediaType;
    actions?: React.ReactNode;
}

export function MediaCard({
    title,
    posterUrl,
    overview,
    releaseDate,
    mediaType,
    actions,
}: MediaCardProps) {
    const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
    const fallback =
        mediaType === 'tv' ? '/default-tv-show.svg' : '/default-movie.svg';

    return (
        <div className="flex flex-row overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <img
                src={posterUrl || fallback}
                alt={title}
                onError={(e) => {
                    e.currentTarget.src = fallback;
                }}
                className="h-60 w-40 object-cover"
            />
            <div className="flex flex-col gap-3 p-4">
                <h3 className="line-clamp-1 font-semibold">{title}</h3>
                {year && <Badge variant="secondary">{year}</Badge>}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {overview}
                </p>
                <div className="mt-auto">{actions}</div>
            </div>
        </div>
    );
}
