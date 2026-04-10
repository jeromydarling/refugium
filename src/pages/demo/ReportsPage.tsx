import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { households, needs, volunteers, partners } from '@/data';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Handshake,
  Download,
  FileBarChart,
  FilePieChart,
  FileSpreadsheet,
  Wrench,
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 'rpt-001',
    title: 'Monthly Impact Report — March 2026',
    date: 'March 31, 2026',
    type: 'Impact',
    typeColor: 'bg-blue-100 text-blue-800',
    description:
      'Comprehensive overview of families served, needs resolved, volunteer hours, and partner engagement for the month.',
    icon: FileBarChart,
  },
  {
    id: 'rpt-002',
    title: 'Quarterly Narrative Report — Q1 2026',
    date: 'March 31, 2026',
    type: 'Narrative',
    typeColor: 'bg-purple-100 text-purple-800',
    description:
      'Story-driven report featuring family journeys, volunteer spotlights, and community impact testimonials for funders.',
    icon: FilePieChart,
  },
  {
    id: 'rpt-003',
    title: 'Funder Summary — Hurricane Francine Response',
    date: 'March 15, 2026',
    type: 'Funder',
    typeColor: 'bg-green-100 text-green-800',
    description:
      'Grant-specific summary of Hurricane Francine disaster response: expenditures, outcomes, and remaining needs.',
    icon: FileSpreadsheet,
  },
  {
    id: 'rpt-004',
    title: 'Annual Volunteer Engagement Report',
    date: 'February 28, 2026',
    type: 'Annual',
    typeColor: 'bg-amber-100 text-amber-800',
    description:
      'Year-end report on volunteer recruitment, retention, hours logged, and skills deployed across all zones.',
    icon: FileBarChart,
  },
];

export default function ReportsPage() {
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  const kpis = useMemo(() => {
    const totalFamilies = households.length;
    const needsResolved = needs.filter((n) => n.status === 'met').length;
    const volunteerHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0);
    const activePartners = partners.length;
    return { totalFamilies, needsResolved, volunteerHours, activePartners };
  }, []);

  const KPI_CARDS = [
    {
      label: 'Total Families Served',
      value: kpis.totalFamilies,
      icon: Users,
      color: 'text-primary',
    },
    {
      label: 'Needs Resolved',
      value: kpis.needsResolved,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      label: 'Volunteer Hours',
      value: kpis.volunteerHours.toLocaleString(),
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: 'Active Partners',
      value: kpis.activePartners,
      icon: Handshake,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Impact Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and review reports for funders, stakeholders, and internal review.
          </p>
        </div>
      </AnimatedSection>

      {/* KPI Row */}
      <AnimatedSection delay={0.1}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 ${isDesktop ? 'grid-cols-4' : 'grid-cols-2'}`}
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

      {/* Main content grid */}
      <div className={`grid gap-6 ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {/* Recent Reports */}
        <AnimatedSection className={isDesktop ? 'col-span-2' : ''} delay={0.2}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerList className="space-y-3">
                {MOCK_REPORTS.map((report) => (
                  <Card
                    key={report.id}
                    className="p-4 border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                          <report.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {report.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${report.typeColor}`} variant="secondary">
                              {report.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{report.date}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => simulateWrite('Report downloaded')}
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        PDF
                      </Button>
                    </div>
                  </Card>
                ))}
              </StaggerList>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Report Builder */}
        <AnimatedSection delay={0.3}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Report Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create custom reports from templates tailored to your funders and stakeholders.
              </p>

              <Separator />

              <div className="space-y-3">
                {[
                  { name: 'Monthly Impact', desc: 'KPIs, needs resolved, volunteer summary' },
                  { name: 'Funder Narrative', desc: 'Family stories, outcomes, photos' },
                  { name: 'Grant Compliance', desc: 'Expenditures, milestones, deliverables' },
                  { name: 'Board Summary', desc: 'High-level overview with trend data' },
                ].map((tpl) => (
                  <motion.div key={tpl.name} {...cardHover}>
                    <Card
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => simulateWrite(`Building "${tpl.name}" report`)}
                    >
                      <p className="text-sm font-medium text-foreground">{tpl.name}</p>
                      <p className="text-xs text-muted-foreground">{tpl.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Separator />

              <Button
                className="w-full"
                onClick={() => simulateWrite('Custom report builder opened')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Build Custom Report
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
