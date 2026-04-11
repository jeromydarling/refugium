import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { RecoverySignalCard } from '@/components/nri/RecoverySignalCard';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import {
  households,
  getNeedsForHousehold,
  volunteers,
  getJourneyForHousehold,
  getSystemSignals,
} from '@/data';
import type { Household } from '@/data';
import {
  AlertCircle,
  ArrowRight,
  Users,
  Activity,
  Radio,
  TrendingUp,
  TrendingDown,
  Clock,
  UserX,
  CalendarCheck,
} from 'lucide-react';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

/* ─── Status colors ──────────────────────────────────── */

const STATUS_COLORS: Record<string, { bg: string; bar: string; label: string; hex: string }> = {
  acute: { bg: 'bg-red-50', bar: 'bg-red-400', label: 'Acute', hex: '#f87171' },
  stabilizing: { bg: 'bg-amber-50', bar: 'bg-amber-400', label: 'Stabilizing', hex: '#fbbf24' },
  rebuilding: { bg: 'bg-sky-50', bar: 'bg-sky-400', label: 'Rebuilding', hex: '#38bdf8' },
  recovered: { bg: 'bg-emerald-50', bar: 'bg-emerald-400', label: 'Recovered', hex: '#34d399' },
};

const STATUS_BORDER: Record<string, string> = {
  acute: 'border-l-red-400',
  stabilizing: 'border-l-amber-400',
  rebuilding: 'border-l-sky-400',
  recovered: 'border-l-emerald-400',
};

const RECENT_ACTIVITY = [
  { time: '2 hours ago', text: 'Sarah Thompson logged a visit with the Martinez family' },
  { time: '4 hours ago', text: 'Habitat for Humanity accepted roof repair referral for Broussard' },
  { time: 'Yesterday', text: 'New refuge opened for incoming family (Robinson)' },
  { time: 'Yesterday', text: 'Guidry family marked as Restored \u2014 Paul helping other fishermen' },
  { time: '2 days ago', text: 'NRI flagged 3 stalled refuges needing attention' },
];

/* ─── Compute live data from mock ──────────────────── */

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

function getUrgentHouseholds(): { hh: Household; unmetCount: number }[] {
  return households
    .map((hh) => {
      const needs = getNeedsForHousehold(hh.id);
      const unmetCount = needs.filter((n) => n.status !== 'met').length;
      return { hh, unmetCount };
    })
    .filter((x) => x.unmetCount > 0)
    .sort((a, b) => b.unmetCount - a.unmetCount)
    .slice(0, 5);
}

