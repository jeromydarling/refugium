import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard, LayoutGrid, Users, Shield, ArrowUpDown, Calendar,
  LogOut, FileText, ClipboardList, Footprints, Anchor, Kanban,
  BookOpen, Settings, MapPin, Network, Package, FolderKanban,
  Compass,
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: { path: string; label: string; icon: typeof LayoutDashboard; badge?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Command',
    items: [
      { path: '/demo/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/demo/app/board', label: 'Board', icon: LayoutGrid },
      { path: '/demo/app/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'Navigator',
    items: [
      { path: '/demo/app/people', label: 'People', icon: Users },
      { path: '/demo/app/refuge', label: 'Refuge', icon: Shield },
      { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
      { path: '/demo/app/calendar', label: 'Calendar', icon: Calendar },
      { path: '/demo/app/visits', label: 'Visits', icon: Footprints },
      { path: '/demo/app/activities', label: 'Activities', icon: ClipboardList },
    ],
  },
  {
    label: 'Network',
    items: [
      { path: '/demo/app/anchors', label: 'Anchors', icon: Anchor },
      { path: '/demo/app/pipeline', label: 'Pipeline', icon: Kanban },
      { path: '/demo/app/graph', label: 'Connections', icon: Network },
      { path: '/demo/app/zones', label: 'Zones', icon: MapPin },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/demo/app/projects', label: 'Projects', icon: FolderKanban },
      { path: '/demo/app/provisions', label: 'Provisions', icon: Package },
      { path: '/demo/app/playbooks', label: 'Playbooks', icon: BookOpen },
    ],
  },
];

const BOTTOM_ITEMS = [
  { path: '/demo/app/journal', label: 'Journal', icon: Compass },
  { path: '/demo/app/settings', label: 'Settings', icon: Settings },
];

export function DemoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { demoSession, endDemo } = useDemoMode();

  const handleExit = () => {
    endDemo();
    navigate('/');
  };

  const renderNavItem = (item: { path: string; label: string; icon: typeof LayoutDashboard; badge?: string }) => {
    const isActive = location.pathname === item.path ||
      (item.path !== '/demo/app/people' && location.pathname.startsWith(item.path)) ||
      (item.path === '/demo/app/people' && location.pathname.startsWith('/demo/app/people'));
    return (
      <Link
        key={item.path}
        to={item.path}
        className="relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="absolute inset-0 bg-[hsl(var(--sidebar-accent))] rounded-lg"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <item.icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : 'opacity-70'}`} />
        <span className={`relative z-10 text-[13px] ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : 'opacity-80'}`}>
          {item.label}
        </span>
        {item.badge && (
          <span className="relative z-10 ml-auto text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-60 z-50 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4">
        <h1 className="font-serif text-lg font-bold text-[hsl(var(--sidebar-primary))]">
          Refugium
        </h1>
        <p className="text-[10px] text-[hsl(var(--sidebar-foreground))]/50 mt-0.5">Disaster Navigator</p>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="px-3 pb-3 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/40">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom: journal, settings, session */}
      <div className="border-t px-3 py-2 space-y-0.5">
        {BOTTOM_ITEMS.map(renderNavItem)}
      </div>

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
