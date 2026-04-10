import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { staggerContainer, staggerItem } from '@/lib/animations';
import {
  ClipboardCheck,
  Phone,
  ArrowRightLeft,
  StickyNote,
  RefreshCw,
  UserPlus,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ActivityType =
  | 'visit_logged'
  | 'call_made'
  | 'referral_sent'
  | 'note_added'
  | 'need_updated'
  | 'volunteer_assigned';

interface ActivityEntry {
  id: string;
  type: ActivityType;
  timestamp: string;
  description: string;
  household: string;
  householdId: string;
}

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: LucideIcon; color: string; dotColor: string; label: string }
> = {
  visit_logged: {
    icon: ClipboardCheck,
    color: 'text-sky-700',
    dotColor: 'bg-sky-400',
    label: 'Visit',
  },
  call_made: {
    icon: Phone,
    color: 'text-emerald-700',
    dotColor: 'bg-emerald-400',
    label: 'Call',
  },
  referral_sent: {
    icon: ArrowRightLeft,
    color: 'text-violet-700',
    dotColor: 'bg-violet-400',
    label: 'Referral',
  },
  note_added: {
    icon: StickyNote,
    color: 'text-amber-700',
    dotColor: 'bg-amber-400',
    label: 'Note',
  },
  need_updated: {
    icon: RefreshCw,
    color: 'text-slate-600',
    dotColor: 'bg-slate-400',
    label: 'Need Updated',
  },
  volunteer_assigned: {
    icon: UserPlus,
    color: 'text-rose-700',
    dotColor: 'bg-rose-400',
    label: 'Volunteer',
  },
};

const MOCK_ACTIVITIES: ActivityEntry[] = [
  {
    id: 'act-001',
    type: 'visit_logged',
    timestamp: 'Today, 10:15 AM',
    description: 'Home visit with Maria. Elena\'s medication supply stabilized through St. Francis Pharmacy. Roof repair estimate received from Habitat.',
    household: 'Martinez',
    householdId: 'hh-001',
  },
  {
    id: 'act-002',
    type: 'call_made',
    timestamp: 'Today, 9:30 AM',
    description: 'Called Dorothy Williams to confirm roof assessment appointment with Samaritan\'s Purse for next Tuesday.',
    household: 'Williams',
    householdId: 'hh-004',
  },
  {
    id: 'act-003',
    type: 'referral_sent',
    timestamp: 'Today, 8:45 AM',
    description: 'Referred Robinson family to Gulf Coast Kidney Center for priority dialysis scheduling. Dr. Singh will call Keisha directly.',
    household: 'Robinson',
    householdId: 'hh-014',
  },
  {
    id: 'act-004',
    type: 'note_added',
    timestamp: 'Yesterday, 4:30 PM',
    description: 'Claire mentioned roof is leaking again in the kitchen. Mold may return if not addressed soon. Escalating to Habitat coordinator.',
    household: 'Broussard',
    householdId: 'hh-013',
  },
  {
    id: 'act-005',
    type: 'need_updated',
    timestamp: 'Yesterday, 3:00 PM',
    description: 'SNAP benefits application approved for Nguyen family. Updated food assistance need to "met." Mai relieved — one less thing to worry about.',
    household: 'Nguyen',
    householdId: 'hh-005',
  },
  {
    id: 'act-006',
    type: 'volunteer_assigned',
    timestamp: 'Yesterday, 11:00 AM',
    description: 'Assigned Carlos Rivera (new volunteer, carpentry skills) to assist with Johnson home mold remediation project.',
    household: 'Johnson',
    householdId: 'hh-003',
  },
  {
    id: 'act-007',
    type: 'visit_logged',
    timestamp: 'Apr 8, 2:15 PM',
    description: 'Visited Angela Davis. Michael started part-time tutoring at the library. Angela says the routine is helping him. FEMA trailer holding up okay.',
    household: 'Davis',
    householdId: 'hh-008',
  },
  {
    id: 'act-008',
    type: 'call_made',
    timestamp: 'Apr 8, 10:00 AM',
    description: 'Checked in with James Washington by text (hearing loss makes phone calls hard). He agreed to the Habitat roof assessment. Small victory.',
    household: 'Washington',
    householdId: 'hh-010',
  },
  {
    id: 'act-009',
    type: 'referral_sent',
    timestamp: 'Apr 7, 3:45 PM',
    description: 'Sent referral for Lisa Brown to Workforce Commission for job placement. Specifically requested flexible-hour positions compatible with childcare.',
    household: 'Brown',
    householdId: 'hh-011',
  },
  {
    id: 'act-010',
    type: 'note_added',
    timestamp: 'Apr 7, 11:30 AM',
    description: 'Paul Guidry stopped by the office to drop off supplies for other families. Anne says the kids are doing great back in school. A recovery success story.',
    household: 'Guidry',
    householdId: 'hh-015',
  },
];

const TAB_FILTERS: { value: string; label: string; types?: ActivityType[] }[] = [
  { value: 'all', label: 'All' },
  { value: 'visits', label: 'Visits', types: ['visit_logged'] },
  { value: 'calls', label: 'Calls', types: ['call_made'] },
  { value: 'referrals', label: 'Referrals', types: ['referral_sent'] },
  { value: 'notes', label: 'Notes', types: ['note_added'] },
];

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredActivities = MOCK_ACTIVITIES.filter((a) => {
    if (activeTab === 'all') return true;
    const tab = TAB_FILTERS.find((t) => t.value === activeTab);
    return tab?.types?.includes(a.type) ?? true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Activity Log</h1>
          <p className="text-sm text-muted-foreground">
            Unified timeline of all navigator activities across families.
          </p>
        </div>
      </AnimatedSection>

      {/* Filter tabs */}
      <AnimatedSection delay={0.1}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {TAB_FILTERS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection delay={0.15}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={activeTab}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-1">
            {filteredActivities.map((activity) => {
              const config = ACTIVITY_CONFIG[activity.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  variants={staggerItem}
                  className="relative flex items-start gap-4 pl-0"
                >
                  {/* Dot on the timeline */}
                  <div className="relative z-10 flex items-center justify-center shrink-0">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center bg-background border-2 border-border`}
                    >
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                  </div>

                  {/* Content card */}
                  <Card className="flex-1 p-3 mb-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {activity.household}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1.5">{activity.description}</p>
                  </Card>
                </motion.div>
              );
            })}

            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No activities match the selected filter.
              </div>
            )}
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
}