function getStalledFamilies() {
  return households.filter(hh => {
    const days = Math.floor((Date.now() - new Date(hh.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return days > 14 && hh.currentStatus !== 'recovered';
  });
}

function getUnassigned() {
  return households.filter(hh => !hh.assignedVolunteerId && hh.currentStatus !== 'recovered');
}

function getUnmetByCategory() {
  const counts: Record<string, number> = {};
  for (const hh of households) {
    for (const need of getNeedsForHousehold(hh.id)) {
      if (need.status === 'unmet') {
        counts[need.category] = (counts[need.category] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([category, count]) => ({ category: category.replace(/_/g, ' '), count }))
    .sort((a, b) => b.count - a.count);
}

/* ─── Mock trend data (would come from Supabase in prod) ── */

const MONTHLY_RECOVERY_FLOW = [
  { month: 'Jun', acute: 12, stabilizing: 5, rebuilding: 2, recovered: 0 },
  { month: 'Jul', acute: 10, stabilizing: 8, rebuilding: 3, recovered: 1 },
  { month: 'Aug', acute: 8, stabilizing: 9, rebuilding: 5, recovered: 2 },
  { month: 'Sep', acute: 6, stabilizing: 8, rebuilding: 7, recovered: 3 },
  { month: 'Oct', acute: 5, stabilizing: 6, rebuilding: 8, recovered: 4 },
  { month: 'Nov', acute: 4, stabilizing: 5, rebuilding: 7, recovered: 5 },
  { month: 'Dec', acute: 3, stabilizing: 4, rebuilding: 6, recovered: 6 },
  { month: 'Jan', acute: 3, stabilizing: 4, rebuilding: 5, recovered: 7 },
  { month: 'Feb', acute: 3, stabilizing: 3, rebuilding: 4, recovered: 8 },
  { month: 'Mar', acute: 2, stabilizing: 3, rebuilding: 4, recovered: 9 },
];

const TAPER_OFF_DATA = [
  { mark: '1 mo', active: 19, dropped: 0 },
  { mark: '3 mo', active: 18, dropped: 1 },
  { mark: '6 mo', active: 16, dropped: 3 },
  { mark: '1 yr', active: 13, dropped: 6 },
  { mark: '2 yr', active: 9, dropped: 6 },
  { mark: '3 yr', active: 5, dropped: 4 },
];

const VOLUNTEER_TREND = [
  { month: 'Jun', hours: 120, families: 3.2 },
  { month: 'Jul', hours: 180, families: 2.8 },
  { month: 'Aug', hours: 210, families: 2.5 },
  { month: 'Sep', hours: 190, families: 2.4 },
  { month: 'Oct', hours: 220, families: 2.2 },
  { month: 'Nov', hours: 200, families: 2.0 },
  { month: 'Dec', hours: 160, families: 1.9 },
  { month: 'Jan', hours: 175, families: 1.9 },
  { month: 'Feb', hours: 185, families: 1.8 },
  { month: 'Mar', hours: 195, families: 1.8 },
];

const AVG_DAYS_BY_STAGE = [
  { stage: 'Intake → Assessment', days: 7, target: 5 },
  { stage: 'Assessment → Stabilization', days: 21, target: 14 },
  { stage: 'Stabilization → Rebuild', days: 45, target: 30 },
  { stage: 'Rebuild → Restored', days: 90, target: 60 },
];

/* ─── Component ─────────────────────────────────────── */

export default function OrgDashboard() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const statusBreakdown = useMemo(() => computeStatusBreakdown(), []);
  const urgentHouseholds = useMemo(() => getUrgentHouseholds(), []);
  const systemSignals = useMemo(() => getSystemSignals(), []);
  const stalledFamilies = useMemo(() => getStalledFamilies(), []);
  const unassigned = useMemo(() => getUnassigned(), []);
  const unmetByCategory = useMemo(() => getUnmetByCategory(), []);
  const totalVolunteerHours = useMemo(
    () => volunteers.filter(v => v.status === 'active').reduce((sum, v) => sum + v.totalHours, 0),
    []
  );
  const recoveryRate = useMemo(() => {
    const recovered = households.filter(h => h.currentStatus === 'recovered').length;
    return Math.round((recovered / households.length) * 100);
  }, []);

  // Pie chart data for status
  const pieData = statusBreakdown.map(s => ({ name: s.label, value: s.count, fill: s.hex }));

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Page header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Coordinator overview across all refuges
          </p>
        </div>
      </AnimatedSection>

      <Tabs defaultValue="now">
        <TabsList>
          <TabsTrigger value="now">Now</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════
            NOW TAB — Actionable state
           ═══════════════════════════════════════════════ */}
        <TabsContent value="now" className="space-y-5 mt-4">
          {/* Alert banner */}
          {(stalledFamilies.length > 0 || unassigned.length > 0) && (
            <div className="flex flex-wrap gap-3">
              {stalledFamilies.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-red-800 font-medium">
                    {stalledFamilies.length} stalled — no contact in 14+ days
                  </span>
                </div>
              )}
              {unassigned.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm">
                  <UserX className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-800 font-medium">
                    {unassigned.length} families have no navigator
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={`grid gap-5 ${isDesktop ? 'grid-cols-5' : 'grid-cols-1'}`}>
            {/* Left column: Coverage + Urgent */}
            <div className={`space-y-5 ${isDesktop ? 'col-span-3' : ''}`}>
              {/* Coverage breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {statusBreakdown.map(item => (
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

                  {/* Top unmet need categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Where We're Falling Short
                    </h3>
                    <div className="space-y-2">
                      {unmetByCategory.slice(0, 5).map(({ category, count }) => (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-foreground">{category}</span>
                          <Badge variant="secondary" className="text-xs">
                            {count} unmet
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgent households */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>

            {/* Right column: Signals + Activity */}
            <div className={`space-y-5 ${isDesktop ? 'col-span-2' : ''}`}>
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <p className="text-2xl font-bold text-foreground">{recoveryRate}%</p>
                  <p className="text-xs text-muted-foreground">Recovery rate</p>
                </Card>
                <Card className="p-3">
                  <p className="text-2xl font-bold text-foreground">{totalVolunteerHours}</p>
                  <p className="text-xs text-muted-foreground">Volunteer hours</p>
                </Card>
              </div>

              {/* NRI Signals */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Radio className="h-4 w-4 text-violet-500" />
                    NRI Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {systemSignals.map(signal => (
                      <RecoverySignalCard key={signal.id} signal={signal} />
                    ))}
                    {systemSignals.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No system-level signals
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {RECENT_ACTIVITY.map((item, i) => (
                      <motion.div key={i} variants={staggerItem} className="flex gap-3 text-sm">
                        <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[80px]">
                          {item.time}
                        </span>
                        <p className="text-foreground text-xs">{item.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════
            TRENDS TAB — Impact over time
           ═══════════════════════════════════════════════ */}
        <TabsContent value="trends" className="space-y-5 mt-4">
          {/* Recovery Movement */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Recovery Movement
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                How families move through stages over time
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={MONTHLY_RECOVERY_FLOW}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="recovered" stackId="1" stroke={STATUS_COLORS.recovered.hex} fill={STATUS_COLORS.recovered.hex} fillOpacity={0.7} name="Recovered" />
                  <Area type="monotone" dataKey="rebuilding" stackId="1" stroke={STATUS_COLORS.rebuilding.hex} fill={STATUS_COLORS.rebuilding.hex} fillOpacity={0.7} name="Rebuilding" />
                  <Area type="monotone" dataKey="stabilizing" stackId="1" stroke={STATUS_COLORS.stabilizing.hex} fill={STATUS_COLORS.stabilizing.hex} fillOpacity={0.7} name="Stabilizing" />
                  <Area type="monotone" dataKey="acute" stackId="1" stroke={STATUS_COLORS.acute.hex} fill={STATUS_COLORS.acute.hex} fillOpacity={0.7} name="Acute" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className={`grid gap-5 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Time in each stage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-sky-500" />
                  Average Days per Stage
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Actual vs. target transition time
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AVG_DAYS_BY_STAGE.map(({ stage, days, target }) => {
                    const ratio = Math.min(days / target, 2);
                    const overTarget = days > target;
                    return (
                      <div key={stage} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground text-xs">{stage}</span>
                          <span className={`text-xs font-medium ${overTarget ? 'text-red-500' : 'text-emerald-600'}`}>
                            {days}d {overTarget ? `(+${days - target})` : `(${target - days} early)`}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${overTarget ? 'bg-red-400' : 'bg-emerald-400'}`}
                            style={{ width: `${Math.min(ratio * 50, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Target: {target} days</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Taper-off */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-amber-500" />
                  The Taper-Off Problem
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Are families staying supported through the long tail?
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={TAPER_OFF_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mark" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="active" name="Still supported" fill={STATUS_COLORS.rebuilding.hex} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="dropped" name="Lost contact" fill="#e5e5e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  National average: most disaster aid stops within 6 months. Recovery takes 3.5–5.9 years.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Volunteer capacity trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Volunteer Capacity
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Hours logged and families-per-volunteer ratio over time
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={VOLUNTEER_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="hours" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="ratio" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Area yAxisId="hours" type="monotone" dataKey="hours" name="Hours logged" stroke="#34d399" fill="#34d399" fillOpacity={0.15} />
                  <Area yAxisId="ratio" type="monotone" dataKey="families" name="Families/volunteer" stroke="#f87171" fill="#f87171" fillOpacity={0.1} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current distribution pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Current Distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {households.length} total families served
              </p>
            </CardHeader>
            <CardContent>
              <div className={`flex ${isDesktop ? 'items-center gap-8' : 'flex-col items-center gap-4'}`}>
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {statusBreakdown.map(item => (
                    <div key={item.status} className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${item.bar}`} />
                      <span className="text-sm text-foreground w-24">{item.label}</span>
                      <span className="text-sm font-bold text-foreground">{item.count}</span>
                      <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
