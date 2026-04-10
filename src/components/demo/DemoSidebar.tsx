import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { Users, Shield, ArrowUpDown, LogOut, LayoutDashboard, LayoutGrid } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ORG_ITEMS = [
  { path: '/demo/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/demo/app/board', label: 'Board', icon: LayoutGrid },
];

const NAV_ITEMS = [
  { path: '/demo/app/people', label: 'People', icon: Users },
  { path: '/demo/app/refuge', label: 'Refuge', icon: Shield },
  { path: '/demo/app/flow', label: 'Flow', icon: ArrowUpDown },
];

export function DemoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { demoSession, endDemo } = useDemoMode();

  const handleExit = () => {
    endDemo();
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-60 z-50 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5">
        <h1 className="font-serif text-lg font-bold text-[hsl(var(--sidebar-primary))]">
          Refugium
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {ORG_ITEMS.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 bg-[hsl(var(--sidebar-accent))] rounded-lg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className={`h-5 w-5 relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : ''}`} />
              <span className={`relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/40">
            Navigator
          </p>
        </div>

        {NAV_ITEMS.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 bg-[hsl(var(--sidebar-accent))] rounded-lg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className={`h-5 w-5 relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : ''}`} />
              <span className={`relative z-10 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: session info + exit */}
      <div className="border-t px-4 py-4 space-y-3">
        {demoSession && (
          <div className="text-xs space-y-0.5">
            <p className="font-medium truncate">{demoSession.name}</p>
            <p className="text-[hsl(var(--sidebar-foreground))]/60 truncate">
              {demoSession.organization}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExit}
          className="w-full justify-start gap-2 text-xs text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))]"
        >
          <LogOut className="h-4 w-4" />
          Exit Demo
        </Button>
      </div>
    </div>
  );
}
