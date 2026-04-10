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
    <div className="bg-primary text-primary-foreground px-4 py-1.5 flex items-center justify-between gap-3 text-xs shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <Eye className="h-3 w-3 shrink-0 opacity-80" />
        <span className="font-medium truncate">
          Demo &mdash; {demoSession.organization || 'Refugium'}
        </span>
        <Badge variant="secondary" className="text-[10px] shrink-0">
          Read-only
        </Badge>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleExit}
        className="h-6 text-primary-foreground hover:bg-primary-foreground/20 text-[10px] gap-1 px-2"
      >
        <LogOut className="h-3 w-3" />
        Exit
      </Button>
    </div>
  );
}
