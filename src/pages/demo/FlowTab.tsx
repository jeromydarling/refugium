import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VolunteerCard } from '@/components/flow/VolunteerCard';
import { TaskCard, type Task } from '@/components/flow/TaskCard';
import { RecoverySignalCard } from '@/components/nri/RecoverySignalCard';
import { volunteers, getSystemSignals } from '@/data';
import { AlertTriangle } from 'lucide-react';

const DEMO_TASKS: Task[] = [
  { id: 't-001', title: 'Follow up with Johnson family', priority: 'critical', householdName: 'Johnson', assignedTo: 'Unassigned', dueDate: 'Overdue' },
  { id: 't-002', title: 'Schedule home assessment for Chen household', priority: 'high', householdName: 'Chen', assignedTo: 'Maria Santos', dueDate: 'Oct 20' },
  { id: 't-003', title: 'Deliver furniture to Garcia apartment', priority: 'medium', householdName: 'Garcia', assignedTo: 'James Wilson', dueDate: 'Oct 18' },
  { id: 't-004', title: 'Transport Elena Reyes to pharmacy', priority: 'high', householdName: 'Martinez', assignedTo: 'Sarah Thompson', dueDate: 'Oct 15' },
  { id: 't-005', title: 'Connect Nguyen family with host family', priority: 'critical', householdName: 'Nguyen', assignedTo: 'David Park', dueDate: 'Oct 12' },
  { id: 't-006', title: 'Check on James Washington - weekly visit', priority: 'medium', householdName: 'Washington', assignedTo: 'Patricia Long', dueDate: 'Oct 16' },
  { id: 't-007', title: 'Review Lisa Brown intake - assign volunteer', priority: 'high', householdName: 'Brown', assignedTo: 'Unassigned', dueDate: 'Oct 14' },
];

export default function FlowTab() {
  const systemSignals = getSystemSignals();
  const activeVolunteers = volunteers.filter(v => v.status === 'active');

  return (
    <div className="p-4">
      {/* NRI System Alert */}
      {systemSignals.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" />
            NRI Alerts
          </div>
          {systemSignals.map(s => <RecoverySignalCard key={s.id} signal={s} />)}
        </div>
      )}

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="tasks">Tasks ({DEMO_TASKS.length})</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers ({activeVolunteers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3">
          {DEMO_TASKS.map(t => <TaskCard key={t.id} task={t} />)}
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {activeVolunteers.length} active &middot; {volunteers.filter(v => v.status === 'on_break').length} on break &middot; {volunteers.filter(v => v.status === 'new').length} new
          </p>
          {volunteers.map(v => <VolunteerCard key={v.id} volunteer={v} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
