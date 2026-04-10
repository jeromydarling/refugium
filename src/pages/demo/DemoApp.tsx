import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Users, Shield, ArrowUpDown, Search } from 'lucide-react';

const TABS = [
  { path: '/demo/app/people', label: 'People', icon: Users },
  { path: '/demo/app/refuge', label: 'Refuge', icon: Shield },
  { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
];

export default function DemoApp() {
  const { isDemoMode } = useDemoMode();
  const location = useLocation();

  if (!isDemoMode) {
    return <Navigate to="/demo" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Demo banner */}
      <DemoBanner />

      {/* Header */}
      <header className="sticky top-[40px] z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif text-lg font-bold text-primary">Refugium</h1>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex justify-around">
          {TABS.map(tab => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-1 py-3 px-6 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
