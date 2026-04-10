import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { DemoSidebar } from '@/components/demo/DemoSidebar';
import { NewCaseWizard } from '@/components/demo/NewCaseWizard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Users, Shield, ArrowUpDown, Search, Plus } from 'lucide-react';
import { buttonTap } from '@/lib/animations';

const TABS = [
  { path: '/demo/app/people', label: 'People', icon: Users },
  { path: '/demo/app/refuge', label: 'Refuge', icon: Shield },
  { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
];

export default function DemoApp() {
  const { isDemoMode } = useDemoMode();
  const location = useLocation();
  const isDesktop = useIsDesktop();
  const [wizardOpen, setWizardOpen] = useState(false);

  if (!isDemoMode) {
    return <Navigate to="/demo" replace />;
  }

  const fab = (
    <>
      <motion.button
        {...buttonTap}
        onClick={() => setWizardOpen(true)}
        className={`fixed z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow ${
          isDesktop
            ? 'bottom-8 right-8 px-5 py-3.5 text-sm font-medium'
            : 'bottom-24 right-4 p-4'
        }`}
        aria-label="New Case"
      >
        <Plus className={isDesktop ? 'h-5 w-5' : 'h-6 w-6'} />
        {isDesktop && 'New Case'}
      </motion.button>
      <NewCaseWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background flex">
        <DemoSidebar />
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
          <DemoBanner />
          <header className="sticky top-[40px] z-40 bg-background border-b px-6 py-3 flex items-center justify-end">
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
        {fab}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DemoBanner />
      <header className="sticky top-[40px] z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif text-lg font-bold text-primary">Refugium</h1>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
      </header>
      <main className="flex-1 pb-20 overflow-auto">
        <Outlet />
      </main>
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
      {fab}
    </div>
  );
}
