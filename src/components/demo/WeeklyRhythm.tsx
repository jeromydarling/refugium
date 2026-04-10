import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { households, getNeedsForHousehold, getSignalsForHousehold } from '@/data';
import { slideUp, staggerContainer, staggerItem } from '@/lib/animations';
import {
  Eye, Compass, Zap, Heart, RotateCcw,
  ChevronDown, ChevronRight, MapPin, Phone, Users,
  Calendar, Sun, Moon, CheckCircle2,
} from 'lucide-react';

// ── Ignatian Movements ──
const MOVEMENTS = [
  {
    key: 'see',
    label: 'See',
    icon: Eye,
    color: 'text-blue-600 bg-blue-100',
    prompt: 'Who am I present to today? What is their context?',
    description: 'Presence — encounter the person and their situation before acting.',
  },
  {
    key: 'discern',
    label: 'Discern',
    icon: Compass,
    color: 'text-amber-600 bg-amber-100',
    prompt: 'What signals, movements, or unmet needs am I noticing?',
    description: 'Reflection — notice what the Spirit and the data are saying together.',
  },
  {
    key: 'act',
    label: 'Act',
    icon: Zap,
    color: 'text-primary bg-primary/10',
    prompt: 'What is the one next faithful step?',
    description: 'Decision — choose the action that most truly serves this person\'s recovery.',
  },
  {
    key: 'accompany',
    label: 'Accompany',
    icon: Heart,
    color: 'text-pink-600 bg-pink-100',
    prompt: 'How will I stay present over time? What follow-up is needed?',
    description: 'Continuity — hold the thread of this relationship beyond today.',
  },
  {
    key: 'restore',
    label: 'Restore',
    icon: RotateCcw,
    color: 'text-green-600 bg-green-100',
    prompt: 'Did today\'s step help? What changed? What remains?',
    description: 'Review — honest evaluation in service of the next faithful step.',
  },
];

// ── Mock weekly schedule ──
function generateWeekDays(): { date: Date; label: string; dayName: string }[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1); // Monday

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      date: d,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  });
}

// Mock scheduled visits per day
const WEEKLY_VISITS: Record<number, { householdId: string; time: string; type: 'visit' | 'follow-up' | 'assessment' }[]> = {
  1: [
    { householdId: 'hh-001', time: '9:00 AM', type: 'follow-up' },
    { householdId: 'hh-005', time: '2:00 PM', type: 'visit' },
  ],
  2: [
    { householdId: 'hh-003', time: '10:00 AM', type: 'assessment' },
    { householdId: 'hh-010', time: '1:00 PM', type: 'visit' },
    { householdId: 'hh-011', time: '3:30 PM', type: 'follow-up' },
  ],
  3: [
    { householdId: 'hh-004', time: '9:30 AM', type: 'visit' },
    { householdId: 'hh-013', time: '2:00 PM', type: 'follow-up' },
  ],
  4: [
    { householdId: 'hh-002', time: '10:00 AM', type: 'follow-up' },
    { householdId: 'hh-014', time: '1:00 PM', type: 'visit' },
    { householdId: 'hh-008', time: '4:00 PM', type: 'assessment' },
  ],
  5: [
    { householdId: 'hh-006', time: '9:00 AM', type: 'follow-up' },
    { householdId: 'hh-015', time: '11:00 AM', type: 'visit' },
  ],
};

const VISIT_TYPE_STYLES: Record<string, string> = {
  visit: 'bg-primary/10 text-primary',
  'follow-up': 'bg-amber-100 text-amber-700',
  assessment: 'bg-blue-100 text-blue-700',
};

interface DailyExamenState {
  [movement: string]: { checked: boolean; note: string };
}

