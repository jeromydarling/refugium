import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { households, volunteers, signals } from '@/data';
import {
  MapPin,
  Users,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Activity,
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  region: string;
  householdCount: number;
  volunteerCount: number;
  coverage: number; // percentage
  status: 'good' | 'needs_attention' | 'critical';
  activeAlerts: number;
  alertDetails: string[];
}

const ZONE_DEFS = [
  { id: 'z1', name: 'Zone 1', region: 'Baton Rouge', zoneLabel: 'Zone 1 - Baton Rouge' },
  { id: 'z2', name: 'Zone 2', region: 'New Orleans', zoneLabel: 'Zone 2 - New Orleans' },
  { id: 'z3', name: 'Zone 3', region: 'Lafayette', zoneLabel: 'Zone 3 - Lafayette' },
  { id: 'z4', name: 'Zone 4', region: 'Gulf Coast', zoneLabel: 'Zone 4 - Gulf Coast' },
  { id: 'z5', name: 'Zone 5', region: 'Mississippi', zoneLabel: 'Zone 5 - Mississippi' },
];

// Map households to zones by geographic approximation
function getHouseholdZone(lat: number, lng: number): string {
  // Baton Rouge area
  if (lat >= 30.35 && lat <= 30.55 && lng >= -91.3 && lng <= -91.0) return 'Zone 1 - Baton Rouge';
  // Shreveport (also Zone 1)
  if (lat >= 32.0) return 'Zone 1 - Baton Rouge';
  // New Orleans metro area
  if (lat >= 29.85 && lat <= 30.1 && lng >= -90.3 && lng <= -89.6) return 'Zone 2 - New Orleans';
  // Lafayette area
  if (lat >= 30.15 && lat <= 30.3 && lng >= -92.2 && lng <= -91.8) return 'Zone 3 - Lafayette';
  // Gulf Coast (Slidell, Port Arthur, Lake Charles)
  if (lng <= -92.5 || (lat >= 30.2 && lat <= 30.35 && lng >= -89.9 && lng <= -89.6)) return 'Zone 4 - Gulf Coast';
  // Mississippi (Biloxi, Hattiesburg)
  if (lng >= -89.5 || (lat >= 30.3 && lat <= 31.5 && lng >= -89.4)) return 'Zone 5 - Mississippi';
  // Houston area -> Gulf Coast
  if (lat < 30.0 && lng < -93.0) return 'Zone 4 - Gulf Coast';
  // Fallback
  return 'Zone 4 - Gulf Coast';
}

function buildZones(): Zone[] {
  return ZONE_DEFS.map((def) => {
    const zoneHouseholds = households.filter(
      (hh) => getHouseholdZone(hh.lat, hh.lng) === def.zoneLabel,
    );
    const zoneVolunteers = volunteers.filter((v) => v.zone === def.zoneLabel);

    const hhCount = zoneHouseholds.length;
    const volCount = zoneVolunteers.length;

    // Coverage: ideal is 1 volunteer per 2 households
    const idealVols = Math.ceil(hhCount / 2);
    const coverage = idealVols === 0 ? 100 : Math.min(100, Math.round((volCount / idealVols) * 100));

    // Determine status
    let status: Zone['status'] = 'good';
    if (coverage < 50) status = 'critical';
    else if (coverage < 75) status = 'needs_attention';

    // Active alerts from signals tied to households in this zone
    const zoneHouseholdIds = new Set(zoneHouseholds.map((hh) => hh.id));
    const zoneAlerts = signals.filter(
      (s) =>
        (s.householdId && zoneHouseholdIds.has(s.householdId)) ||
        (s.householdId === null &&
          s.summary.toLowerCase().includes(def.region.toLowerCase())),
    );
    // Also include zone-level signals mentioning the zone
    const zoneSpecificAlerts = signals.filter(
      (s) =>
        s.householdId === null &&
        (s.summary.toLowerCase().includes(def.zoneLabel.toLowerCase()) ||
          s.title.toLowerCase().includes(`zone ${def.id.replace('z', '')}`)),
    );
    const allAlerts = [...new Set([...zoneAlerts, ...zoneSpecificAlerts])];
    const alertDetails = allAlerts
      .filter((s) => s.kind !== 'celebration')
      .slice(0, 3)
      .map((s) => s.title);

    return {
      id: def.id,
      name: def.name,
      region: def.region,
      householdCount: hhCount,
      volunteerCount: volCount,
      coverage,
      status,
      activeAlerts: alertDetails.length,
      alertDetails,
    };
  });
}

