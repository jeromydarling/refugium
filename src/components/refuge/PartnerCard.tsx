import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Partner } from '@/data';
import { Phone, MapPin } from 'lucide-react';
import { cardHover } from '@/lib/animations';

const TYPE_STYLES: Record<string, string> = {
  church: 'bg-purple-100 text-purple-800',
  nonprofit: 'bg-blue-100 text-blue-800',
  government: 'bg-slate-100 text-slate-800',
  host_family: 'bg-pink-100 text-pink-800',
  business: 'bg-emerald-100 text-emerald-800',
};

const CAPACITY_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  limited: 'bg-amber-100 text-amber-800',
  full: 'bg-red-100 text-red-800',
};

const TYPE_BORDER: Record<string, string> = {
  church: 'border-l-purple-500',
  nonprofit: 'border-l-blue-500',
  government: 'border-l-gray-400',
  host_family: 'border-l-pink-500',
  business: 'border-l-emerald-500',
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
