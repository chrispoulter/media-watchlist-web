import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Metadata } from '@/components/metadata';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAdminUsers } from '../admin-queries';
import { RoleBadge, StatusBadge } from './user-badges';
import { UserActionsMenu } from './user-actions-menu';
import { CreateUserDialog } from './create-user-dialog';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export function UsersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('q') ?? '';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        if (searchInput === search) {
            return;
        }

        const timeout = setTimeout(() => {
            setSearchParams(searchInput ? { q: searchInput } : {}, {
                replace: true,
            });
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [searchInput, search, setSearchParams]);

    const { data, isLoading, isPlaceholderData, error } = useAdminUsers({
        search,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
    });

    const total = data?.total ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const goToPage = (nextPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(nextPage));
        setSearchParams(params);
    };

    return (
        <>
            <Metadata title="Users" />
            <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Input
                        type="search"
                        placeholder="Search by email..."
                        aria-label="Search users by email"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="sm:max-w-xs"
                    />
                    <CreateUserDialog />
                </div>

                {error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                ) : isLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : !data?.users.length ? (
                    <Empty className="border border-dashed">
                        <EmptyHeader>
                            <EmptyTitle>No users found</EmptyTitle>
                            <EmptyDescription>
                                {search
                                    ? 'Try a different search term'
                                    : 'There are no user accounts yet'}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div
                        className={
                            isPlaceholderData ? 'opacity-60 transition' : ''
                        }
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">
                                        Created
                                    </TableHead>
                                    <TableHead className="w-12">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                to={`/admin/users/${user.id}`}
                                                className="hover:underline"
                                            >
                                                {user.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <RoleBadge user={user} />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <StatusBadge user={user} />
                                        </TableCell>
                                        <TableCell className="hidden text-muted-foreground lg:table-cell">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <UserActionsMenu
                                                user={user}
                                                showViewDetails
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        aria-label={`Actions for ${user.name}`}
                                                    >
                                                        <MoreHorizontal />
                                                    </Button>
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {total > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            {total} {total === 1 ? 'user' : 'users'}
                        </span>
                        <div className="flex items-center gap-2">
                            <span>
                                Page {page} of {pageCount}
                            </span>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                aria-label="Previous page"
                                onClick={() => goToPage(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                aria-label="Next page"
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= pageCount}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
