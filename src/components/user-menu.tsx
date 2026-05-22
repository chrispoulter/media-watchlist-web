import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSignOut } from '@/features/auth/auth-queries';
import { authClient } from '@/lib/auth-client';

export function UserMenu() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const { mutateAsync: signOut, isPending } = useSignOut();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    if (!session) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {session?.user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                    <p className="truncate text-sm font-medium">
                        {session?.user?.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {session?.user?.email}
                    </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
                    {isPending ? 'Signing Out...' : 'Sign Out'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
