import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { households } from '@/data';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { staggerContainer, staggerItem } from '@/lib/animations';
import {
  Calendar,
  Clock,
  MapPin,
  ClipboardCheck,
  CheckCircle2,
  FileText,
  Phone,
} from 'lucide-react';

interface ScheduledVisit {
  id: string;
  time: string;
  householdId: string;
  familyName: string;
  headOfHousehold: string;
  address: string;
  purpose: 'Follow-up' | 'Assessment' | 'Home Visit' | 'Intake';
  status: 'scheduled' | 'in_progress' | 'completed';
  lastContact: string;
}

interface PastVisit {
  id: string;
  date: string;
  familyName: string;
  purpose: string;
  notes: string;
  navigator: string;
}

export default function VisitsPage() {
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  const todaysVisits = useMemo<ScheduledVisit[]>(() => {
    const martinez = households.find((h) => h.id === 'hh-001')!;
    const nguyen = households.find((h) => h.id === 'hh-005')!;
    const williams = households.find((h) => h.id === 'hh-004')!;
    const robinson = households.find((h) => h.id === 'hh-014')!;

    return [
      {
        id: 'sv-001',
        time: '9:00 AM',
        householdId: martinez.id,
        familyName: martinez.familyName,
        headOfHousehold: martinez.headOfHousehold,
        address: martinez.address,
        purpose: 'Follow-up',
        status: 'scheduled',
        lastContact: martinez.lastContact,
      },
      {
        id: 'sv-002',
        time: '11:30 AM',
        householdId: williams.id,
        familyName: williams.familyName,
        headOfHousehold: williams.headOfHousehold,
        address: williams.address,
        purpose: 'Assessment',
        status: 'scheduled',
        lastContact: williams.lastContact,
      },
      {
        id: 'sv-003',
        time: '2:00 PM',
        householdId: nguyen.id,
        familyName: nguyen.familyName,
        headOfHousehold: nguyen.headOfHousehold,
        address: nguyen.address,
        purpose: 'Home Visit',
        status: 'scheduled',
        lastContact: nguyen.lastContact,
      },
      {
        id: 'sv-004',
        time: '4:00 PM',
        householdId: robinson.id,
        familyName: robinson.familyName,
        headOfHousehold: robinson.headOfHousehold,
        address: robinson.address,
        purpose: 'Follow-up',
        status: 'scheduled',
        lastContact: robinson.lastContact,
      },
    ];
  }, []);

  const pastVisits = useMemo<PastVisit[]>(
    () => [
      {
        id: 'pv-001',
        date: 'April 9, 2026',
        familyName: 'Garcia',
        purpose: 'Follow-up',
        notes:
          'Rosa is doing well at the new apartment. Kids are thriving in school. Still needs a kitchen table and bookshelf. Connected with St. Vincent de Paul for furniture delivery next week.',
        navigator: 'Maria Santos',
      },
      {
        id: 'pv-002',
        date: 'April 8, 2026',
        familyName: 'Davis',
        purpose: 'Assessment',
        notes:
          'Checked in on Michael. He started a part-time tutoring role at the library which seems to be helping his confidence. Angela appreciates the regular counseling sessions. FEMA trailer showing wear.',
        navigator: 'Sarah Thompson',
      },
      {
        id: 'pv-003',
        date: 'April 7, 2026',
        familyName: 'Washington',
        purpose: 'Home Visit',
        notes:
          'James in better spirits. Generator running well. Agreed to let the Habitat crew assess roof for permanent repair. Still says others need it more, but let me schedule the assessment.',
        navigator: 'David Park',
      },
    ],
    []
  );

  const PURPOSE_COLORS: Record<string, string> = {
    'Follow-up': 'bg-blue-100 text-blue-800',
    Assessment: 'bg-amber-100 text-amber-800',
    'Home Visit': 'bg-green-100 text-green-800',
    Intake: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Today's Visits</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              April 10, 2026 — {todaysVisits.length} visits scheduled
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Today's visits */}
      <AnimatedSection delay={0.1}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {todaysVisits.map((visit) => (
            <motion.div key={visit.id} variants={staggerItem}>
              <Card className="p-4">
                <div
                  className={`flex flex-col ${isDesktop ? 'sm:flex-row sm:items-center' : ''} gap-4`}
                >
                  {/* Time */}
                  <div className="flex items-center gap-2 shrink-0 min-w-[90px]">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{visit.time}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">
                        {visit.familyName} Family
                      </p>
                      <Badge className={`text-xs ${PURPOSE_COLORS[visit.purpose]}`} variant="secondary">
                        {visit.purpose}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visit.headOfHousehold}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {visit.address}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      Last contact: {visit.lastContact}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        simulateWrite(`Visit logged for ${visit.familyName} family`)
                      }
                    >
                      <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                      Log Visit
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Past visits */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Recent Completed Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StaggerList className="space-y-3">
              {pastVisits.map((visit) => (
                <Card key={visit.id} className="p-4 border border-border bg-muted/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">
                          {visit.familyName} Family
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {visit.purpose}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{visit.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Navigator: {visit.navigator}
                      </p>

                      <Separator className="my-2" />

                      <div className="flex items-start gap-1.5">
                        <FileText className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{visit.notes}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </StaggerList>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
