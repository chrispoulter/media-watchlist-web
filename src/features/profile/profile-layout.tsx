import { Outlet, NavLink } from 'react-router';
import { cn } from '@/lib/utils';

const navItems = [
    { to: '/profile', label: 'Profile' },
    { to: '/profile/security', label: 'Security' },
    { to: '/profile/danger', label: 'Danger zone' },
];

export function ProfileLayout() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings
                </p>
            </div>

            <nav className="inline-flex gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            cn(
                                'relative inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all',
                                'hover:text-foreground focus-visible:outline-ring',
                                isActive
                                    ? 'text-foreground after:absolute after:inset-x-0 after:-bottom-1.25 after:h-0.5 after:bg-foreground'
                                    : 'text-foreground/60 dark:text-muted-foreground'
                            )
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <Outlet />
        </div>
    );
}
