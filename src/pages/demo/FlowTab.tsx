import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VolunteerCard } from '@/components/flow/VolunteerCard';
import { TaskCard, type Task } from '@/components/flow/TaskCard';
import { RecoverySignalCard } from '@/components/nri/RecoverySignalCard';
import { WeeklyRhythm } from '@/components/demo/WeeklyRhythm';
import { volunteers, households, getSystemSignals } from '@/data';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { AlertTriangle, CalendarDays, Plus } from 'lucide-react';
import { StaggerList } from '@/components/shared/StaggerList';

const DEMO_TASKS: Task[] = [
  { id: 't-001', title: 'Follow up with Johnson family', priority: 'critical', householdName: 'Johnson', assignedTo: 'Unassigned', dueDate: 'Overdue' },
  { id: 't-002', title: 'Schedule home assessment for Chen household', priority: 'high', householdName: 'Chen', assignedTo: 'Maria Santos', dueDate: 'Oct 20' },
  { id: 't-003', title: 'Deliver furniture to Garcia apartment', priority: 'medium', householdName: 'Garcia', assignedTo: 'James Wilson', dueDate: 'Oct 18' },
  { id: 't-004', title: 'Transport Elena Reyes to pharmacy', priority: 'high', householdName: 'Martinez', assignedTo: 'Sarah Thompson', dueDate: 'Oct 15' },
  { id: 't-005', title: 'Connect Nguyen family with host family', priority: 'critical', householdName: 'Nguyen', assignedTo: 'David Park', dueDate: 'Oct 12' },
  { id: 't-006', title: 'Check on James Washington - weekly visit', priority: 'medium', householdName: 'Washington', assignedTo: 'Patricia Long', dueDate: 'Oct 16' },
  { id: 't-007', title: 'Review Lisa Brown intake - assign volunteer', priority: 'high', householdName: 'Brown', assignedTo: 'Unassigned', dueDate: 'Oct 14' },
];

