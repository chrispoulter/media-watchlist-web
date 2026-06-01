import { NavLink } from 'react-router';
import { ListVideo, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const navItems = [
    { to: '/', label: 'Watchlist', icon: ListVideo },
    { to: '/search', label: 'Search', icon: Search },
];

export function MainMenu() {
    const { data: session } = authClient.useSession();

    if (!session) {
        return null;
    }

    return (
        <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
                <Button
                    key={to}
                    variant="ghost"
                    asChild
                    className="aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground"
                >
                    <NavLink to={to}>
                        <Icon className="sm:hidden" />
                        <span className="sr-only sm:not-sr-only">{label}</span>
                    </NavLink>
                </Button>
            ))}
        </nav>
    );
}
