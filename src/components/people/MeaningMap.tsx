import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MeaningMap as MeaningMapType } from '@/data';
import { Flame, Sparkles, Mountain } from 'lucide-react';

const PATHWAY_CONFIG = {
  creative: {
    label: 'Creative',
    description: 'Meaning through giving — work, creation, contribution',
    icon: Flame,
    color: 'text-amber-800 bg-amber-50',
    borderColor: 'border-l-amber-400',
  },
  experiential: {
    label: 'Experiential',
    description: 'Meaning through receiving — love, beauty, encounter',
    icon: Sparkles,
    color: 'text-sky-800 bg-sky-50',
    borderColor: 'border-l-sky-400',
  },
  attitudinal: {
    label: 'Attitudinal',
    description: 'Meaning through facing suffering — courage, dignity',
    icon: Mountain,
    color: 'text-violet-800 bg-violet-50',
    borderColor: 'border-l-violet-400',
  },
};

interface MeaningMapProps {
  meaningMap: MeaningMapType;
}

export function MeaningMapView({ meaningMap }: MeaningMapProps) {
  const grouped = {
    creative: meaningMap.observations.filter(o => o.pathway === 'creative'),
    experiential: meaningMap.observations.filter(o => o.pathway === 'experiential'),
    attitudinal: meaningMap.observations.filter(o => o.pathway === 'attitudinal'),
  };

  return (
    <div className="space-y-3">
      {/* Frankl header */}
      <div className="rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-3 border border-primary/10">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          Meaning Map
        </p>
        <p className="text-[11px] text-muted-foreground italic">
          "He who has a why to live for can bear almost any how." — Viktor Frankl
        </p>
        {meaningMap.summary && (
          <p className="text-xs text-foreground mt-2 leading-relaxed">{meaningMap.summary}</p>
        )}
      </div>

      {/* Three pathways */}
      {(['creative', 'experiential', 'attitudinal'] as const).map(pathway => {
        const config = PATHWAY_CONFIG[pathway];
        const observations = grouped[pathway];
        const Icon = config.icon;

        if (observations.length === 0) return null;

        return (
          <div key={pathway}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold">{config.label} Values</span>
                <span className="text-[10px] text-muted-foreground ml-1.5">{config.description}</span>
              </div>
            </div>
            <div className="space-y-2 ml-8">
              {observations.map(obs => (
                <div key={obs.id} className={`border-l-2 ${config.borderColor} pl-3 py-1`}>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground">{obs.author}</span>
                    <span>&middot;</span>
                    <span>{new Date(obs.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-foreground mt-0.5 leading-relaxed">{obs.observation}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
