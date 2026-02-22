import { Link, useLocation } from '@tanstack/react-router';
import { Building2, FolderKanban, CheckSquare, Users } from 'lucide-react';
import LoginButton from './LoginButton';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/team', label: 'Team', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/properties" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Building2 className="h-6 w-6" />
              <span>PropDev Manager</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
