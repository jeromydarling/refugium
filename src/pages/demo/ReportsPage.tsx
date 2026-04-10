import { useMemo, useCallback } from 'react';
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
import jsPDF from 'jspdf';
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
  Table,
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 'rpt-001',
    title: 'Monthly Impact Report — March 2026',
    date: 'March 31, 2026',
    type: 'Impact',
    typeColor: 'bg-sky-50 text-sky-800',
    description:
      'Comprehensive overview of families served, needs resolved, volunteer hours, and partner engagement for the month.',
    icon: FileBarChart,
  },
  {
    id: 'rpt-002',
    title: 'Quarterly Narrative Report — Q1 2026',
    date: 'March 31, 2026',
    type: 'Narrative',
    typeColor: 'bg-violet-50 text-violet-800',
    description:
      'Story-driven report featuring family journeys, volunteer spotlights, and community impact testimonials for funders.',
    icon: FilePieChart,
  },
  {
    id: 'rpt-003',
    title: 'Funder Summary — Hurricane Francine Response',
    date: 'March 15, 2026',
    type: 'Funder',
    typeColor: 'bg-emerald-50 text-emerald-800',
    description:
      'Grant-specific summary of Hurricane Francine disaster response: expenditures, outcomes, and remaining needs.',
    icon: FileSpreadsheet,
  },
  {
    id: 'rpt-004',
    title: 'Annual Volunteer Engagement Report',
    date: 'February 28, 2026',
    type: 'Annual',
    typeColor: 'bg-amber-50 text-amber-800',
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

  const handleDownloadPDF = useCallback(
    (report: (typeof MOCK_REPORTS)[number]) => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Refugium Impact Report', pageWidth / 2, y, { align: 'center' });
        y += 10;

        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.text(report.title, pageWidth / 2, y, { align: 'center' });
        y += 10;

        // Date generated
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
        y += 16;

        // Separator line
        doc.setDrawColor(200, 190, 170);
        doc.line(20, y, pageWidth - 20, y);
        y += 12;

        // KPIs
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Performance Indicators', 20, y);
        y += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const kpiLines = [
          `Total Families Served: ${kpis.totalFamilies}`,
          `Needs Resolved: ${kpis.needsResolved}`,
          `Volunteer Hours: ${kpis.volunteerHours.toLocaleString()}`,
          `Active Partners: ${kpis.activePartners}`,
        ];
        kpiLines.forEach((line) => {
          doc.text(line, 24, y);
          y += 8;
        });
        y += 6;

        // Separator
        doc.setDrawColor(200, 190, 170);
        doc.line(20, y, pageWidth - 20, y);
        y += 12;

        // Narrative
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Narrative Summary', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const narrative = `During this reporting period, our team served ${kpis.totalFamilies} households across 5 zones in the Gulf Coast region. Volunteers contributed ${kpis.volunteerHours.toLocaleString()} hours of direct service, resolving ${kpis.needsResolved} identified needs ranging from housing repair to medical care. Our ${kpis.activePartners} active partner organizations coordinated on complex cases involving inter-agency referrals, ensuring that families received comprehensive support. Priority areas included hurricane recovery housing, elder care medical access, and employment retraining for displaced workers.`;
        const splitNarrative = doc.splitTextToSize(narrative, pageWidth - 44);
        doc.text(splitNarrative, 22, y);
        y += splitNarrative.length * 5 + 10;

        // Footer
        doc.setDrawColor(200, 190, 170);
        doc.line(20, 275, pageWidth - 20, 275);
        doc.setFontSize(9);
        doc.setTextColor(140, 140, 140);
        doc.text('Generated by Refugium \u2014 refugium.app', pageWidth / 2, 282, { align: 'center' });

        doc.save(`refugium-${report.id}.pdf`);
      } catch {
        simulateWrite('Report downloaded');
      }
    },
    [kpis, simulateWrite],
  );

  const handleExportCSV = useCallback(() => {
    try {
      const header = 'Family Name,Status,Needs Count,Last Contact';
      const rows = households.map((h) => {
        const needsCount = needs.filter((n) => n.householdId === h.id && n.status !== 'met').length;
        const lastContact = new Date(h.lastContact).toLocaleDateString();
        return `"${h.familyName}","${h.currentStatus}",${needsCount},"${lastContact}"`;
      });
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'refugium-households.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      simulateWrite('CSV exported');
    }
  }, [simulateWrite]);

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
      color: 'text-emerald-700',
    },
    {
      label: 'Volunteer Hours',
      value: kpis.volunteerHours.toLocaleString(),
      icon: Clock,
      color: 'text-amber-600',
    },
    {
      label: 'Active Partners',
      value: kpis.activePartners,
      icon: Handshake,
      color: 'text-sky-700',
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
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(report)}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={handleExportCSV}
                        >
                          <Table className="h-3.5 w-3.5 mr-1.5" />
                          CSV
                        </Button>
                      </div>
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
