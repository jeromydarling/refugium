import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useDemoMode } from '@/contexts/DemoModeContext';
import {
  Compass,
  PenLine,
  Sun,
  CloudRain,
  Cloud,
  Sunrise,
  Heart,
} from 'lucide-react';
import { cardHover } from '@/lib/animations';

/* ── Journal entries ─────────────────────────────────────── */

interface JournalEntry {
  id: string;
  dateLabel: string;
  dateDetail: string;
  content: string;
  mood?: { icon: typeof Sun; label: string; color: string };
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: 'j-001',
    dateLabel: 'Today',
    dateDetail: 'April 10, 2026 — 8:42 PM',
    content:
      'Visited Claire Broussard. She broke down crying. First time someone asked how SHE was doing, not just what she needed. I sat with her on the porch for forty minutes. No checklist, no forms. Just presence. She told me about the magnolia tree her grandmother planted — gone now. I think that tree was holding more grief than the house.',
    mood: { icon: CloudRain, label: 'Heavy', color: 'text-blue-500' },
  },
  {
    id: 'j-002',
    dateLabel: 'Yesterday',
    dateDetail: 'April 9, 2026 — 6:15 PM',
    content:
      "Terrence still won't talk about the future. His tools are everything to him — forty years of carpentry in that shed. We found three chisels in the mud. He cleaned them with such care. I think the tools are how he'll rebuild, not just the house, but himself. Don't push. Let the man grieve at his own pace.",
    mood: { icon: Cloud, label: 'Reflective', color: 'text-slate-500' },
  },
  {
    id: 'j-003',
    dateLabel: '3 days ago',
    dateDetail: 'April 7, 2026 — 5:30 PM',
    content:
      'Good day. Connected the Nguyen family with the Rodriguez host family. Ana Rodriguez had dinner ready when they arrived. The kids started playing together within ten minutes — no common language, just Legos. Mrs. Nguyen smiled for the first time since intake. This is the network working the way it should.',
    mood: { icon: Sunrise, label: 'Hopeful', color: 'text-amber-500' },
  },
  {
    id: 'j-004',
    dateLabel: 'Last week',
    dateDetail: 'April 3, 2026 — 7:00 PM',
    content:
      "The Guidry family is helping others now. Paul showed up at the supply distribution with his truck, unloading pallets alongside our volunteers. Didn't say much, just worked. His wife Irene brought gumbo for the crew. This is what recovery looks like — it circles back. The helped become the helpers.",
    mood: { icon: Sun, label: 'Grateful', color: 'text-yellow-500' },
  },
  {
    id: 'j-005',
    dateLabel: '2 weeks ago',
    dateDetail: 'March 27, 2026 — 9:20 PM',
    content:
      'First week. Overwhelmed by the number of families. The spreadsheet is growing faster than I can visit. Need to remember: one faithful step at a time. Sister Margaret said something today that stuck — "You are not the savior. You are the companion." Wrote it on a post-it and stuck it to my dashboard.',
    mood: { icon: Heart, label: 'Determined', color: 'text-red-500' },
  },
];

function EntryCard({ entry }: { entry: JournalEntry }) {
  return (
    <motion.div {...cardHover}>
      <Card className="parchment-card overflow-hidden">
        <CardContent className="p-5">
          {/* Date header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{entry.dateLabel}</p>
              <p className="text-[10px] text-muted-foreground">{entry.dateDetail}</p>
            </div>
            {entry.mood && (
              <div className="flex items-center gap-1.5">
                <entry.mood.icon className={`h-4 w-4 ${entry.mood.color}`} />
                <Badge variant="outline" className="text-[9px] font-normal">
                  {entry.mood.label}
                </Badge>
              </div>
            )}
          </div>

          <Separator className="mb-3" />

          {/* Entry content — field note styling */}
          <p className="field-note leading-[1.8]">
            {entry.content}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function JournalPage() {
  const { simulateWrite } = useDemoMode();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Journal</h1>
              <p className="text-sm text-muted-foreground">
                Your private space for reflection
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => simulateWrite('New journal entry started')}
          >
            <PenLine className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </AnimatedSection>

      {/* Epigraph */}
      <AnimatedSection delay={0.1}>
        <Card className="parchment p-6 text-center border border-[hsl(var(--ignatian-border))]">
          <p className="font-serif italic text-sm text-muted-foreground leading-relaxed">
            "The unexamined life is not worth living."
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            — Socrates, as recorded by Plato
          </p>
        </Card>
      </AnimatedSection>

      {/* Journal entries */}
      <AnimatedSection delay={0.2}>
        <StaggerList className="space-y-4">
          {MOCK_ENTRIES.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
