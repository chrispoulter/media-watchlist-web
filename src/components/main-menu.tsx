import { Link, NavLink } from 'react-router';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

const navItems = [
    { to: '/', label: 'Watchlist' },
    { to: '/search', label: 'Search' },
];

export function MainMenu() {
    const { data: session } = authClient.useSession();

    if (!session) {
        return null;
    }

    return (
        <>
            <nav className="hidden items-center gap-1 sm:flex">
                {navItems.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-secondary text-secondary-foreground'
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            )
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="sm:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {navItems.map(({ to, label }) => (
                        <DropdownMenuItem key={to} asChild>
                            <Link to={to}>{label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
