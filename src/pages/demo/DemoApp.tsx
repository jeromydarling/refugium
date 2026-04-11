import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { DemoSidebar } from '@/components/demo/DemoSidebar';
import { NewCaseWizard } from '@/components/demo/NewCaseWizard';
import { NriCompass } from '@/components/demo/NriCompass';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import {
  Users, Shield, ArrowUpDown, Plus, LayoutDashboard, LayoutGrid,
  Compass, Menu, X, Footprints, Package, Anchor, Sprout, Network,
  MapPin, Calendar, FileText, FolderKanban, BookOpen, ClipboardList,
  Settings, LogOut, ChevronDown,
} from 'lucide-react';
import { AngelWing } from '@/components/shared/AngelWing';
import { buttonTap } from '@/lib/animations';
import { ScrollArea } from '@/components/ui/scroll-area';

/* Bottom nav tabs — 4 items + compass in center */
const MOBILE_TABS = [
  { path: '/demo/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/demo/app/board', label: 'Board', icon: LayoutGrid },
  // compass goes here (index 2)
  { path: '/demo/app/people', label: 'People', icon: Users },
  { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
];

/* Full nav for hamburger menu */
const HAMBURGER_GROUPS = [
  {
    label: 'Journeys',
    items: [
      { path: '/demo/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/demo/app/board', label: 'Board', icon: LayoutGrid },
      { path: '/demo/app/people', label: 'People', icon: Users },
      { path: '/demo/app/visits', label: 'Visits', icon: Footprints },
      { path: '/demo/app/provisions', label: 'Provisions', icon: Package },
    ],
  },
  {
    label: 'Partners',
    items: [
      { path: '/demo/app/refuge', label: 'Refuge', icon: Shield },
      { path: '/demo/app/anchors', label: 'Anchors', icon: Anchor },
      { path: '/demo/app/pipeline', label: 'Cultivating', icon: Sprout },
      { path: '/demo/app/graph', label: 'Connections', icon: Network },
      { path: '/demo/app/zones', label: 'Zones', icon: MapPin },
    ],
  },
  {
    label: 'My Day',
    items: [
      { path: '/demo/app/calendar', label: 'Calendar', icon: Calendar },
      { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
      { path: '/demo/app/activities', label: 'Activities', icon: ClipboardList },
    ],
  },
  {
    label: 'Stewardship',
    items: [
      { path: '/demo/app/reports', label: 'Reports', icon: FileText },
      { path: '/demo/app/projects', label: 'Projects', icon: FolderKanban },
      { path: '/demo/app/playbooks', label: 'Playbooks', icon: BookOpen },
    ],
  },
];

export default function DemoApp() {
  const { isDemoMode, endDemo } = useDemoMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compassOpen, setCompassOpen] = useState(false);

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
      {/* Mobile header with hamburger */}
      <header className="sticky top-0 z-40 bg-background border-b px-4 py-2.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="flex items-center gap-1.5 font-serif text-lg font-bold text-primary">
            <AngelWing size={20} className="text-primary" />
            Refugium
          </h1>
        </div>
        <span className="text-sm font-medium text-muted-foreground">{pageTitle}</span>
      </header>

      <main className="flex-1 pb-20 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom nav — 4 tabs with compass in center */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex justify-around items-end">
          {/* First two tabs */}
          {MOBILE_TABS.slice(0, 2).map(tab => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-0.5 py-2.5 px-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                {tab.label}
              </Link>
            );
          })}

          {/* Center compass button */}
          <button
            onClick={() => setCompassOpen(true)}
            className="relative flex flex-col items-center gap-0.5 -mt-5 px-2"
            aria-label="Open NRI Compass"
          >
            <span className="w-12 h-12 rounded-full bg-[hsl(var(--ignatian-deep))] text-[hsl(var(--ignatian-cream))] shadow-lg flex items-center justify-center">
              <Compass className="h-6 w-6" />
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">Compass</span>
          </button>

          {/* Last two tabs */}
          {MOBILE_TABS.slice(2).map(tab => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-0.5 py-2.5 px-2 text-[10px] font-medium transition-colors ${
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

      {/* Hamburger slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-72 bg-background border-r shadow-xl flex flex-col"
            >
              {/* Menu header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="flex items-center gap-1.5 font-serif text-lg font-bold text-primary">
                  <AngelWing size={20} className="text-primary" />
                  Refugium
                </h2>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Menu nav groups */}
              <ScrollArea className="flex-1">
                <nav className="p-4 space-y-4">
                  {HAMBURGER_GROUPS.map(group => (
                    <div key={group.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map(item => {
                          const isActive = location.pathname === item.path ||
                            (item.path === '/demo/app/people' && location.pathname.startsWith('/demo/app/people'));
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground hover:bg-muted'
                              }`}
                            >
                              <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </ScrollArea>

              {/* Menu footer */}
              <div className="border-t p-4 space-y-1">
                <Link
                  to="/demo/app/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); endDemo(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Exit Demo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {fab}
      <NriCompass open={compassOpen} onOpenChange={setCompassOpen} hideTrigger />
    </div>
  );
}
