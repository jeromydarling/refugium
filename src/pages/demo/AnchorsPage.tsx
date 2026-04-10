import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StaggerList } from '@/components/shared/StaggerList';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { partners } from '@/data';
import {
  Building2,
  Church,
  Home,
  Landmark,
  Store,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
  Gauge,
  StickyNote,
} from 'lucide-react';

const TYPE_META: Record<string, { label: string; icon: typeof Building2; color: string }> = {
  church: { label: 'Church', icon: Church, color: 'bg-purple-100 text-purple-700' },
  nonprofit: { label: 'Nonprofit', icon: Building2, color: 'bg-blue-100 text-blue-700' },
  government: { label: 'Government', icon: Landmark, color: 'bg-slate-100 text-slate-700' },
  host_family: { label: 'Host Family', icon: Home, color: 'bg-amber-100 text-amber-700' },
  business: { label: 'Business', icon: Store, color: 'bg-green-100 text-green-700' },
};

const TRUST_META: Record<string, { label: string; color: string }> = {
  verified: { label: 'Verified', color: 'bg-green-100 text-green-700' },
  established: { label: 'Established', color: 'bg-blue-100 text-blue-700' },
  new: { label: 'New', color: 'bg-amber-100 text-amber-700' },
};

const CAPACITY_META: Record<string, { label: string; color: string }> = {
  available: { label: 'Available', color: 'text-green-600' },
  limited: { label: 'Limited', color: 'text-amber-600' },
  full: { label: 'Full', color: 'text-red-600' },
};

// Mock relationship scores seeded by partner id
function getRelationshipScore(id: string): number {
  const scores: Record<string, number> = {
    'p-001': 92,
    'p-002': 88,
    'p-003': 85,
    'p-004': 74,
    'p-005': 95,
    'p-006': 68,
    'p-007': 90,
    'p-008': 72,
    'p-009': 82,
    'p-010': 65,
    'p-011': 60,
    'p-012': 78,
    'p-013': 70,
    'p-014': 86,
    'p-015': 63,
  };
  return scores[id] ?? 75;
}

export default function AnchorsPage() {
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  // Pick 6 anchor partners to showcase
  const anchorPartners = useMemo(
    () => partners.filter((p) => p.trustLevel === 'verified').slice(0, 6),
    [],
  );

  const stats = useMemo(() => {
    const total = partners.length;
    const verified = partners.filter((p) => p.trustLevel === 'verified').length;
    const availableCount = partners.filter((p) => p.capacity === 'available').length;
    const capacityPct = Math.round((availableCount / total) * 100);
    return { total, verified, capacityPct };
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Anchors</h1>
          <p className="text-sm text-muted-foreground">
            Organizations that are pillars of your disaster response
          </p>
        </div>
      </AnimatedSection>

      {/* Stats row */}
      <AnimatedSection delay={0.1}>
        <div className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Partners</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.verified}</p>
                <p className="text-xs text-muted-foreground">Verified Partners</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-amber-500">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.capacityPct}%</p>
                <p className="text-xs text-muted-foreground">Available Capacity</p>
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* Partner grid */}
      <AnimatedSection delay={0.2}>
        <StaggerList className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {anchorPartners.map((partner) => {
            const typeMeta = TYPE_META[partner.type];
            const trustMeta = TRUST_META[partner.trustLevel];
            const capMeta = CAPACITY_META[partner.capacity];
            const score = getRelationshipScore(partner.id);
            const TypeIcon = typeMeta.icon;

            return (
              <Card key={partner.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1.5 rounded-md ${typeMeta.color}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-semibold truncate">
                        {partner.name}
                      </CardTitle>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${trustMeta.color} border-0`}>
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {trustMeta.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Type & capacity */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {typeMeta.label}
                    </Badge>
                    <span className={`text-xs font-medium ${capMeta.color}`}>
                      {capMeta.label}
                    </span>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1">
                    {partner.services.map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px] font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  {/* Relationship score */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3" /> Relationship Score
                      </span>
                      <span className="font-semibold">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>

                  {/* Notes */}
                  {partner.notes && (
                    <div className="bg-muted/50 rounded-md p-2.5">
                      <div className="flex items-start gap-1.5">
                        <StickyNote className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                          {partner.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {partner.contactPerson}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => simulateWrite('Contact logged')}
                    >
                      Log Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