export function WeeklyRhythm() {
  const { simulateWrite } = useDemoMode();
  const weekDays = generateWeekDays();
  const today = new Date();
  const todayDow = today.getDay() === 0 ? 7 : today.getDay(); // 1=Mon, 7=Sun
  const [expandedDay, setExpandedDay] = useState<number>(todayDow);
  const [examenStates, setExamenStates] = useState<Record<number, DailyExamenState>>({});

  const toggleDay = (dow: number) => {
    setExpandedDay(prev => prev === dow ? -1 : dow);
  };

  const toggleMovement = (dow: number, movement: string) => {
    setExamenStates(prev => {
      const dayState = prev[dow] || {};
      const current = dayState[movement] || { checked: false, note: '' };
      return {
        ...prev,
        [dow]: { ...dayState, [movement]: { ...current, checked: !current.checked } },
      };
    });
    simulateWrite('Reflection saved');
  };

  const getCompletedCount = (dow: number): number => {
    const dayState = examenStates[dow];
    if (!dayState) return 0;
    return Object.values(dayState).filter(s => s.checked).length;
  };

  return (
    <div className="space-y-4">
      {/* Week header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">Weekly Rhythm</h2>
          <p className="text-xs text-muted-foreground">
            Week of {weekDays[0]?.label} — {weekDays[6]?.label}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs text-muted-foreground">Ignatian Examen</span>
        </div>
      </div>

      {/* Day pills - quick overview */}
      <div className="flex gap-1.5">
        {weekDays.map((day, i) => {
          const dow = i + 1;
          const isToday = dow === todayDow;
          const visits = WEEKLY_VISITS[dow] || [];
          const completed = getCompletedCount(dow);
          const isExpanded = expandedDay === dow;

          return (
            <button
              key={dow}
              onClick={() => toggleDay(dow)}
              className={`flex-1 rounded-lg p-2 text-center transition-all border ${
                isExpanded
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : isToday
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border hover:border-primary/20'
              }`}
            >
              <p className={`text-[10px] font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                {day.dayName}
              </p>
              <p className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                {day.date.getDate()}
              </p>
              {visits.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {visits.map((_, vi) => (
                    <span key={vi} className="w-1 h-1 rounded-full bg-primary" />
                  ))}
                </div>
              )}
              {completed > 0 && (
                <p className="text-[9px] text-green-600 mt-0.5">{completed}/5</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded day */}
      <AnimatePresence mode="wait">
        {expandedDay > 0 && expandedDay <= 7 && (
          <motion.div
            key={expandedDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Scheduled visits for this day */}
            {(() => {
              const visits = WEEKLY_VISITS[expandedDay] || [];
              if (visits.length === 0) {
                return (
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {expandedDay > 5 ? 'Weekend — rest and renewal' : 'No visits scheduled'}
                    </p>
                    {expandedDay > 5 && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "The Sabbath was made for people, not people for the Sabbath."
                      </p>
                    )}
                  </Card>
                );
              }

              return (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {visits.length} visit{visits.length > 1 ? 's' : ''} scheduled
                  </p>
                  {visits.map((visit, vi) => {
                    const hh = households.find(h => h.id === visit.householdId);
                    if (!hh) return null;
                    const unmet = getNeedsForHousehold(hh.id).filter(n => n.status === 'unmet');
                    const signals = getSignalsForHousehold(hh.id);

                    return (
                      <Card key={vi} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">{visit.time}</span>
                              <Badge variant="secondary" className={`text-[10px] ${VISIT_TYPE_STYLES[visit.type]}`}>
                                {visit.type}
                              </Badge>
                            </div>
                            <p className="font-semibold text-sm mt-1">{hh.familyName} Family</p>
                            <p className="text-xs text-muted-foreground">{hh.headOfHousehold}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />{hh.address}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            {unmet.length > 0 && (
                              <p className="text-xs text-destructive">{unmet.length} unmet</p>
                            )}
                            {signals.length > 0 && (
                              <span className="relative flex h-2 w-2 mt-1 ml-auto">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              );
            })()}

            <Separator />

            {/* Ignatian Examen Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Moon className="h-3 w-3 inline mr-1" />
                  Daily Examen
                </p>
                <p className="text-xs text-muted-foreground">
                  {getCompletedCount(expandedDay)}/5 movements
                </p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {MOVEMENTS.map(m => {
                  const dayState = examenStates[expandedDay] || {};
                  const state = dayState[m.key] || { checked: false, note: '' };
                  const Icon = m.icon;

                  return (
                    <motion.div key={m.key} variants={staggerItem}>
                      <button
                        onClick={() => toggleMovement(expandedDay, m.key)}
                        className={`w-full text-left rounded-xl border p-3 transition-all ${
                          state.checked
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-border hover:border-primary/20 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.color}`}>
                            {state.checked ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{m.label}</span>
                              {state.checked && (
                                <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">Done</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 italic">{m.prompt}</p>
                            <p className="text-[11px] text-muted-foreground/70 mt-1">{m.description}</p>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>

              {getCompletedCount(expandedDay) === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-3"
                >
                  <p className="text-sm font-serif font-medium text-green-700">
                    Today's examen complete.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    "Give me only your love and your grace — that is enough for me."
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
