import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Volunteer } from '@/data';
import { Clock, MapPin, Users } from 'lucide-react';
import { cardHover } from '@/lib/animations';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-800',
  on_break: 'bg-amber-50 text-amber-800',
  new: 'bg-sky-50 text-sky-800',
};

interface VolunteerCardProps {
  volunteer: Volunteer;
}

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const nameParts = volunteer.name.split(' ');
  const initials = (nameParts[0]?.[0] ?? '') + (nameParts[nameParts.length - 1]?.[0] ?? '');

  return (
    <motion.div {...cardHover}>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials.toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{volunteer.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {volunteer.zone}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={`text-xs ${STATUS_STYLES[volunteer.status]}`}>
            {volunteer.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {volunteer.skills.slice(0, 3).map(s => (
            <Badge key={s} variant="secondary" className="text-xs bg-muted">
              {s}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {volunteer.totalHours}h total
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {volunteer.assignedHouseholdIds.length} assigned
          </span>
          <span>{volunteer.availability}</span>
        </div>
      </Card>
    </motion.div>
  );
}
