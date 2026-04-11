import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { DemoSidebar } from '@/components/demo/DemoSidebar';
import { NewCaseWizard } from '@/components/demo/NewCaseWizard';
import { NriCompass } from '@/components/demo/NriCompass';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Users, Shield, ArrowUpDown, Search, Plus, LayoutDashboard, LayoutGrid, Calendar } from 'lucide-react';
import { AngelWing } from '@/components/shared/AngelWing';
import { buttonTap } from '@/lib/animations';

const TABS = [
  { path: '/demo/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/demo/app/board', label: 'Board', icon: LayoutGrid },
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
        aria-label="Open Refuge"
      >
        <Plus className={isDesktop ? 'h-5 w-5' : 'h-6 w-6'} />
        {isDesktop && 'Open Refuge'}
      </motion.button>
      <NewCaseWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );

  // Derive page title from current path
  const pageTitle = (() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/board')) return 'Board';
    if (path.includes('/people/')) return 'Household';
    if (path.includes('/people')) return 'People';
    if (path.includes('/refuge')) return 'Refuge';
    if (path.includes('/flow')) return 'Flow';
    if (path.includes('/calendar')) return 'Calendar';
    return 'Refugium';
  })();

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background flex">
        <DemoSidebar />
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
          <DemoBanner />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
        {fab}
        <NriCompass />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DemoBanner />
      <header className="sticky top-0 z-40 bg-background border-b px-4 py-2.5 flex items-center justify-between">
        <h1 className="flex items-center gap-1.5 font-serif text-lg font-bold text-primary">
          <AngelWing size={20} className="text-primary" />
          Refugium
        </h1>
        <span className="text-sm font-medium text-muted-foreground">{pageTitle}</span>
      </header>
      <main className="flex-1 pb-20 overflow-auto">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex justify-around items-end">
          {TABS.map((tab, i) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <React.Fragment key={tab.path}>
                {/* Spacer for compass button between tab 2 and 3 */}
                {i === 2 && <div className="w-16 shrink-0" />}
                <Link
                  to={tab.path}
                  className={`flex flex-col items-center gap-0.5 py-2.5 px-2 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  {tab.label}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </nav>
      {fab}
      <NriCompass />
    </div>
  );
}
