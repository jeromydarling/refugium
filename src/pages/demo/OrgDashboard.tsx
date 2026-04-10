import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { RecoverySignalCard } from '@/components/nri/RecoverySignalCard';
import {
  households,
  getNeedsForHousehold,
  volunteers,
  getJourneyForHousehold,
  getSystemSignals,
} from '@/data';
import type { Household } from '@/data';
import {
  Home,
  AlertCircle,
  UserCheck,
  Clock,
  Radio,
  Activity,
  ArrowRight,
  Users,
} from 'lucide-react';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

const STATUS_COLORS: Record<string, { bg: string; bar: string; label: string }> = {
  acute: { bg: 'bg-red-50', bar: 'bg-red-400', label: 'Acute' },
  stabilizing: { bg: 'bg-amber-50', bar: 'bg-amber-400', label: 'Stabilizing' },
  rebuilding: { bg: 'bg-sky-50', bar: 'bg-sky-400', label: 'Rebuilding' },
  recovered: { bg: 'bg-emerald-50', bar: 'bg-emerald-400', label: 'Recovered' },
};

const RECENT_ACTIVITY = [
  { time: '2 hours ago', text: 'Sarah Thompson logged a visit with the Martinez family' },
  { time: '4 hours ago', text: 'Habitat for Humanity accepted roof repair referral for Broussard' },
  { time: 'Yesterday', text: 'New refuge opened for incoming family (Robinson)' },
  { time: 'Yesterday', text: 'Guidry family marked as Restored \u2014 Paul helping other fishermen' },
  { time: '2 days ago', text: 'NRI flagged 3 stalled refuges needing attention' },
];

function computeKPIs() {
  const totalRefuges = households.length;

  let activeNeeds = 0;
  for (const hh of households) {
    const needs = getNeedsForHousehold(hh.id);
    activeNeeds += needs.filter((n) => n.status !== 'met').length;
  }

  const volunteersActive = volunteers.filter((v) => v.status === 'active').length;

  // Avg days to stabilize: average days from intake to stabilization for completed stabilization stages
  const stabilizationDays: number[] = [];
  for (const hh of households) {
    const journey = getJourneyForHousehold(hh.id);
    if (!journey) continue;
    const intakeStage = journey.stages.find((s) => s.stage === 'intake' && s.date);
    const stabilizationStage = journey.stages.find(
      (s) => s.stage === 'stabilization' && s.status === 'completed' && s.date
    );
    if (intakeStage?.date && stabilizationStage?.date) {
      const days = Math.floor(
        (new Date(stabilizationStage.date).getTime() - new Date(intakeStage.date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      stabilizationDays.push(days);
    }
  }
  const avgDaysToStabilize =
    stabilizationDays.length > 0
      ? Math.round(stabilizationDays.reduce((a, b) => a + b, 0) / stabilizationDays.length)
      : 0;

  const nriAlerts = getSystemSignals().length;

  return { totalRefuges, activeNeeds, volunteersActive, avgDaysToStabilize, nriAlerts };
}

function computeStatusBreakdown() {
  const counts: Record<string, number> = { acute: 0, stabilizing: 0, rebuilding: 0, recovered: 0 };
  for (const hh of households) {
    counts[hh.currentStatus] = (counts[hh.currentStatus] || 0) + 1;
  }
  const total = households.length;
  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    ...STATUS_COLORS[status],
  }));
}

function getMostUrgentHouseholds(): { hh: Household; unmetCount: number }[] {
  return households
    .map((hh) => {
      const needs = getNeedsForHousehold(hh.id);
      const unmetCount = needs.filter((n) => n.status !== 'met').length;
      return { hh, unmetCount };
    })
    .filter((x) => x.unmetCount > 0)
    .sort((a, b) => b.unmetCount - a.unmetCount)
    .slice(0, 3);
}

const STATUS_BORDER: Record<string, string> = {
  acute: 'border-l-red-400',
  stabilizing: 'border-l-amber-400',
  rebuilding: 'border-l-sky-400',
  recovered: 'border-l-emerald-400',
};

export default function OrgDashboard() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const kpis = useMemo(() => computeKPIs(), []);
  const statusBreakdown = useMemo(() => computeStatusBreakdown(), []);
  const urgentHouseholds = useMemo(() => getMostUrgentHouseholds(), []);
  const systemSignals = useMemo(() => getSystemSignals(), []);
  const totalVolunteerHours = useMemo(
    () => volunteers.filter((v) => v.status === 'active').reduce((sum, v) => sum + v.totalHours, 0),
    []
  );

  const KPI_CARDS = [
    {
      label: 'Total Refuges',
      value: kpis.totalRefuges,
      icon: Home,
      color: 'text-primary',
    },
    {
      label: 'Active Needs',
      value: kpis.activeNeeds,
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      label: 'Volunteers Active',
      value: kpis.volunteersActive,
      icon: UserCheck,
      color: 'text-emerald-600',
    },
    {
      label: 'Avg Days to Stabilize',
      value: kpis.avgDaysToStabilize,
      icon: Clock,
      color: 'text-amber-600',
    },
    {
      label: 'NRI Alerts',
      value: kpis.nriAlerts,
      icon: Radio,
      color: 'text-violet-500',
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Coordinator overview across all refuges
          </p>
        </div>
      </AnimatedSection>

      {/* KPI Row */}
      <AnimatedSection delay={0.1}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 ${
            isDesktop ? 'grid-cols-5' : 'grid-cols-2'
          }`}
        >
          {KPI_CARDS.map((kpi) => (
            <motion.div key={kpi.label} variants={staggerItem}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Second Row: Coverage + This Week */}
      <div className={`grid gap-6 ${isDesktop ? 'grid-cols-5' : 'grid-cols-1'}`}>
        {/* Left: Coverage (60% on desktop = 3/5) */}
        <AnimatedSection className={isDesktop ? 'col-span-3' : ''} delay={0.2}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Status breakdown */}
              <div className="space-y-3">
                {statusBreakdown.map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Most urgent households */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  Most Urgent Refuges
                </h3>
                <div className="space-y-2">
                  {urgentHouseholds.map(({ hh, unmetCount }) => (
                    <motion.div key={hh.id} {...cardHover}>
                      <Card
                        className={`p-3 cursor-pointer hover:shadow-md transition-shadow border-l-[3px] ${STATUS_BORDER[hh.currentStatus] || ''}`}
                        onClick={() => navigate(`/demo/app/people/${hh.id}`)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {hh.familyName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {hh.headOfHousehold}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="destructive" className="text-xs">
                              {unmetCount} needs
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Right: This Week (40% on desktop = 2/5) */}
        <AnimatedSection className={isDesktop ? 'col-span-2' : ''} delay={0.3}>
          <div className="space-y-4">
            {/* Volunteer Hours */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Volunteer Hours (total logged)</p>
                    <p className="text-2xl font-bold text-foreground">{totalVolunteerHours}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {kpis.volunteersActive} active
                  </Badge>
                </div>

                <Separator />

                {/* NRI System Signals */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Radio className="h-4 w-4 text-violet-500" />
                    NRI System Signals
                  </h3>
                  <div className="space-y-2">
                    {systemSignals.map((signal) => (
                      <RecoverySignalCard key={signal.id} signal={signal} />
                    ))}
                    {systemSignals.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No system-level signals
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Recent Activity */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Recent Activity
                  </h3>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {RECENT_ACTIVITY.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={staggerItem}
                        className="flex gap-3 text-sm"
                      >
                        <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[80px]">
                          {item.time}
                        </span>
                        <p className="text-foreground text-xs">{item.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
