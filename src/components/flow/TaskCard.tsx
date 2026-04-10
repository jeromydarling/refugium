import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-slate-100 text-slate-800',
};

export interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  householdName: string;
  assignedTo: string;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { simulateWrite } = useDemoMode();

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{task.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {task.householdName} &middot; Assigned to {task.assignedTo}
          </p>
        </div>
        <Badge variant="secondary" className={`text-xs shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => simulateWrite('Task completed')}
        >
          <Check className="h-3 w-3" />
          Complete
        </Button>
      </div>
    </Card>
  );
}
