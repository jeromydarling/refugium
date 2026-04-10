import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import {
  FolderKanban,
  Users,
  Handshake,
  CheckCircle2,
  Clock,
  Hammer,
  Droplets,
  Bus,
  Backpack,
} from 'lucide-react';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

interface Project {
  id: string;
  title: string;
  description: string;
  householdCount: number;
  volunteerCount?: number;
  leadPartner: string;
  progress: number;
  status: 'active' | 'planning' | 'complete';
  icon: typeof Hammer;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'Cedar Park Neighborhood Rebuild',
    description:
      'Coordinated rebuild of five homes on Cedar Park Lane damaged by flooding. Shared dumpster, volunteer crews rotating across sites, bulk materials purchase.',
    householdCount: 5,
    volunteerCount: 3,
    leadPartner: 'Habitat for Humanity Greater BR',
    progress: 60,
    status: 'active',
    icon: Hammer,
  },
  {
    id: 'proj-002',
    title: 'Zone 3 Mold Remediation',
    description:
      'Professional mold assessment and remediation for three households in Lafayette zone. Habitat for Humanity leading with certified contractors.',
    householdCount: 3,
    leadPartner: 'Habitat for Humanity',
    progress: 40,
    status: 'active',
    icon: Droplets,
  },
  {
    id: 'proj-003',
    title: 'Gulf Coast Dialysis Transport Network',
    description:
      'Reliable transport for two displaced dialysis patients to Gulf Coast Kidney Center three times per week. Partnership with Kidney Center for priority scheduling.',
    householdCount: 2,
    leadPartner: 'Gulf Coast Kidney Center',
    progress: 80,
    status: 'active',
    icon: Bus,
  },
  {
    id: 'proj-004',
    title: 'Back to School Initiative',
    description:
      'Clothing, school supplies, and enrollment support for children across six displaced families. Coordinating with local schools for mid-year transfers.',
    householdCount: 6,
    leadPartner: 'Catholic Charities of Acadiana',
    progress: 90,
    status: 'active',
    icon: Backpack,
  },
];

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  planning: { label: 'Planning', variant: 'secondary' },
  complete: { label: 'Complete', variant: 'outline' },
};

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;
  const statusCfg = STATUS_CONFIG[project.status];

  return (
    <motion.div {...cardHover}>
      <Card className="parchment-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-serif font-bold leading-tight">
                  {project.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
            <Badge variant={statusCfg.variant} className="text-[10px] shrink-0">
              {statusCfg.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Separator />

          {/* Metrics row */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {project.householdCount} household{project.householdCount !== 1 ? 's' : ''}
            </span>
            {project.volunteerCount && (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {project.volunteerCount} volunteer{project.volunteerCount !== 1 ? 's' : ''}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Handshake className="h-3.5 w-3.5" />
              {project.leadPartner}
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Progress
              </span>
              <span className="font-semibold text-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const isDesktop = useIsDesktop();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center gap-3">
          <FolderKanban className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Recovery efforts that span multiple households
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Project cards */}
      <AnimatedSection delay={0.1}>
        <StaggerList className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {MOCK_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