const STATUS_META: Record<string, { label: string; color: string; badgeColor: string; Icon: typeof CheckCircle2 }> = {
  good: {
    label: 'Good Coverage',
    color: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-700',
    Icon: CheckCircle2,
  },
  needs_attention: {
    label: 'Needs Attention',
    color: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-700',
    Icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    color: 'text-red-600',
    badgeColor: 'bg-red-100 text-red-700',
    Icon: ShieldAlert,
  },
};

function progressColor(status: Zone['status']): string {
  if (status === 'good') return '[&>div]:bg-green-500';
  if (status === 'needs_attention') return '[&>div]:bg-amber-500';
  return '[&>div]:bg-red-500';
}

export default function ZonesPage() {
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  const zones = useMemo(() => buildZones(), []);

  const totalHH = zones.reduce((s, z) => s + z.householdCount, 0);
  const totalVol = zones.reduce((s, z) => s + z.volunteerCount, 0);
  const criticalCount = zones.filter((z) => z.status === 'critical').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Zones</h1>
          <p className="text-sm text-muted-foreground">
            Geographic areas of your disaster response
          </p>
        </div>
      </AnimatedSection>

      {/* Summary stats */}
      <AnimatedSection delay={0.1}>
        <div className={`grid gap-4 ${isDesktop ? 'grid-cols-4' : 'grid-cols-2'}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{zones.length}</p>
                <p className="text-xs text-muted-foreground">Active Zones</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-blue-500">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalHH}</p>
                <p className="text-xs text-muted-foreground">Households</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-green-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalVol}</p>
                <p className="text-xs text-muted-foreground">Volunteers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical Zones</p>
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* Zone cards */}
      <AnimatedSection delay={0.2}>
        <StaggerList className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {zones.map((zone) => {
            const statusMeta = STATUS_META[zone.status];
            const StatusIcon = statusMeta.Icon;

            return (
              <Card key={zone.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${statusMeta.color}`} />
                      <CardTitle className="text-sm font-semibold">
                        {zone.name} — {zone.region}
                      </CardTitle>
                    </div>
                    <Badge className={`text-[10px] border-0 shrink-0 ${statusMeta.badgeColor}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusMeta.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Household/volunteer counts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-md p-2.5 text-center">
                      <p className="text-lg font-bold text-foreground">{zone.householdCount}</p>
                      <p className="text-[10px] text-muted-foreground">Households</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2.5 text-center">
                      <p className="text-lg font-bold text-foreground">{zone.volunteerCount}</p>
                      <p className="text-[10px] text-muted-foreground">Volunteers</p>
                    </div>
                  </div>

                  {/* Coverage bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Coverage</span>
                      <span className={`font-semibold ${statusMeta.color}`}>
                        {zone.coverage}%
                      </span>
                    </div>
                    <Progress
                      value={zone.coverage}
                      className={`h-2 ${progressColor(zone.status)}`}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Target: 1 volunteer per 2 households
                    </p>
                  </div>

                  {/* Active alerts */}
                  {zone.activeAlerts > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Activity className="h-3 w-3 text-amber-500" />
                        Active Alerts ({zone.activeAlerts})
                      </div>
                      {zone.alertDetails.map((alert, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
                        >
                          <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                          <span>{alert}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {zone.activeAlerts === 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      No active alerts
                    </div>
                  )}

                  {/* Action */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={() => simulateWrite(`Viewing ${zone.name} details`)}
                  >
                    View Zone Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
