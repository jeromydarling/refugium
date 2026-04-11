import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getHousehold, getNeedsForHousehold, getSignalsForHousehold, getJourneyForHousehold, getVolunteer, getDonationsForHousehold, getSharedNotesForHousehold } from '@/data';
import { NEED_CATEGORIES, volunteers } from '@/data';
import { NeedsBadgeRow } from '@/components/people/NeedsBadgeRow';
import { RenewalTrail } from '@/components/people/RenewalTrail';
import { RecoverySignalCard } from '@/components/nri/RecoverySignalCard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { usePrintMode } from '@/hooks/usePrintMode';
import HouseholdResourceMap from '@/components/map/HouseholdResourceMap';
import { partners } from '@/data';
import { toast } from 'sonner';
import {
  ArrowLeft, Phone, MapPin, Compass, Bus,
  ChevronDown, Mic, ClipboardList, UserPlus,
  BookOpen, CheckCircle2, Share2, ExternalLink, Printer,
  MessageSquareShare, Building2, Plus, Heart,
} from 'lucide-react';

// ── Stage label map (mirrors RenewalTrail STAGES) ──
const STAGE_LABELS: Record<string, string> = {
  intake: 'Intake',
  assessment: 'Assessment',
  stabilization: 'Stabilization',
  repair_rebuild: 'Rebuild',
  closure: 'Restored',
};

const STATUS_STYLES: Record<string, string> = {
  acute: 'bg-red-50 text-red-800',
  stabilizing: 'bg-amber-50 text-amber-800',
  rebuilding: 'bg-sky-50 text-sky-800',
  recovered: 'bg-emerald-50 text-emerald-800',
};

const PRIORITY_DOTS: Record<string, string> = {
  critical: 'bg-red-400',
  high: 'bg-amber-400',
  medium: 'bg-stone-400',
  low: 'bg-slate-300',
};

const STATUS_BADGE_STYLE: Record<string, string> = {
  unmet: 'bg-red-50 text-red-800',
  in_progress: 'bg-amber-50 text-amber-800',
  met: 'bg-emerald-50 text-emerald-800',
};

// ── Hardcoded next-step cards for the demo ──
const NEXT_STEPS = [
  {
    id: 'ns-1',
    title: 'Submit FEMA appeal documentation',
    destination: 'FEMA Disaster Recovery Center — 4.2 mi',
    transit: 'Bus 42 from Main & 3rd (25 min)',
    whatToBring: 'Photo ID, damage photos, denial letter',
    urgency: 'Today' as const,
  },
  {
    id: 'ns-2',
    title: 'Pick up prescription refills',
    destination: 'CVS Pharmacy on Oak Blvd — 1.1 mi',
    transit: 'Bus 12 from Elm & Pine (10 min)',
    whatToBring: 'Insurance card, prescription list',
    urgency: 'Today' as const,
  },
  {
    id: 'ns-3',
    title: 'Meet with Habitat for Humanity coordinator',
    destination: 'Community Resource Hub — 2.8 mi',
    transit: 'Bus 7 from downtown transit center (18 min)',
    whatToBring: 'Home inspection report, repair estimates',
    urgency: 'This Week' as const,
  },
];

