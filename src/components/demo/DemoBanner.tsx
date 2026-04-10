import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DemoBanner() {
  const { isDemoMode, demoSession, endDemo } = useDemoMode();
  const navigate = useNavigate();

  if (!isDemoMode || !demoSession) return null;

  const handleExit = () => {
    endDemo();
    navigate('/', { replace: true });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between gap-3 text-sm shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <Eye className="h-4 w-4 shrink-0 opacity-80" />
        <span className="font-medium truncate">
          Demo Mode &mdash; {demoSession.organization || 'Refugium'}
        </span>
        <Badge variant="secondary" className="text-xs shrink-0">
          Read-only
        </Badge>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleExit}
        className="h-7 text-primary-foreground hover:bg-primary-foreground/20 text-xs gap-1"
      >
        <LogOut className="h-3 w-3" />
        Exit
      </Button>
    </div>
  );
}
