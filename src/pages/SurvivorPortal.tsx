/**
 * Survivor Portal — "Your Map to Renewal"
 *
 * Accessed via secret link: /r/:householdId
 * No login, no auth, no account. Just a warm, hopeful view of
 * one family's recovery journey with resources and self-reporting.
 *
 * What they see: trail position, resource map, navigation steps, self-report.
 * What they don't see: other families, navigator notes, NRI signals, admin.
 */

import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getHousehold, getNeedsForHousehold, getJourneyForHousehold, partners } from '@/data';
import { NEED_CATEGORIES } from '@/data/mockNeeds';
import { RenewalTrail } from '@/components/people/RenewalTrail';
import HouseholdResourceMap from '@/components/map/HouseholdResourceMap';
import { staggerContainer, staggerItem } from '@/lib/animations';
import {
  MapPin, Phone, CheckCircle2, Circle, ArrowRight, Bus,
  Clock, DollarSign, FileText, Heart, Shield, Compass, ExternalLink,
  PartyPopper,
} from 'lucide-react';

// Mock navigation steps for the survivor (simplified from the full version)
const SURVIVOR_STEPS = [
  { id: 'ss-001', title: 'Pick up medication refill', where: 'St. Francis Medical Outreach', address: '1250 Nicholson Dr', distance: '1.8 mi', transit: 'Bus #44 from Magnolia & 3rd, 18 min', bring: 'ID, prescription list', cost: 'Free (sliding scale)', hours: 'Mon-Sat 7am-7pm', urgency: 'soon' as const },
  { id: 'ss-002', title: 'Apply for food assistance (D-SNAP)', where: 'DCFS Office', address: '627 N 4th St', distance: '1.1 mi', transit: 'Bus #8, 12 min', bring: 'Photo ID, proof of address, pay stubs', cost: 'Free', hours: 'Mon-Fri 7:30am-5pm', urgency: 'this_week' as const },
  { id: 'ss-003', title: 'Schedule FEMA home inspection', where: 'Call or visit Recovery Center', address: '1885 Wooddale Blvd', distance: '3.1 mi', transit: 'Bus #44 → transfer Bus #8, 40 min', bring: 'FEMA registration #, photo ID, insurance docs', cost: 'Free', hours: 'Mon-Sat 8am-6pm / Phone: 1-800-621-3362', urgency: 'this_week' as const },
];

