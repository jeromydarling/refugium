import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { households, volunteers, partners } from '@/data';
import {
  Network,
  Users,
  Link2,
  Star,
  Home,
  Heart,
  Handshake,
  UserCheck,
} from 'lucide-react';

type ConnectionType = 'navigator' | 'partner' | 'host' | 'peer';

interface Connection {
  from: string;
  relation: string;
  to: string;
  type: ConnectionType;
}

interface HouseholdWeb {
  householdId: string;
  familyName: string;
  headOfHousehold: string;
  connections: Connection[];
}

const TYPE_META: Record<ConnectionType, { label: string; color: string; borderColor: string }> = {
  navigator: { label: 'Navigator', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-blue-500' },
  partner: { label: 'Partner', color: 'bg-green-100 text-green-700', borderColor: 'border-l-green-500' },
  host: { label: 'Host', color: 'bg-amber-100 text-amber-700', borderColor: 'border-l-amber-500' },
  peer: { label: 'Peer', color: 'bg-purple-100 text-purple-700', borderColor: 'border-l-purple-500' },
};

function buildConnectionWebs(): HouseholdWeb[] {
  const webs: HouseholdWeb[] = [];

  // Martinez family web
  webs.push({
    householdId: 'hh-001',
    familyName: 'Martinez',
    headOfHousehold: 'Maria Martinez',
    connections: [
      { from: 'Martinez Family', relation: 'navigator', to: 'Sarah Thompson', type: 'navigator' },
      { from: 'Sarah Thompson', relation: 'referred to', to: 'First Baptist Church (shelter, meals)', type: 'partner' },
      { from: 'Martinez Family', relation: 'medication via', to: 'Community Health Center', type: 'partner' },
      { from: 'Martinez Family', relation: 'potential host', to: 'Rodriguez Family', type: 'host' },
    ],
  });

  // Nguyen family web
  webs.push({
    householdId: 'hh-005',
    familyName: 'Nguyen',
    headOfHousehold: 'Thanh Nguyen',
    connections: [
      { from: 'Nguyen Family', relation: 'navigator', to: 'David Park', type: 'navigator' },
      { from: 'David Park', relation: 'coordinated with', to: "Samaritan's Purse (debris removal)", type: 'partner' },
      { from: 'Nguyen Family', relation: 'potential host', to: 'Rodriguez Family', type: 'host' },
      { from: 'Nguyen Family', relation: 'similar situation', to: 'Guidry Family (fishing)', type: 'peer' },
    ],
  });

  // Johnson family web
  webs.push({
    householdId: 'hh-003',
    familyName: 'Johnson',
    headOfHousehold: 'Terrence Johnson',
    connections: [
      { from: 'Johnson Family', relation: 'navigator', to: 'David Park', type: 'navigator' },
      { from: 'Johnson Family', relation: 'FEMA assistance via', to: 'FEMA Disaster Recovery Center', type: 'partner' },
      { from: 'Johnson Family', relation: 'mold remediation by', to: 'Habitat for Humanity', type: 'partner' },
    ],
  });

  // Robinson family web
  webs.push({
    householdId: 'hh-014',
    familyName: 'Robinson',
    headOfHousehold: 'Terrance Robinson',
    connections: [
      { from: 'Robinson Family', relation: 'navigator', to: 'James Wilson', type: 'navigator' },
      { from: 'Robinson Family', relation: 'dialysis at', to: 'Gulf Coast Kidney Center', type: 'partner' },
      { from: 'Robinson Family', relation: 'meals from', to: 'Grace Community Church', type: 'partner' },
      { from: 'Robinson Family', relation: 'neighbor support', to: 'Thompson Family (Biloxi)', type: 'peer' },
    ],
  });

  // Garcia family web
  webs.push({
    householdId: 'hh-006',
    familyName: 'Garcia',
    headOfHousehold: 'Rosa Garcia',
    connections: [
      { from: 'Garcia Family', relation: 'navigator', to: 'Maria Santos', type: 'navigator' },
      { from: 'Maria Santos', relation: 'housing via', to: 'Catholic Charities of Acadiana', type: 'partner' },
      { from: 'Garcia Family', relation: 'furniture from', to: 'St. Vincent de Paul Society', type: 'partner' },
      { from: 'Garcia Family', relation: 'hosted by', to: 'Henderson Family', type: 'host' },
    ],
  });

  // Broussard family web
  webs.push({
    householdId: 'hh-013',
    familyName: 'Broussard',
    headOfHousehold: 'Claire Broussard',
    connections: [
      { from: 'Broussard Family', relation: 'navigator', to: 'Robert Kim', type: 'navigator' },
      { from: 'Broussard Family', relation: 'respite care via', to: 'Catholic Charities of Acadiana', type: 'partner' },
      { from: 'Broussard Family', relation: 'roof repair by', to: 'Habitat for Humanity', type: 'partner' },
    ],
  });

  return webs;
}

export default function GraphPage() {
  const isDesktop = useIsDesktop();

  const webs = useMemo(() => buildConnectionWebs(), []);

  const totalConnections = useMemo(
    () => webs.reduce((sum, w) => sum + w.connections.length, 0),
    [webs],
  );

  const mostConnectedPartner = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const web of webs) {
      for (const conn of web.connections) {
        if (conn.type === 'partner') {
          const name = conn.to.split(' (')[0];
          counts[name] = (counts[name] || 0) + 1;
        }
      }
    }
    let best = '';
    let max = 0;
    for (const [name, count] of Object.entries(counts)) {
      if (count > max) {
        best = name;
        max = count;
      }
    }
    return best;
  }, [webs]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Connections</h1>
          <p className="text-sm text-muted-foreground">
            How families, partners, and volunteers connect
          </p>
        </div>
      </AnimatedSection>

      {/* Stats cards */}
      <AnimatedSection delay={0.1}>
        <div className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-primary">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalConnections}</p>
                <p className="text-xs text-muted-foreground">Total Connections</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-amber-500">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">
                  First Baptist → Martinez
                </p>
                <p className="text-xs text-muted-foreground">Strongest Link</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-green-600">
                <Handshake className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">
                  {mostConnectedPartner}
                </p>
                <p className="text-xs text-muted-foreground">Most Connected Partner</p>
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* Legend */}
      <AnimatedSection delay={0.15}>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(TYPE_META) as [ConnectionType, typeof TYPE_META[ConnectionType]][]).map(
            ([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${meta.color.split(' ')[0]}`} />
                <span className="text-xs text-muted-foreground">{meta.label}</span>
              </div>
            ),
          )}
        </div>
      </AnimatedSection>

      {/* Connection webs by household */}
      <AnimatedSection delay={0.2}>
        <StaggerList className="space-y-4">
          {webs.map((web) => (
            <Card key={web.householdId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  {web.familyName} Family
                  <span className="text-xs font-normal text-muted-foreground">
                    ({web.headOfHousehold})
                  </span>
                  <Badge variant="secondary" className="text-[10px] ml-auto">
                    {web.connections.length} connections
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {web.connections.map((conn, i) => {
                  const meta = TYPE_META[conn.type];
                  return (
                    <div
                      key={i}
                      className={`border-l-[3px] ${meta.borderColor} rounded-r-md bg-muted/30 px-3 py-2`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">
                          {conn.from}
                        </span>
                        <span className="text-[10px] text-muted-foreground italic">
                          {conn.relation}
                        </span>
                        <Link2 className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs font-semibold text-foreground">
                          {conn.to}
                        </span>
                        <Badge className={`text-[9px] ml-auto border-0 ${meta.color}`}>
                          {meta.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
