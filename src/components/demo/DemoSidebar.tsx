import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard, LayoutGrid, Users, Shield, ArrowUpDown, Calendar,
  LogOut, FileText, ClipboardList, Footprints, Anchor, Sprout,
  BookOpen, Settings, MapPin, Network, Package, FolderKanban,
  Compass, ChevronDown,
} from 'lucide-react';
import { AngelWing } from '@/components/shared/AngelWing';

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  key: string;
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: 'journeys',
    label: 'Journeys',
    defaultOpen: true,
    items: [
      { path: '/demo/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/demo/app/board', label: 'Board', icon: LayoutGrid },
      { path: '/demo/app/people', label: 'People', icon: Users },
      { path: '/demo/app/visits', label: 'Visits', icon: Footprints },
      { path: '/demo/app/provisions', label: 'Provisions', icon: Package },
    ],
  },
  {
    key: 'partners',
    label: 'Partners',
    defaultOpen: true,
    items: [
      { path: '/demo/app/refuge', label: 'Refuge', icon: Shield },
      { path: '/demo/app/anchors', label: 'Anchors', icon: Anchor },
      { path: '/demo/app/pipeline', label: 'Cultivating', icon: Sprout },
      { path: '/demo/app/graph', label: 'Connections', icon: Network },
      { path: '/demo/app/zones', label: 'Zones', icon: MapPin },
    ],
  },
  {
    key: 'myday',
    label: 'My Day',
    defaultOpen: true,
    items: [
      { path: '/demo/app/calendar', label: 'Calendar', icon: Calendar },
      { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
      { path: '/demo/app/activities', label: 'Activities', icon: ClipboardList },
    ],
  },
  {
    key: 'stewardship',
    label: 'Stewardship',
    defaultOpen: false,
    items: [
      { path: '/demo/app/reports', label: 'Reports', icon: FileText },
      { path: '/demo/app/projects', label: 'Projects', icon: FolderKanban },
      { path: '/demo/app/playbooks', label: 'Playbooks', icon: BookOpen },
    ],
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  { path: '/demo/app/journal', label: 'Journal', icon: Compass },
  { path: '/demo/app/settings', label: 'Settings', icon: Settings },
];

export function DemoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { demoSession, endDemo } = useDemoMode();

  // Track which groups are open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV_GROUPS.forEach(g => {
      // Auto-open the group containing the current route
      const containsActive = g.items.some(item =>
        location.pathname === item.path ||
        (item.path === '/demo/app/people' && location.pathname.startsWith('/demo/app/people'))
      );
      initial[g.key] = containsActive || (g.defaultOpen ?? false);
    });
    return initial;
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExit = () => {
    endDemo();
    navigate('/');
  };

  const isItemActive = (path: string) => {
    if (path === '/demo/app/people') {
      return location.pathname.startsWith('/demo/app/people');
    }
    return location.pathname === path;
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = isItemActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        className="relative flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="absolute inset-0 bg-[hsl(var(--sidebar-accent))] rounded-lg"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <item.icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : 'opacity-60'}`} />
        <span className={`relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : 'opacity-75'}`}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-60 z-50 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4">
        <h1 className="flex items-center gap-1.5 font-serif text-lg font-bold text-[hsl(var(--sidebar-primary))]">
          <AngelWing size={20} className="text-[hsl(var(--sidebar-primary))]" />
          Refugium
        </h1>
        <p className="text-[10px] text-[hsl(var(--sidebar-foreground))]/50 mt-0.5">Disaster Navigator</p>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="px-3 pb-3 space-y-1">
          {NAV_GROUPS.map(group => {
            const isOpen = openGroups[group.key] ?? false;
            const hasActiveChild = group.items.some(item => isItemActive(item.path));

            return (
              <div key={group.key}>
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))]/50 transition-colors"
                >
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                    hasActiveChild ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-foreground))]/40'
                  }`}>
                    {group.label}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`h-3 w-3 ${
                      hasActiveChild ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-foreground))]/30'
                    }`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pb-1">
                        {group.items.map(renderNavItem)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom: journal, settings */}
      <div className="border-t px-3 py-2 space-y-0.5">
        {BOTTOM_ITEMS.map(renderNavItem)}
      </div>

      {/* Session info + exit */}
      <div className="border-t px-4 py-3 space-y-2">
        {demoSession && (
          <div className="text-xs space-y-0.5">
            <p className="font-medium truncate">{demoSession.name}</p>
            <p className="text-[hsl(var(--sidebar-foreground))]/50 truncate text-[10px]">
              {demoSession.organization}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExit}
          className="w-full justify-start gap-2 text-[10px] text-[hsl(var(--sidebar-foreground))]/60 hover:text-[hsl(var(--sidebar-foreground))] h-7"
        >
          <LogOut className="h-3.5 w-3.5" />
          Exit Demo
        </Button>
      </div>
    </div>
  );
}
