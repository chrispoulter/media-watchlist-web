import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Metadata } from '@/components/metadata';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAdminUser } from '../admin-queries';
import { RoleBadges, StatusBadge } from './user-badges';
import { isBanned } from './user-utils';
import { UserActionsMenu } from './user-actions-menu';

function formatDate(value: Date | string | null | undefined) {
    return value ? new Date(value).toLocaleString() : '—';
}

export function UserDetailPage() {
    const { userId = '' } = useParams();
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useAdminUser(userId);

    return (
        <>
            <Metadata title={user?.name ?? 'User'} />
            <div className="space-y-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/users">
                        <ArrowLeft />
                        Back to users
                    </Link>
                </Button>

                {error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                ) : isLoading || !user ? (
                    <Skeleton className="h-72 w-full" />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                            <CardAction>
                                <UserActionsMenu
                                    user={user}
                                    onRemoved={() =>
                                        navigate('/admin/users', {
                                            replace: true,
                                        })
                                    }
                                    trigger={
                                        <Button variant="outline">
                                            Actions
                                            <ChevronDown />
                                        </Button>
                                    }
                                />
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 text-sm sm:grid-cols-2">
                                <DetailItem label="User ID">
                                    <span className="font-mono break-all">
                                        {user.id}
                                    </span>
                                </DetailItem>
                                <DetailItem label="Roles">
                                    <RoleBadges user={user} />
                                </DetailItem>
                                <DetailItem label="Status">
                                    <StatusBadge user={user} />
                                </DetailItem>
                                <DetailItem label="Email verified">
                                    <YesNoBadge value={user.emailVerified} />
                                </DetailItem>
                                <DetailItem label="Two-factor authentication">
                                    <YesNoBadge
                                        value={!!user.twoFactorEnabled}
                                    />
                                </DetailItem>
                                {isBanned(user) && (
                                    <>
                                        <DetailItem label="Ban reason">
                                            {user.banReason || '—'}
                                        </DetailItem>
                                        <DetailItem label="Ban expires">
                                            {user.banExpires
                                                ? formatDate(user.banExpires)
                                                : 'Never'}
                                        </DetailItem>
                                    </>
                                )}
                                <DetailItem label="Created">
                                    {formatDate(user.createdAt)}
                                </DetailItem>
                                <DetailItem label="Last updated">
                                    {formatDate(user.updatedAt)}
                                </DetailItem>
                            </dl>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

interface DetailItemProps {
    label: string;
    children: ReactNode;
}

function DetailItem({ label, children }: DetailItemProps) {
    return (
        <div className="space-y-1">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{children}</dd>
        </div>
    );
}

function YesNoBadge({ value }: { value: boolean }) {
    return (
        <Badge variant={value ? 'secondary' : 'outline'}>
            {value ? 'Yes' : 'No'}
        </Badge>
    );
}
