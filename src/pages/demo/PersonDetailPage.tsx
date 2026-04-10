import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getHousehold, getNeedsForHousehold, getSignalsForHousehold, getJourneyForHousehold, getVolunteer } from '@/data';
import { NEED_CATEGORIES } from '@/data';
import { NeedsBadgeRow } from '@/components/people/NeedsBadgeRow';
import { RecoveryTimeline } from '@/components/people/RecoveryTimeline';
import { RecoverySignalCard } from '@/components/nri/RecoverySignalCard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { ArrowLeft, Phone, Mail, MapPin, Mic, ClipboardList, UserPlus } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  acute: 'bg-red-100 text-red-800',
  stabilizing: 'bg-amber-100 text-amber-800',
  rebuilding: 'bg-blue-100 text-blue-800',
  recovered: 'bg-green-100 text-green-800',
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'text-red-700',
  high: 'text-orange-700',
  medium: 'text-amber-700',
  low: 'text-slate-600',
};

const NOTE_ICONS: Record<string, string> = {
  voice: 'Mic',
  text: 'Text',
  photo: 'Photo',
};

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { simulateWrite } = useDemoMode();
  const isDesktop = useIsDesktop();

  const household = getHousehold(id || '');
  if (!household) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Household not found.</p>
        <Link to="/demo/app/people" className="text-primary underline text-sm">Back to People</Link>
      </div>
    );
  }

  const needs = getNeedsForHousehold(household.id);
  const signals = getSignalsForHousehold(household.id);
  const journey = getJourneyForHousehold(household.id);
  const volunteer = household.assignedVolunteerId ? getVolunteer(household.assignedVolunteerId) : null;

  // ── Shared sub-sections ──
  const backButton = (
    <Link to="/demo/app/people" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
      <ArrowLeft className="h-4 w-4" /> Back
    </Link>
  );

  const householdHeader = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl font-bold">{household.familyName} Family</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{household.headOfHousehold}</p>
        </div>
        <Badge className={STATUS_STYLES[household.currentStatus]} variant="secondary">
          {household.currentStatus}
        </Badge>
      </div>
      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{household.address}</p>
        <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{household.phone}</p>
        <p>{household.disasterEvent} &middot; {new Date(household.disasterDate).toLocaleDateString()}</p>
      </div>
    </>
  );

  const membersSection = (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-2">Household Members</h3>
      <div className="space-y-2">
        {household.members.map(m => (
          <div key={m.id} className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">{m.name}</span>
              <span className="text-muted-foreground ml-2">({m.relationship})</span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">Age {m.age}</span>
              {m.specialNeeds && (
                <p className="text-xs text-destructive">{m.specialNeeds}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const volunteerSection = volunteer ? (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-2">Assigned Volunteer</h3>
      <Card className="p-3">
        <p className="text-sm font-medium">{volunteer.name}</p>
        <p className="text-xs text-muted-foreground">{volunteer.zone} &middot; {volunteer.availability}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Phone className="h-3 w-3" />{volunteer.phone}
        </p>
      </Card>
    </section>
  ) : null;

  const recoveryJourney = journey ? (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-3">Refuge Journey</h3>
      <RecoveryTimeline journey={journey} />
    </section>
  ) : null;

  const needsSection = (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-2">
        Needs ({needs.filter(n => n.status !== 'met').length} active)
      </h3>
      <NeedsBadgeRow needs={needs.filter(n => n.status !== 'met')} />
      <div className="mt-3 space-y-2">
        {needs.filter(n => n.status !== 'met').map(n => {
          const cat = NEED_CATEGORIES[n.category];
          return (
            <Card key={n.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                  {n.referredTo && (
                    <p className="text-xs text-primary mt-1">Referred to: {n.referredTo}</p>
                  )}
                  {n.whatMatters && (
                    <p className="text-xs text-foreground/70 mt-1.5 italic border-l-2 border-accent/40 pl-2">
                      {n.whatMatters}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="secondary" className={`text-xs ${cat?.color || ''}`}>{n.status}</Badge>
                  <p className={`text-xs mt-1 font-medium ${PRIORITY_STYLES[n.priority]}`}>{n.priority}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );

  const signalsSection = signals.length > 0 ? (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-2">NRI Signals</h3>
      <div className="space-y-3">
        {signals.map(s => <RecoverySignalCard key={s.id} signal={s} />)}
      </div>
    </section>
  ) : null;

  const caseNotesSection = (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-2">Field Notes</h3>
      <div className="space-y-3">
        {household.caseNotes.map(n => (
          <div key={n.id} className="border-l-2 border-border pl-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{n.author}</span>
              <span>&middot;</span>
              <span>{new Date(n.date).toLocaleDateString()}</span>
              <Badge variant="outline" className="text-xs">{NOTE_ICONS[n.type] || n.type}</Badge>
            </div>
            <p className="text-sm text-foreground mt-1">{n.content}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const actionButtons = (
    <>
      <Button size="sm" className="gap-1" onClick={() => simulateWrite('Contact logged')}>
        <Mic className="h-4 w-4" />
        Log Contact
      </Button>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => simulateWrite('Needs updated')}>
        <ClipboardList className="h-4 w-4" />
        Update Needs
      </Button>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => simulateWrite('Volunteer assigned')}>
        <UserPlus className="h-4 w-4" />
        Assign
      </Button>
    </>
  );

  // ── Desktop: two-column layout ──
  if (isDesktop) {
    return (
      <div className="flex min-h-[calc(100vh-105px)]">
        {/* Left sidebar */}
        <div className="w-[380px] shrink-0 bg-muted/30 border-r p-6 sticky top-0 h-[calc(100vh-105px)] overflow-auto">
          {backButton}
          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            {householdHeader}
          </div>
          {membersSection}
          {volunteerSection && (
            <>
              <Separator className="my-4" />
              {volunteerSection}
            </>
          )}
        </div>

        {/* Right main area */}
        <div className="flex-1 overflow-auto">
          {/* Action bar row */}
          <div className="sticky top-0 bg-background border-b px-6 py-3 flex items-center gap-2 z-10">
            {actionButtons}
          </div>

          <div className="p-6 space-y-6">
            {recoveryJourney}
            {recoveryJourney && <Separator />}
            {needsSection}
            {signalsSection && (
              <>
                <Separator />
                {signalsSection}
              </>
            )}
            <Separator />
            {caseNotesSection}
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile: single-column (unchanged) ──
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 bg-primary/5">
        {backButton}
        {householdHeader}
      </div>

      <div className="p-4 space-y-6">
        {membersSection}
        <Separator />
        {recoveryJourney}
        {recoveryJourney && <Separator />}
        {needsSection}
        {signalsSection && (
          <>
            <Separator />
            {signalsSection}
          </>
        )}
        {meaningSection && (
          <>
            <Separator />
            {meaningSection}
          </>
        )}
        <Separator />
        {caseNotesSection}
        {volunteerSection && (
          <>
            <Separator />
            {volunteerSection}
          </>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-3 flex gap-2 z-40">
        <Button size="sm" className="flex-1 gap-1" onClick={() => simulateWrite('Contact logged')}>
          <Mic className="h-4 w-4" />
          Log Contact
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => simulateWrite('Needs updated')}>
          <ClipboardList className="h-4 w-4" />
          Update Needs
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => simulateWrite('Volunteer assigned')}>
          <UserPlus className="h-4 w-4" />
          Assign
        </Button>
      </div>
    </div>
  );
}
