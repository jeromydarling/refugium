import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import {
  BookOpen,
  ListChecks,
  Clock,
  DoorOpen,
  Footprints,
  AlertTriangle,
  FileCheck,
  HeartHandshake,
  PartyPopper,
} from 'lucide-react';
import { cardHover } from '@/lib/animations';

interface Playbook {
  id: string;
  title: string;
  description: string;
  steps: number;
  estimatedMinutes: number;
  difficulty: 'Essential' | 'Intermediate' | 'Advanced';
  icon: typeof BookOpen;
  tags: string[];
}

const MOCK_PLAYBOOKS: Playbook[] = [
  {
    id: 'pb-001',
    title: 'Opening a New Refuge',
    description:
      'The foundational workflow for bringing a new family into the system. Covers initial contact, data entry, needs triage, and first-week priorities.',
    steps: 8,
    estimatedMinutes: 15,
    difficulty: 'Essential',
    icon: DoorOpen,
    tags: ['Intake', 'Core'],
  },
  {
    id: 'pb-002',
    title: 'First Home Visit',
    description:
      'Guide for conducting your first face-to-face visit with a family. Includes Ignatian movements for listening, observation prompts, and safety checklist.',
    steps: 6,
    estimatedMinutes: 20,
    difficulty: 'Essential',
    icon: Footprints,
    tags: ['Visits', 'Ignatian'],
  },
  {
    id: 'pb-003',
    title: 'Handling a Stalled Refuge',
    description:
      'When a family stops progressing, this guide helps you identify root causes, re-engage gently, and decide whether to escalate or pause.',
    steps: 5,
    estimatedMinutes: 12,
    difficulty: 'Intermediate',
    icon: AlertTriangle,
    tags: ['Stuck Cases', 'Escalation'],
  },
  {
    id: 'pb-004',
    title: 'Connecting to FEMA',
    description:
      'Step-by-step application walkthrough for FEMA Individual Assistance. Covers required documents, common pitfalls, appeal process, and SBA loan referrals.',
    steps: 7,
    estimatedMinutes: 25,
    difficulty: 'Intermediate',
    icon: FileCheck,
    tags: ['Government', 'Benefits'],
  },
  {
    id: 'pb-005',
    title: 'Supporting a Family in Crisis',
    description:
      'When things go sideways: mental health emergencies, domestic conflict, or sudden displacement. Includes crisis line numbers and warm handoff protocols.',
    steps: 4,
    estimatedMinutes: 10,
    difficulty: 'Advanced',
    icon: HeartHandshake,
    tags: ['Crisis', 'Safety'],
  },
  {
    id: 'pb-006',
    title: 'Closing a Refuge',
    description:
      'The joyful work of marking a family as restored. Covers final assessment, celebration, transition planning, and inviting them to help others.',
    steps: 5,
    estimatedMinutes: 15,
    difficulty: 'Essential',
    icon: PartyPopper,
    tags: ['Closure', 'Celebration'],
  },
];

const DIFFICULTY_STYLE: Record<string, { color: string; variant: 'default' | 'secondary' | 'outline' }> = {
  Essential: { color: 'bg-emerald-50 text-emerald-800', variant: 'secondary' },
  Intermediate: { color: 'bg-amber-50 text-amber-800', variant: 'secondary' },
  Advanced: { color: 'bg-red-50 text-red-800', variant: 'secondary' },
};

function PlaybookCard({ playbook }: { playbook: Playbook }) {
  const Icon = playbook.icon;
  const diffStyle = DIFFICULTY_STYLE[playbook.difficulty];

  return (
    <motion.div {...cardHover}>
      <Card className="parchment-card h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-serif font-bold leading-tight">
                  {playbook.title}
                </CardTitle>
                <Badge className={`text-[10px] shrink-0 ${diffStyle.color}`} variant={diffStyle.variant}>
                  {playbook.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {playbook.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          <Separator />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              {playbook.steps} steps
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              ~{playbook.estimatedMinutes} min
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {playbook.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[9px] font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PlaybooksPage() {
  const isDesktop = useIsDesktop();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Playbooks</h1>
            <p className="text-sm text-muted-foreground">
              Step-by-step guides for navigators
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Playbook cards */}
      <AnimatedSection delay={0.1}>
        <StaggerList className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {MOCK_PLAYBOOKS.map((pb) => (
            <PlaybookCard key={pb.id} playbook={pb} />
          ))}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
