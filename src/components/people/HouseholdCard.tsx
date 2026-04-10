import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Household } from '@/data';
import { Users, AlertCircle } from 'lucide-react';
import { cardHover } from '@/lib/animations';

const STATUS_STYLES: Record<string, string> = {
  acute: 'bg-red-100 text-red-800',
  stabilizing: 'bg-amber-100 text-amber-800',
  rebuilding: 'bg-blue-100 text-blue-800',
  recovered: 'bg-green-100 text-green-800',
};

const STATUS_BORDER: Record<string, string> = {
  acute: 'border-l-red-500',
  stabilizing: 'border-l-amber-500',
  rebuilding: 'border-l-blue-500',
  recovered: 'border-l-green-500',
};

interface HouseholdCardProps {
  household: Household;
  needCount: number;
  hasSignals: boolean;
  onClick: () => void;
}

export function HouseholdCard({ household, needCount, hasSignals, onClick }: HouseholdCardProps) {
  const daysSinceContact = Math.floor(
    (Date.now() - new Date(household.lastContact).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div {...cardHover}>
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] border-l-[3px] ${STATUS_BORDER[household.currentStatus] || ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{household.familyName}</h3>
            {hasSignals && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{household.headOfHousehold}</p>
          <p className="text-xs text-muted-foreground mt-1">{household.disasterEvent}</p>
        </div>
        <Badge className={STATUS_STYLES[household.currentStatus] || ''} variant="secondary">
          {household.currentStatus}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {household.members.length}
          </span>
          {needCount > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertCircle className="h-3 w-3" />
              {needCount} unmet
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {daysSinceContact}d ago
        </span>
      </div>
    </Card>
    </motion.div>
  );
}
