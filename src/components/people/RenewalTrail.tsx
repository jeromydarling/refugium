import { motion } from 'framer-motion';
import type { CaseJourney } from '@/data';
import { Check, MapPin, Compass } from 'lucide-react';

const STAGES = [
  { key: 'intake', label: 'Intake', shortLabel: 'In' },
  { key: 'assessment', label: 'Assessment', shortLabel: 'As' },
  { key: 'stabilization', label: 'Stabilization', shortLabel: 'St' },
  { key: 'repair_rebuild', label: 'Rebuild', shortLabel: 'Re' },
  { key: 'closure', label: 'Restored', shortLabel: 'Rs' },
];

interface RenewalTrailProps {
  journey: CaseJourney;
}

export function RenewalTrail({ journey }: RenewalTrailProps) {
  const activeIndex = journey.stages.findIndex(s => s.status === 'active');
  const currentStageIndex = activeIndex >= 0 ? activeIndex : journey.stages.filter(s => s.status === 'completed').length;

  return (
    <div className="relative px-2">
      {/* Compass rose watermark */}
      <div className="absolute -top-1 -right-1 opacity-[0.06]">
        <Compass className="w-20 h-20 text-[hsl(var(--ignatian-gold))]" />
      </div>

      {/* Trail SVG */}
      <div className="relative">
        <svg className="w-full h-4 mb-1" viewBox="0 0 500 16" preserveAspectRatio="none">
          {/* Background trail (future) */}
          <path
            d="M 25 8 Q 90 4, 150 8 Q 210 12, 275 8 Q 340 4, 400 8 Q 430 10, 475 8"
            className="trail-line"
            style={{ stroke: 'hsl(30 18% 80%)', strokeWidth: 2, strokeDasharray: '6 4' }}
          />
          {/* Completed trail (warm rust) */}
          {currentStageIndex > 0 && (
            <path
              d="M 25 8 Q 90 4, 150 8 Q 210 12, 275 8 Q 340 4, 400 8 Q 430 10, 475 8"
              className="trail-line"
              style={{
                stroke: 'hsl(25 35% 50%)',
                strokeWidth: 3,
                strokeDasharray: `${(currentStageIndex / 4) * 500} 500`,
              }}
            />
          )}
        </svg>

        {/* Waypoints */}
        <div className="flex justify-between items-start relative -mt-5">
          {STAGES.map((stage, i) => {
            const journeyStage = journey.stages.find(s => s.stage === stage.key);
            const isCompleted = journeyStage?.status === 'completed';
            const isActive = journeyStage?.status === 'active';
            const isFuture = !isCompleted && !isActive;

            return (
              <div key={stage.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                {/* Waypoint dot */}
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
                  className="relative"
                >
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-[hsl(25_35%_50%)] flex items-center justify-center shadow-sm border-2 border-[hsl(var(--ignatian-cream))]">
                      <Check className="w-4 h-4 text-[hsl(var(--ignatian-cream))]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--ignatian-cream))] border-3 border-[hsl(var(--primary))] flex items-center justify-center shadow-md">
                      <MapPin className="w-5 h-5 text-primary" />
                      {/* Glow ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[hsl(var(--ignatian-cream-dark))] border-2 border-[hsl(var(--ignatian-border))] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[hsl(var(--ignatian-tan))]" />
                    </div>
                  )}
                </motion.div>

                {/* Label */}
                <p className={`text-[10px] mt-1.5 text-center font-medium ${
                  isActive ? 'text-primary font-semibold text-xs' :
                  isCompleted ? 'text-[hsl(var(--ignatian-brown))]' :
                  'text-[hsl(var(--ignatian-muted))]'
                }`}>
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">{stage.shortLabel}</span>
                </p>

                {/* Date for completed/active */}
                {journeyStage?.date && (
                  <p className="text-[9px] text-[hsl(var(--ignatian-muted))]">
                    {new Date(journeyStage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current stage annotation */}
      {journey.stages[currentStageIndex] && (
        <div className="mt-3 text-center">
          <p className="text-xs text-[hsl(var(--ignatian-muted))] italic">
            {journey.stages[currentStageIndex].notes}
          </p>
        </div>
      )}
    </div>
  );
}
