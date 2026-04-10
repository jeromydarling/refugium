import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { households, getJourneyForHousehold, getNeedsForHousehold, getSignalsForHousehold } from '@/data';
import type { Household } from '@/data';
import { Search, AlertTriangle, ChevronDown, Users } from 'lucide-react';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

type JourneyStage = 'intake' | 'assessment' | 'stabilization' | 'repair_rebuild' | 'closure';

const COLUMNS: { stage: JourneyStage; label: string; color: string }[] = [
  { stage: 'intake', label: 'Intake', color: 'bg-sky-400' },
  { stage: 'assessment', label: 'Assessment', color: 'bg-slate-400' },
  { stage: 'stabilization', label: 'Stabilization', color: 'bg-amber-400' },
  { stage: 'repair_rebuild', label: 'Repair & Rebuild', color: 'bg-primary' },
  { stage: 'closure', label: 'Closure', color: 'bg-emerald-400' },
];

const STATUS_BORDER: Record<string, string> = {
  acute: 'border-l-red-400',
  stabilizing: 'border-l-amber-400',
  rebuilding: 'border-l-sky-400',
  recovered: 'border-l-emerald-400',
};

const STALL_THRESHOLD_DAYS = 14;

interface BoardCard {
  household: Household;
  stage: JourneyStage;
  daysInStage: number;
  unmetCount: number;
  hasSignals: boolean;
  isStalled: boolean;
}

function buildBoardCards(): BoardCard[] {
  return households.map((hh) => {
    const journey = getJourneyForHousehold(hh.id);
    const activeStageEntry = journey?.stages.find((s) => s.status === 'active');
    const stage: JourneyStage = activeStageEntry?.stage ?? 'intake';

    const stageDate = activeStageEntry?.date;
    const daysInStage = stageDate
      ? Math.floor((Date.now() - new Date(stageDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const needs = getNeedsForHousehold(hh.id);
    const unmetCount = needs.filter((n) => n.status !== 'met').length;
    const signals = getSignalsForHousehold(hh.id);
    const isStalled = stageDate ? daysInStage > STALL_THRESHOLD_DAYS : false;

    return {
      household: hh,
      stage,
      daysInStage,
      unmetCount,
      hasSignals: signals.length > 0,
      isStalled,
    };
  });
}

export default function BoardView() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [search, setSearch] = useState('');
  const [expandedColumns, setExpandedColumns] = useState<Set<JourneyStage>>(
    new Set(['intake', 'assessment', 'stabilization', 'repair_rebuild', 'closure'])
  );

  const allCards = useMemo(() => buildBoardCards(), []);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return allCards;
    const q = search.toLowerCase();
    return allCards.filter(
      (c) =>
        c.household.familyName.toLowerCase().includes(q) ||
        c.household.headOfHousehold.toLowerCase().includes(q)
    );
  }, [allCards, search]);

  const columnData = useMemo(() => {
    const map = new Map<JourneyStage, BoardCard[]>();
    for (const col of COLUMNS) {
      map.set(col.stage, []);
    }
    for (const card of filteredCards) {
      map.get(card.stage)?.push(card);
    }
    return map;
  }, [filteredCards]);

  const toggleColumn = (stage: JourneyStage) => {
    setExpandedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Board</h1>
          <p className="text-sm text-muted-foreground">
            {filteredCards.length} refuge{filteredCards.length !== 1 ? 's' : ''} across {COLUMNS.length} stages
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search families..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Board */}
      {isDesktop ? (
        /* Desktop: horizontal Kanban */
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
          {COLUMNS.map((col) => {
            const cards = columnData.get(col.stage) ?? [];
            return (
              <div
                key={col.stage}
                className="flex-shrink-0 w-[280px] flex flex-col"
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {cards.length}
                  </Badge>
                </div>

                {/* Cards container */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 space-y-2 bg-muted/30 rounded-lg p-2 overflow-y-auto"
                >
                  {cards.map((card) => (
                    <motion.div key={card.household.id} variants={staggerItem}>
                      <BoardCardComponent card={card} onClick={() => navigate(`/demo/app/people/${card.household.id}`)} />
                    </motion.div>
                  ))}
                  {cards.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">No refuges</p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mobile: vertical collapsible columns */
        <div className="space-y-3">
          {COLUMNS.map((col) => {
            const cards = columnData.get(col.stage) ?? [];
            const isExpanded = expandedColumns.has(col.stage);
            return (
              <div key={col.stage}>
                <button
                  onClick={() => toggleColumn(col.stage)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {cards.length}
                  </Badge>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2 mt-2 pl-2"
                  >
                    {cards.map((card) => (
                      <motion.div key={card.household.id} variants={staggerItem}>
                        <BoardCardComponent card={card} onClick={() => navigate(`/demo/app/people/${card.household.id}`)} />
                      </motion.div>
                    ))}
                    {cards.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No refuges</p>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Individual board card ─────────────────────────────────── */

function BoardCardComponent({ card, onClick }: { card: BoardCard; onClick: () => void }) {
  return (
    <motion.div {...cardHover}>
      <Card
        className={`p-3 cursor-pointer hover:shadow-md transition-shadow border-l-[3px] ${STATUS_BORDER[card.household.currentStatus] || ''}`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {card.household.familyName}
              </h3>
              {card.hasSignals && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
              )}
              {card.isStalled && (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {card.household.headOfHousehold}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {card.household.members.length}
            </span>
            {card.unmetCount > 0 && (
              <span className="text-destructive font-medium">{card.unmetCount} needs</span>
            )}
          </div>
          <span>{card.daysInStage}d in stage</span>
        </div>
      </Card>
    </motion.div>
  );
}
