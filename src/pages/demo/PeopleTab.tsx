import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { HouseholdCard } from '@/components/people/HouseholdCard';
import { households, getNeedsForHousehold, getSignalsForHousehold } from '@/data';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Search } from 'lucide-react';
import { StaggerList } from '@/components/shared/StaggerList';

const STATUS_ORDER: Record<string, number> = { acute: 0, stabilizing: 1, rebuilding: 2, recovered: 3 };

const STATUS_DOT_COLORS: Record<string, string> = {
  acute: 'bg-red-400',
  stabilizing: 'bg-amber-400',
  rebuilding: 'bg-sky-400',
  recovered: 'bg-emerald-400',
};

const STATUS_LABELS: Record<string, string> = {
  acute: 'Acute',
  stabilizing: 'Stabilizing',
  rebuilding: 'Rebuilding',
  recovered: 'Recovered',
};

export default function PeopleTab() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return households
      .filter(h => !q || h.familyName.toLowerCase().includes(q) || h.headOfHousehold.toLowerCase().includes(q))
      .sort((a, b) => (STATUS_ORDER[a.currentStatus] ?? 9) - (STATUS_ORDER[b.currentStatus] ?? 9));
  }, [search]);

  // Compute status counts for KPI cards
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { acute: 0, stabilizing: 0, rebuilding: 0, recovered: 0 };
    households.forEach(h => {
      if (counts[h.currentStatus] !== undefined) {
        counts[h.currentStatus]++;
      }
    });
    return counts;
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Desktop KPI summary row */}
      {isDesktop && (
        <div className="grid grid-cols-4 gap-4">
          {(['acute', 'stabilizing', 'rebuilding', 'recovered'] as const).map(status => (
            <Card key={status} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_COLORS[status]}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {STATUS_LABELS[status]}
                </span>
              </div>
              <p className="text-2xl font-bold">{statusCounts[status]}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search households..."
          className="pl-9"
        />
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} Households</p>

      <StaggerList className={isDesktop ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {filtered.map(h => {
          const unmet = getNeedsForHousehold(h.id).filter(n => n.status === 'unmet');
          const sigs = getSignalsForHousehold(h.id);
          return (
            <HouseholdCard
              key={h.id}
              household={h}
              needCount={unmet.length}
              hasSignals={sigs.length > 0}
              onClick={() => navigate(`/demo/app/people/${h.id}`)}
            />
          );
        })}
      </StaggerList>
    </div>
  );
}
