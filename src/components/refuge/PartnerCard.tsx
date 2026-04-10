import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Partner } from '@/data';
import { Phone, MapPin } from 'lucide-react';
import { cardHover } from '@/lib/animations';

const TYPE_STYLES: Record<string, string> = {
  church: 'bg-violet-50 text-violet-800',
  nonprofit: 'bg-sky-50 text-sky-800',
  government: 'bg-slate-100 text-slate-700',
  host_family: 'bg-rose-50 text-rose-800',
  business: 'bg-stone-100 text-stone-700',
};

const CAPACITY_STYLES: Record<string, string> = {
  available: 'bg-emerald-50 text-emerald-800',
  limited: 'bg-amber-50 text-amber-800',
  full: 'bg-red-50 text-red-800',
};

const TYPE_BORDER: Record<string, string> = {
  church: 'border-l-violet-400',
  nonprofit: 'border-l-sky-400',
  government: 'border-l-stone-400',
  host_family: 'border-l-rose-400',
  business: 'border-l-stone-400',
};

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <motion.div {...cardHover}>
    <Card className={`p-4 border-l-[3px] ${TYPE_BORDER[partner.type] || ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-foreground">{partner.name}</h3>
        <Badge variant="secondary" className={`text-xs shrink-0 ${CAPACITY_STYLES[partner.capacity]}`}>
          {partner.capacity}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary" className={`text-xs ${TYPE_STYLES[partner.type]}`}>
          {partner.type.replace('_', ' ')}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {partner.trustLevel}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {partner.services.slice(0, 3).map(s => (
          <Badge key={s} variant="secondary" className="text-xs bg-muted">
            {s}
          </Badge>
        ))}
        {partner.services.length > 3 && (
          <Badge variant="secondary" className="text-xs bg-muted">
            +{partner.services.length - 3}
          </Badge>
        )}
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          {partner.address}
        </p>
        <p className="flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          {partner.phone} &middot; {partner.contactPerson}
        </p>
      </div>

      {partner.notes && (
        <p className="text-xs italic text-muted-foreground mt-2 border-t border-border/50 pt-2">
          {partner.notes}
        </p>
      )}
    </Card>
    </motion.div>
  );
}