export default function SurvivorPortal() {
  const { id } = useParams<{ id: string }>();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selfReports, setSelfReports] = useState<{ id: string; text: string; date: string }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const household = getHousehold(id || '');
  if (!household) {
    return (
      <div className="min-h-screen parchment flex items-center justify-center p-4">
        <Card className="parchment-card p-8 text-center max-w-md">
          <Compass className="h-12 w-12 text-[hsl(var(--ignatian-gold))] mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-sm text-muted-foreground">This recovery link may have expired or been entered incorrectly. Contact your navigator for a new link.</p>
        </Card>
      </div>
    );
  }

  const needs = getNeedsForHousehold(household.id);
  const journey = getJourneyForHousehold(household.id);
  const activeNeeds = needs.filter(n => n.status !== 'met');
  const metNeeds = needs.filter(n => n.status === 'met');

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
        // Show celebration briefly
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      return next;
    });
  };

  const activeStageLabel = journey?.stages.find(s => s.status === 'active')?.stage
    ?.replace('_', ' & ')
    ?.replace(/\b\w/g, c => c.toUpperCase()) || 'Recovery';

  return (
    <div className="min-h-screen parchment">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 text-center">
        <p className="font-serif text-lg font-bold">Your Map to Renewal</p>
        <p className="text-xs opacity-80">{household.familyName} Family</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="font-serif text-xl font-bold text-foreground">
            Welcome, {household.headOfHousehold.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You are not alone. Here's where you are and what's available to you.
          </p>
        </div>

        {/* The Trail */}
        {journey && (
          <Card className="parchment-card p-4">
            <p className="text-xs font-semibold text-[hsl(var(--ignatian-muted))] uppercase tracking-wider mb-3">
              Your Journey
            </p>
            <RenewalTrail journey={journey} />
            <p className="text-center text-sm font-serif italic text-[hsl(var(--ignatian-brown))] mt-3">
              You are in: {activeStageLabel}
            </p>
          </Card>
        )}

        {/* Resource Map — the hope marker */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-[hsl(var(--ignatian-brown))]" />
            <p className="font-serif text-base font-semibold">Help near you</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Every pin on this map is an organization ready to help your family. You are surrounded by people who care.
          </p>
          <HouseholdResourceMap
            householdName={`${household.familyName} Family`}
            householdLat={household.lat}
            householdLng={household.lng}
            partners={partners}
          />
        </div>

        <Separator className="border-[hsl(var(--ignatian-border))]" />

        {/* Next Steps — written for the survivor */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="h-4 w-4 text-[hsl(var(--ignatian-brown))]" />
            <p className="font-serif text-base font-semibold">What you can do</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            These are steps you can take on your own. Tap the circle to mark what you've done.
          </p>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {SURVIVOR_STEPS.map(step => {
              const done = completedSteps.has(step.id);
              return (
                <motion.div key={step.id} variants={staggerItem}>
                  <Card className={`p-3 transition-all ${done ? 'bg-green-50/50 border-green-200' : 'parchment-card'}`}>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="mt-0.5 shrink-0"
                      >
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-[hsl(var(--ignatian-tan))]" />
                        )}
                      </button>
                      <div className={`flex-1 min-w-0 ${done ? 'opacity-60' : ''}`}>
                        <p className={`text-sm font-medium ${done ? 'line-through' : ''}`}>{step.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.where} &middot; {step.distance}</p>
                        <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                          <p className="flex items-center gap-1"><Bus className="h-3 w-3" />{step.transit}</p>
                          <p className="flex items-center gap-1"><FileText className="h-3 w-3" />Bring: {step.bring}</p>
                          <p className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{step.cost}</p>
                          <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{step.hours}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-4"
            >
              <PartyPopper className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-serif text-sm font-medium text-green-700">One step closer to home.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Needs */}
        {activeNeeds.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[hsl(var(--ignatian-muted))] uppercase tracking-wider mb-2">
              What we're working on together ({activeNeeds.length})
            </p>
            <div className="space-y-2">
              {activeNeeds.map(n => {
                const cat = NEED_CATEGORIES[n.category];
                return (
                  <Card key={n.id} className="p-3 parchment-card">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge variant="secondary" className={`text-[10px] shrink-0 ${cat?.color || ''}`}>
                          {cat?.label || n.category}
                        </Badge>
                        <span className="text-sm truncate">{n.title}</span>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] shrink-0 ${n.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {n.status === 'in_progress' ? 'In progress' : 'Needs attention'}
                      </Badge>
                    </div>
                    {n.referredTo && (
                      <p className="text-[11px] text-primary mt-1">Working with: {n.referredTo}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Met Needs — celebrations */}
        {metNeeds.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
              Completed ({metNeeds.length})
            </p>
            <div className="space-y-1">
              {metNeeds.map(n => (
                <div key={n.id} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{n.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="border-[hsl(var(--ignatian-border))]" />

        {/* Contact Navigator */}
        <Card className="parchment-card p-4 text-center">
          <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="font-serif text-sm font-medium">Need help?</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Your navigator is here for you. Reach out anytime.
          </p>
          <Button className="gap-2" size="sm">
            <Phone className="h-4 w-4" />
            Contact your navigator
          </Button>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <Shield className="h-5 w-5 text-[hsl(var(--ignatian-tan))] mx-auto mb-2" />
          <p className="text-[10px] text-[hsl(var(--ignatian-muted))]">
            Refugium — See the person. Discern the need. Strengthen the refuge.
          </p>
          <p className="text-[9px] text-[hsl(var(--ignatian-muted))] mt-1">
            Your information is private and only shared with your navigator.
          </p>
        </div>
      </div>
    </div>
  );
}
