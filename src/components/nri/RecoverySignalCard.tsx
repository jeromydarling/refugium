import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, AlertTriangle, Lightbulb, Link2, PartyPopper, Eye } from 'lucide-react';
import type { RecoverySignal } from '@/data';
import { useState } from 'react';
import { slideUp } from '@/lib/animations';

const KIND_CONFIG: Record<string, { label: string; color: string; icon: typeof AlertTriangle }> = {
  stalled_case: { label: 'Stalled Refuge', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
  quiet_need: { label: 'Quiet Need', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Eye },
  connection_opportunity: { label: 'Connection', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Link2 },
  celebration: { label: 'Celebration', color: 'bg-green-100 text-green-800 border-green-200', icon: PartyPopper },
  heads_up: { label: 'Heads Up', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Lightbulb },
};

const STRENGTH_DOTS: Record<string, number> = {
  emerging: 1,
  growing: 2,
  strong: 3,
};

interface RecoverySignalCardProps {
  signal: RecoverySignal;
}

export function RecoverySignalCard({ signal }: RecoverySignalCardProps) {
  const [open, setOpen] = useState(false);
  const config = KIND_CONFIG[signal.kind] || KIND_CONFIG.heads_up;
  const Icon = config.icon;
  const dots = STRENGTH_DOTS[signal.strength] || 1;

  return (
    <motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
    <Card className="border-l-4 border-l-primary/40 p-3">
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className={`text-xs ${config.color}`}>
              {config.label}
            </Badge>
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i < dots ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">{signal.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{signal.summary}</p>

          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors">
              <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
              Why this signal?
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sources</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                  {signal.evidence.sources.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Points</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                  {signal.evidence.dataPoints.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}
