import { Badge } from '@/components/ui/badge';
import type { NeedInstance } from '@/data';
import { NEED_CATEGORIES } from '@/data';

interface NeedsBadgeRowProps {
  needs: NeedInstance[];
}

export function NeedsBadgeRow({ needs }: NeedsBadgeRowProps) {
  if (needs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {needs.map(need => {
        const cat = NEED_CATEGORIES[need.category];
        return (
          <Badge key={need.id} variant="secondary" className={`text-xs ${cat?.color || ''}`}>
            {cat?.label || need.category}
          </Badge>
        );
      })}
    </div>
  );
}
