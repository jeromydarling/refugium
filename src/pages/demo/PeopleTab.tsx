import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { HouseholdCard } from '@/components/people/HouseholdCard';
import { households, getNeedsForHousehold, getSignalsForHousehold } from '@/data';
import { Search } from 'lucide-react';

const STATUS_ORDER: Record<string, number> = { acute: 0, stabilizing: 1, rebuilding: 2, recovered: 3 };

export default function PeopleTab() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return households
      .filter(h => !q || h.familyName.toLowerCase().includes(q) || h.headOfHousehold.toLowerCase().includes(q))
      .sort((a, b) => (STATUS_ORDER[a.currentStatus] ?? 9) - (STATUS_ORDER[b.currentStatus] ?? 9));
  }, [search]);

  return (
    <div className="p-4 space-y-4">
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

      <div className="space-y-3">
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
      </div>
    </div>
  );
}