/* ── Mock schedule assignments ─────────────────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

interface ScheduleCell {
  volunteerId: string;
  day: typeof DAYS[number];
  householdIds: string[];
}

// Pre-built schedule derived from volunteer availability & assignments
const MOCK_SCHEDULE: ScheduleCell[] = [
  // Sarah Thompson — Mon-Fri
  { volunteerId: 'v-001', day: 'Mon', householdIds: ['hh-001'] },
  { volunteerId: 'v-001', day: 'Tue', householdIds: [] },
  { volunteerId: 'v-001', day: 'Wed', householdIds: ['hh-004'] },
  { volunteerId: 'v-001', day: 'Thu', householdIds: ['hh-001'] },
  { volunteerId: 'v-001', day: 'Fri', householdIds: [] },
  // David Park — Weekdays
  { volunteerId: 'v-002', day: 'Mon', householdIds: ['hh-003'] },
  { volunteerId: 'v-002', day: 'Tue', householdIds: ['hh-005'] },
  { volunteerId: 'v-002', day: 'Wed', householdIds: [] },
  { volunteerId: 'v-002', day: 'Thu', householdIds: ['hh-012'] },
  { volunteerId: 'v-002', day: 'Fri', householdIds: ['hh-005'] },
  // Maria Santos — Tue-Sat
  { volunteerId: 'v-003', day: 'Tue', householdIds: ['hh-002'] },
  { volunteerId: 'v-003', day: 'Wed', householdIds: ['hh-006'] },
  { volunteerId: 'v-003', day: 'Thu', householdIds: [] },
  { volunteerId: 'v-003', day: 'Fri', householdIds: ['hh-011'] },
  { volunteerId: 'v-003', day: 'Sat', householdIds: ['hh-002'] },
  // James Wilson — Mon/Wed/Fri
  { volunteerId: 'v-004', day: 'Mon', householdIds: ['hh-006'] },
  { volunteerId: 'v-004', day: 'Wed', householdIds: ['hh-014'] },
  { volunteerId: 'v-004', day: 'Fri', householdIds: ['hh-007'] },
  // Angela Roberts — Mon-Fri
  { volunteerId: 'v-005', day: 'Mon', householdIds: ['hh-004'] },
  { volunteerId: 'v-005', day: 'Tue', householdIds: [] },
  { volunteerId: 'v-005', day: 'Wed', householdIds: ['hh-004'] },
  { volunteerId: 'v-005', day: 'Thu', householdIds: [] },
  { volunteerId: 'v-005', day: 'Fri', householdIds: ['hh-004'] },
  // Marcus Brown — Weekends
  { volunteerId: 'v-006', day: 'Sat', householdIds: ['hh-008'] },
  { volunteerId: 'v-006', day: 'Sun', householdIds: [] },
  // Patricia Long — Tue/Thu
  { volunteerId: 'v-007', day: 'Tue', householdIds: ['hh-010'] },
  { volunteerId: 'v-007', day: 'Thu', householdIds: ['hh-010'] },
  // Robert Kim — Mon/Wed/Fri
  { volunteerId: 'v-008', day: 'Mon', householdIds: ['hh-011'] },
  { volunteerId: 'v-008', day: 'Wed', householdIds: ['hh-013'] },
  { volunteerId: 'v-008', day: 'Fri', householdIds: [] },
];

function getHouseholdName(id: string): string {
  return households.find(h => h.id === id)?.familyName ?? id;
}

/* ── Schedule Grid Component ───────────────────────────── */
function ScheduleGrid() {
  const { simulateWrite } = useDemoMode();
  const activeVolunteers = volunteers.filter(v => v.status === 'active');

  const scheduleMap = useMemo(() => {
    const map = new Map<string, Map<string, string[]>>();
    for (const cell of MOCK_SCHEDULE) {
      if (!map.has(cell.volunteerId)) map.set(cell.volunteerId, new Map());
      map.get(cell.volunteerId)!.set(cell.day, cell.householdIds);
    }
    return map;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Weekly Schedule</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary/15 border border-primary/30" />
            Assigned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-muted border border-border" />
            Available
          </span>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2.5 font-semibold text-muted-foreground min-w-[120px]">Volunteer</th>
              {DAYS.map(d => (
                <th key={d} className="text-center p-2.5 font-semibold text-muted-foreground w-[100px]">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeVolunteers.map(vol => {
              const volSchedule = scheduleMap.get(vol.id);
              return (
                <tr key={vol.id} className="border-b border-border/50 last:border-0">
                  <td className="p-2.5">
                    <div className="font-medium text-foreground">{vol.name.split(' ')[0]}</div>
                    <div className="text-muted-foreground text-[10px]">{vol.zone.replace('Zone ', 'Z')}</div>
                  </td>
                  {DAYS.map(day => {
                    const cellData = volSchedule?.get(day);
                    const hasAssignment = cellData && cellData.length > 0;
                    const isAvailable = cellData !== undefined;

                    if (!isAvailable) {
                      return (
                        <td key={day} className="p-1.5 text-center">
                          <div className="rounded bg-muted/30 p-1.5 h-[42px] flex items-center justify-center text-muted-foreground/40">
                            --
                          </div>
                        </td>
                      );
                    }

                    if (hasAssignment) {
                      return (
                        <td key={day} className="p-1.5 text-center">
                          <div className="rounded bg-primary/10 border border-primary/20 p-1.5 h-[42px] flex flex-col items-center justify-center gap-0.5">
                            {cellData.map(hid => (
                              <Badge key={hid} variant="secondary" className="text-[9px] px-1 py-0 bg-primary/15 text-primary">
                                {getHouseholdName(hid)}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      );
                    }

                    // Available but no assignment
                    return (
                      <td key={day} className="p-1.5 text-center">
                        <button
                          onClick={() => simulateWrite(`Shift requested: ${vol.name} on ${day}`)}
                          className="rounded border border-dashed border-border bg-muted/40 p-1.5 h-[42px] w-full flex items-center justify-center hover:bg-muted/70 hover:border-primary/40 transition-colors cursor-pointer group"
                        >
                          <Plus className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function FlowTab() {
  const systemSignals = getSystemSignals();
  const activeVolunteers = volunteers.filter(v => v.status === 'active');
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  const nriAlerts = systemSignals.length > 0 ? (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <AlertTriangle className="h-4 w-4 text-accent animate-pulse" />
        NRI Alerts
      </div>
      {systemSignals.map(s => <RecoverySignalCard key={s.id} signal={s} />)}
    </div>
  ) : null;

  // ── Desktop: rhythm + 3-tab layout (Tasks, Volunteers, Schedule) ──
  if (isDesktop) {
    return (
      <div className="p-6 space-y-6">
        {/* Weekly Rhythm - full width */}
        <WeeklyRhythm />

        {/* NRI alerts full-width */}
        {nriAlerts}

        <Tabs defaultValue="tasks-volunteers">
          <TabsList className="mb-4">
            <TabsTrigger value="tasks-volunteers">Tasks &amp; Volunteers</TabsTrigger>
            <TabsTrigger value="schedule">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks-volunteers">
            {/* Two-column grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Tasks ({DEMO_TASKS.length})
                </h2>
                <StaggerList className="space-y-3">
                  {DEMO_TASKS.map(t => <TaskCard key={t.id} task={t} />)}
                </StaggerList>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Volunteers ({activeVolunteers.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeVolunteers.length} active &middot; {volunteers.filter(v => v.status === 'on_break').length} on break &middot; {volunteers.filter(v => v.status === 'new').length} new
                </p>
                <StaggerList className="space-y-3">
                  {volunteers.map(v => <VolunteerCard key={v.id} volunteer={v} />)}
                </StaggerList>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleGrid />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ── Mobile: rhythm at top, then tabbed layout (2 tabs + schedule button) ──
  return (
    <div className="p-4 space-y-4">
      {/* Weekly Rhythm */}
      <WeeklyRhythm />

      {/* NRI System Alert */}
      {nriAlerts}

      <Tabs defaultValue="tasks">
        <div className="flex items-center gap-2 mb-4">
          <TabsList className="grid flex-1 grid-cols-2">
            <TabsTrigger value="tasks">Tasks ({DEMO_TASKS.length})</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers ({activeVolunteers.length})</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value="schedule" className="gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tasks">
          <StaggerList className="space-y-3">
            {DEMO_TASKS.map(t => <TaskCard key={t.id} task={t} />)}
          </StaggerList>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {activeVolunteers.length} active &middot; {volunteers.filter(v => v.status === 'on_break').length} on break &middot; {volunteers.filter(v => v.status === 'new').length} new
          </p>
          <StaggerList className="space-y-3">
            {volunteers.map(v => <VolunteerCard key={v.id} volunteer={v} />)}
          </StaggerList>
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
}
