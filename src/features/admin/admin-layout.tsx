import { Outlet, Link, useLocation } from 'react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const navItems = [{ to: '/admin/users', label: 'Users' }];

export function AdminLayout() {
    const { pathname } = useLocation();

    const activeTab =
        navItems.find((t) => pathname.startsWith(t.to))?.to ?? navItems[0].to;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
                <p className="text-sm text-muted-foreground">
                    Manage user accounts
                </p>
            </div>

            <Tabs value={activeTab}>
                <TabsList variant="line">
                    {navItems.map((tab) => (
                        <TabsTrigger key={tab.to} value={tab.to} asChild>
                            <Link to={tab.to}>{tab.label}</Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <Outlet />
        </div>
    );
}