// ── Framer variants ──
const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { simulateWrite } = useDemoMode();
  const isDesktop = useIsDesktop();
  const isPrinting = usePrintMode();

  const [showLogContact, setShowLogContact] = useState(false);
  const [contactType, setContactType] = useState<'Visit' | 'Call' | 'Text' | 'Email'>('Visit');
  const [contactNotes, setContactNotes] = useState('');
  const [showAssignPicker, setShowAssignPicker] = useState(false);

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
  const householdDonations = getDonationsForHousehold(household.id);
  const householdSharedNotes = getSharedNotesForHousehold(household.id);

  const activeNeeds = needs.filter(n => n.status !== 'met');
  const needsWithWhatMatters = needs.filter(n => n.whatMatters);

  // Determine current stage label
  const currentStage = journey?.stages.find(s => s.status === 'active');
  const currentStageName = currentStage ? STAGE_LABELS[currentStage.stage] || currentStage.stage : null;

  // Completed stages for "Trail Behind"
  const completedStages = journey?.stages.filter(s => s.status === 'completed') || [];

  const activeVolunteers = volunteers.filter(v => v.status === 'active');

  const handleLogContactSave = () => {
    simulateWrite(`${contactType} logged${contactNotes ? ': ' + contactNotes : ''}`);
    setShowLogContact(false);
    setContactNotes('');
    setContactType('Visit');
  };

  const handleAssignVolunteer = (volunteerId: string) => {
    const vol = volunteers.find(v => v.id === volunteerId);
    if (vol) {
      simulateWrite(`Assigned to ${vol.name}`);
    }
    setShowAssignPicker(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Link copied');
  };

  const handleCopySurvivorLink = () => {
    const url = `${window.location.origin}/r/${household.id}`;
    navigator.clipboard.writeText(url);
    toast('Survivor link copied');
  };

  // ── Action buttons (shared) ──
  const actionButtons = (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setShowLogContact(prev => !prev)}>
        <Mic className="h-4 w-4" />
        Log Contact
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => simulateWrite('Needs updated')}>
        <ClipboardList className="h-4 w-4" />
        Update Needs
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowAssignPicker(prev => !prev)}>
        <UserPlus className="h-4 w-4" />
        Assign
      </Button>
    </>
  );

  // ── Log Contact inline form ──
  const logContactForm = showLogContact && (
    <div className="parchment-card p-4 space-y-3">
      <p className="text-sm font-semibold">Log Contact</p>
      <div className="flex gap-1.5 flex-wrap">
        {(['Visit', 'Call', 'Text', 'Email'] as const).map(type => (
          <Button
            key={type}
            size="sm"
            variant={contactType === type ? 'default' : 'outline'}
            className="text-xs"
            onClick={() => setContactType(type)}
          >
            {type}
          </Button>
        ))}
      </div>
      <Textarea
        value={contactNotes}
        onChange={e => setContactNotes(e.target.value)}
        placeholder="Quick notes..."
        rows={3}
        className="text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleLogContactSave}>Save</Button>
        <Button size="sm" variant="ghost" onClick={() => setShowLogContact(false)}>Cancel</Button>
      </div>
    </div>
  );

  // ── Assign volunteer picker ──
  const assignPicker = showAssignPicker && (
    <div className="parchment-card p-4 space-y-3">
      <p className="text-sm font-semibold">Assign Volunteer</p>
      <Select onValueChange={handleAssignVolunteer}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a volunteer..." />
        </SelectTrigger>
        <SelectContent>
          {activeVolunteers.map(v => (
            <SelectItem key={v.id} value={v.id}>
              {v.name} — {v.zone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" onClick={() => setShowAssignPicker(false)}>Cancel</Button>
    </div>
  );

  return (
    <div className={isDesktop ? '' : 'pb-24'}>
      {/* ═══════════════════════════════════════════════
          1. HEADER — Parchment background
         ═══════════════════════════════════════════════ */}
      <div className="parchment px-4 pt-4 pb-5 sm:px-6">
        <div className={isDesktop ? 'max-w-4xl mx-auto' : ''}>
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/demo/app/people"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={handleCopyLink}>
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={handleCopySurvivorLink}>
                <ExternalLink className="h-3.5 w-3.5" />
                Survivor Link
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => window.print()} aria-label="Print">
                <Printer className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight">
                {household.familyName} Family
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{household.headOfHousehold}</p>
            </div>
            <Badge className={STATUS_STYLES[household.currentStatus]} variant="secondary">
              {household.currentStatus}
            </Badge>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{household.address}</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{household.phone}</span>
            <span>{household.disasterEvent} &middot; {new Date(household.disasterDate).toLocaleDateString()}</span>
          </div>

          {/* Desktop: action buttons inline in header */}
          {isDesktop && (
            <div className="mt-4 flex items-center gap-2">
              {actionButtons}
            </div>
          )}

          {/* Inline forms (desktop) */}
          {isDesktop && (
            <div className="mt-3 space-y-3">
              {logContactForm}
              {assignPicker}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          Main content column
         ═══════════════════════════════════════════════ */}
      <div className={`px-4 sm:px-6 py-6 space-y-8 ${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>

        {/* ═══════════════════════════════════════════════
            2. THE TRAIL — Hero section
           ═══════════════════════════════════════════════ */}
        {journey && (
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="parchment rounded-xl p-4 border border-[hsl(var(--ignatian-border))]">
              <RenewalTrail journey={journey} />
            </div>
            {currentStageName && (
              <p className="text-center mt-3 font-serif italic text-sm text-[hsl(var(--ignatian-brown))]">
                You are here: {currentStageName}
              </p>
            )}
          </motion.section>
        )}

        {/* ═══════════════════════════════════════════════
            2b. RESOURCE MAP — "Look at all this help"
           ═══════════════════════════════════════════════ */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-[hsl(var(--ignatian-brown))]" />
            <h2 className="font-serif text-base font-semibold">Resources nearby</h2>
            <span className="text-xs text-[hsl(var(--ignatian-muted))]">
              {partners.length} organizations ready to help
            </span>
          </div>
          <HouseholdResourceMap
            householdName={`${household.familyName} Family`}
            householdLat={household.lat}
            householdLng={household.lng}
            activePartnerIds={needs.filter(n => n.referredTo).map((_, i) => partners[i]?.id).filter(Boolean)}
            partners={partners}
          />
        </motion.section>

        {/* ═══════════════════════════════════════════════
            3. NEXT STEPS — Primary content
           ═══════════════════════════════════════════════ */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-[hsl(var(--ignatian-brown))]" />
            <h2 className="font-serif text-lg font-semibold">Next Steps</h2>
          </div>

          <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="visible">
            {NEXT_STEPS.map(step => (
              <motion.div
                key={step.id}
                variants={sectionVariant}
                className={`parchment-card p-4 ${
                  step.urgency === 'Today' ? 'border-l-4 border-l-[hsl(15_60%_50%)]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {step.destination}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Bus className="h-3 w-3 shrink-0" />
                      {step.transit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">Bring:</span> {step.whatToBring}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 text-xs ${
                      step.urgency === 'Today'
                        ? 'bg-red-50 text-red-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {step.urgency}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            4. WHAT MATTERS — Warm context
           ═══════════════════════════════════════════════ */}
        {needsWithWhatMatters.length > 0 && (
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
              Field observations
            </p>
            <div className="border-l-3 border-l-amber-400/60 pl-4 space-y-3">
              {needsWithWhatMatters.map(n => (
                <p key={n.id} className="field-note">
                  {n.whatMatters}
                </p>
              ))}
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════════════════════════
            5. ACTIVE NEEDS — Compact
           ═══════════════════════════════════════════════ */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="font-serif text-lg font-semibold mb-3">
            Active Needs
            <span className="text-sm font-normal text-muted-foreground ml-2">({activeNeeds.length})</span>
          </h2>

          <NeedsBadgeRow needs={activeNeeds} />

          <div className="mt-3 space-y-1.5">
            {activeNeeds.map(n => {
              const cat = NEED_CATEGORIES[n.category];
              return (
                <NeedRow key={n.id} need={n} catColor={cat?.color} forceOpen={isPrinting} />
              );
            })}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            6. NRI SIGNALS — Subtle
           ═══════════════════════════════════════════════ */}
        {signals.length > 0 && (
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
              NRI noticed
            </p>
            <div className="space-y-3">
              {signals.map(s => <RecoverySignalCard key={s.id} signal={s} />)}
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════════════════════════
            6b. SHARED NOTES — Inter-org coordination
           ═══════════════════════════════════════════════ */}
        {householdSharedNotes.length > 0 && (
          <SharedNotesSection notes={householdSharedNotes} forceOpen={isPrinting} />
        )}

        {/* ═══════════════════════════════════════════════
            7. TRAIL BEHIND — Collapsible
           ═══════════════════════════════════════════════ */}
        {completedStages.length > 0 && (
          <TrailBehind stages={completedStages} forceOpen={isPrinting} />
        )}

        {/* ═══════════════════════════════════════════════
            8. HOUSEHOLD & SUPPORT — Collapsible
           ═══════════════════════════════════════════════ */}
        <HouseholdSupport
          household={household}
          volunteer={volunteer}
          donations={householdDonations}
          forceOpen={isPrinting}
        />
      </div>

      {/* ═══════════════════════════════════════════════
          9. ACTION BAR — Mobile sticky bottom
         ═══════════════════════════════════════════════ */}
      {!isDesktop && (
        <>
          {/* Inline forms (mobile) — above the action bar */}
          {(showLogContact || showAssignPicker) && (
            <div className="fixed bottom-32 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-3 z-40 space-y-3">
              {logContactForm}
              {assignPicker}
            </div>
          )}
          <div className="fixed bottom-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-3 flex gap-2 z-40 action-bar">
            <Button size="sm" className="flex-1 gap-1" onClick={() => setShowLogContact(prev => !prev)}>
              <Mic className="h-4 w-4" />
              Log Contact
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => simulateWrite('Needs updated')}>
              <ClipboardList className="h-4 w-4" />
              Update Needs
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setShowAssignPicker(prev => !prev)}>
              <UserPlus className="h-4 w-4" />
              Assign
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   NeedRow — compact collapsible need row
   ───────────────────────────────────────────────────── */

interface NeedRowProps {
  need: ReturnType<typeof getNeedsForHousehold>[number];
  catColor?: string;
  forceOpen?: boolean;
}

function NeedRow({ need, catColor, forceOpen }: NeedRowProps) {
  const [open, setOpen] = useState(false);
  const isOpen = open || !!forceOpen;

  return (
    <Collapsible open={isOpen} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full text-left">
        <div className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
          {/* Priority dot */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOTS[need.priority]}`} />
          {/* Title */}
          <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
            {need.title}
          </span>
          {/* Referred to */}
          {need.referredTo && (
            <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[140px]">
              {need.referredTo}
            </span>
          )}
          {/* Status badge */}
          <Badge variant="secondary" className={`text-[10px] shrink-0 ${STATUS_BADGE_STYLE[need.status] || ''}`}>
            {need.status === 'in_progress' ? 'In Progress' : need.status}
          </Badge>
          {/* Expand chevron */}
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform print:hidden ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="pl-7 pr-3 pb-3 space-y-2">
          <p className="text-xs text-muted-foreground">{need.description}</p>
          {need.referredTo && (
            <p className="text-xs text-primary">Referred to: {need.referredTo}</p>
          )}
          {need.whatMatters && (
            <div className="border-l-2 border-amber-400/50 pl-2.5 mt-1.5">
              <p className="field-note text-xs">{need.whatMatters}</p>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">
            Updated {new Date(need.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ─────────────────────────────────────────────────────
   SharedNotesSection — Inter-org coordination notes
   ───────────────────────────────────────────────────── */

const ORG_COLORS: Record<string, string> = {
  'Catholic Charities of Acadiana': 'bg-violet-50 text-violet-800 border-violet-200',
  'Red Cross - Greater New Orleans': 'bg-red-50 text-red-800 border-red-200',
  'Habitat for Humanity Greater Baton Rouge': 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

function SharedNotesSection({ notes, forceOpen }: { notes: ReturnType<typeof getSharedNotesForHousehold>; forceOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const isOpen = open || !!forceOpen;
  const { simulateWrite } = useDemoMode();

  return (
    <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Collapsible open={isOpen} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full text-left">
          <div className="flex items-center gap-2 cursor-pointer group">
            <MessageSquareShare className="h-4 w-4 text-sky-600" />
            <h2 className="font-serif text-lg font-semibold">Shared Notes</h2>
            <Badge variant="secondary" className="text-[10px] bg-sky-50 text-sky-700">
              {notes.length}
            </Badge>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform print:hidden ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 ml-6">
            Visible to partner organizations
          </p>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4 space-y-3">
            {notes.map(note => {
              const orgStyle = ORG_COLORS[note.orgName] || 'bg-stone-50 text-stone-800 border-stone-200';
              return (
                <div
                  key={note.id}
                  className="border-l-3 border-l-sky-400/60 bg-sky-50/30 rounded-r-lg pl-4 pr-3 py-3"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Badge variant="outline" className={`text-[10px] ${orgStyle}`}>
                      <Building2 className="h-2.5 w-2.5 mr-1" />
                      {note.orgName}
                    </Badge>
                    <span className="text-xs font-medium text-foreground">{note.authorName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(note.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                </div>
              );
            })}

            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 mt-2"
              onClick={() => simulateWrite('Shared note added')}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Note
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────
   TrailBehind — completed journey stages
   ───────────────────────────────────────────────────── */

interface TrailBehindProps {
  stages: {
    stage: string;
    status: string;
    date?: string;
    notes?: string;
  }[];
}

function TrailBehind({ stages, forceOpen }: TrailBehindProps & { forceOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const isOpen = open || !!forceOpen;

  return (
    <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Collapsible open={isOpen} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full text-left">
          <div className="flex items-center gap-2 cursor-pointer group">
            <BookOpen className="h-4 w-4 text-[hsl(var(--ignatian-brown))]" />
            <h2 className="font-serif text-lg font-semibold">Trail Behind</h2>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform print:hidden ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4 space-y-4 border-l-2 border-[hsl(var(--ignatian-border))] ml-2 pl-4">
            {stages.map((s, i) => (
              <div key={i} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[hsl(25_35%_50%)] border-2 border-[hsl(var(--ignatian-cream))]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-semibold text-[hsl(var(--ignatian-brown))]">
                      {STAGE_LABELS[s.stage] || s.stage}
                    </span>
                    {s.date && (
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700/60" />
                  </div>
                  {s.notes && (
                    <p className="font-serif italic text-sm text-[hsl(var(--ignatian-brown))] opacity-80 mt-1 leading-relaxed">
                      {s.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────
   HouseholdSupport — members, volunteer, donations, field notes
   ───────────────────────────────────────────────────── */

interface HouseholdSupportProps {
  household: NonNullable<ReturnType<typeof getHousehold>>;
  volunteer: ReturnType<typeof getVolunteer> | null;
  donations: ReturnType<typeof getDonationsForHousehold>;
}

const DONATION_TYPE_BADGE: Record<string, string> = {
  monetary: 'bg-emerald-50 text-emerald-800',
  in_kind: 'bg-sky-50 text-sky-800',
  service: 'bg-violet-50 text-violet-800',
};

function HouseholdSupport({ household, volunteer, donations, forceOpen }: HouseholdSupportProps & { forceOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const isOpen = open || !!forceOpen;

  return (
    <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Collapsible open={isOpen} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full text-left">
          <div className="flex items-center gap-2 cursor-pointer">
            <h2 className="font-serif text-lg font-semibold">Household &amp; Support</h2>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform print:hidden ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4 space-y-5">
            {/* Members */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                Members
              </p>
              <div className="space-y-2">
                {household.members.map(m => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted-foreground ml-2">({m.relationship})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground text-xs">Age {m.age}</span>
                      {m.specialNeeds && (
                        <p className="text-xs text-destructive">{m.specialNeeds}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer */}
            {volunteer && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                  Assigned Volunteer
                </p>
                <div className="parchment-card p-3">
                  <p className="text-sm font-medium">{volunteer.name}</p>
                  <p className="text-xs text-muted-foreground">{volunteer.zone} &middot; {volunteer.availability}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />{volunteer.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Donations received */}
            {donations.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
                  <Heart className="h-3 w-3" />
                  Donations Received
                </p>
                <div className="space-y-2">
                  {donations.map(d => (
                    <div key={d.id} className="parchment-card p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{d.donorName}</span>
                        <Badge variant="secondary" className={`text-[10px] ${DONATION_TYPE_BADGE[d.type] || ''}`}>
                          {d.type === 'in_kind' ? 'In-Kind' : d.type === 'service' ? 'Service' : 'Monetary'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{d.purpose}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        {d.type === 'monetary' && (
                          <span className="font-semibold text-emerald-700">${d.amount.toLocaleString()}</span>
                        )}
                        {d.type === 'in_kind' && d.amount > 0 && (
                          <span className="font-semibold text-sky-700">~${d.amount.toLocaleString()} value</span>
                        )}
                        <span>{new Date(d.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Field Notes */}
            {household.caseNotes.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                  Field Notes
                </p>
                <div className="space-y-3">
                  {household.caseNotes.map(n => (
                    <div key={n.id} className="border-l-2 border-[hsl(var(--ignatian-border))] pl-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{n.author}</span>
                        <span>&middot;</span>
                        <span>{new Date(n.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-[10px]">{n.type}</Badge>
                      </div>
                      <p className="text-sm text-foreground mt-1">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.section>
  );
}
