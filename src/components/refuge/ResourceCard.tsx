import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Resource } from '@/data';
import { Phone, Clock, MapPin } from 'lucide-react';

const AVAIL_STYLES: Record<string, string> = {
  available: 'bg-emerald-50 text-emerald-800',
  limited: 'bg-amber-50 text-amber-800',
  waitlist: 'bg-red-50 text-red-800',
};

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-sm text-foreground">{resource.name}</h3>
        <Badge variant="secondary" className={`text-xs shrink-0 ${AVAIL_STYLES[resource.availability]}`}>
          {resource.availability}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-2">{resource.provider}</p>
      <p className="text-sm text-foreground mb-3">{resource.description}</p>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          {resource.address}
        </p>
        <p className="flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          {resource.phone}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {resource.hours}
        </p>
      </div>
    </Card>
  );
}
