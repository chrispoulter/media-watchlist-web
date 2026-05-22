import { Skeleton } from '@/components/ui/skeleton';

export function MediaCardSkeleton() {
    return (
        <div className="flex flex-row overflow-hidden rounded-xl border bg-card shadow-sm">
            <Skeleton className="h-60 w-40 shrink-0 rounded-none" />
            <div className="flex flex-1 flex-col gap-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="mt-auto h-9 w-full rounded-md" />
            </div>
        </div>
    );
}
