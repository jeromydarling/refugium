import type { CaseJourney } from '@/data';
import { Check, Circle, Clock } from 'lucide-react';

const STAGE_LABELS: Record<string, string> = {
  intake: 'Intake',
  assessment: 'Assessment',
  stabilization: 'Stabilization',
  repair_rebuild: 'Repair & Rebuild',
  closure: 'Closure',
};

interface RecoveryTimelineProps {
  journey: CaseJourney;
}

export function RecoveryTimeline({ journey }: RecoveryTimelineProps) {
  return (
    <div className="space-y-0">
      {journey.stages.map((s, i) => (
        <div key={s.stage} className="flex gap-3">
          {/* Line + dot */}
          <div className="flex flex-col items-center">
            {s.status === 'completed' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-800" />
              </div>
            ) : s.status === 'active' ? (
              <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 ring-2 ring-primary/30">
                <Circle className="w-3 h-3 text-primary fill-primary" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
            {i < journey.stages.length - 1 && (
              <div className={`w-0.5 flex-1 min-h-[24px] ${s.status === 'completed' ? 'bg-emerald-200' : 'bg-border'}`} />
            )}
          </div>

          {/* Content */}
          <div className="pb-4 min-w-0">
            <p className={`text-sm font-medium ${s.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
              {STAGE_LABELS[s.stage] || s.stage}
            </p>
            {s.date && (
              <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString()}</p>
            )}
            {s.notes && (
              <p className="text-xs text-muted-foreground mt-0.5">{s.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
