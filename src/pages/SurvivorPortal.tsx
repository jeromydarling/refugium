/**
 * Survivor Portal — NRI-First Experience
 *
 * Accessed via secret link: /r/:householdId
 * NRI greets the survivor: "What do you need today?"
 * Then helps them find ANY resource, shows their trail, and lets them self-report.
 */

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Clock, DollarSign, FileText, Heart, Shield, Compass,
  PartyPopper, Send, ChevronDown, MessageCircle, Map,
  Home, UtensilsCrossed, Stethoscope, Briefcase, Car, Baby,
  Zap, Scale, Brain, Shirt,
} from 'lucide-react';

// ── Quick-need buttons (tap to ask) ──
const QUICK_NEEDS = [
  { id: 'food', label: 'Food', icon: UtensilsCrossed, query: 'I need help getting food' },
  { id: 'housing', label: 'Housing', icon: Home, query: 'I need help with housing' },
  { id: 'medical', label: 'Medical', icon: Stethoscope, query: 'I need medical care' },
  { id: 'work', label: 'Work', icon: Briefcase, query: 'I need help finding a job' },
  { id: 'transport', label: 'A ride', icon: Car, query: 'I need transportation help' },
  { id: 'childcare', label: 'Childcare', icon: Baby, query: 'I need help with childcare' },
  { id: 'legal', label: 'Legal help', icon: Scale, query: 'I need legal help' },
  { id: 'stress', label: 'Feeling overwhelmed', icon: Brain, query: 'I am feeling overwhelmed and need support' },
];

// ── NRI response engine for survivors ──
function getNriResponse(message: string, householdName: string): { text: string; resources?: { name: string; detail: string; phone?: string; action?: string }[] } {
  const lower = message.toLowerCase();

  // Crisis detection — redirect immediately
  if (/suicid|kill myself|want to die|self.?harm|end it all/i.test(lower)) {
    return {
      text: `I hear you, and I want you to know that help is available right now. Please reach out:`,
      resources: [
        { name: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988. Free, confidential, 24/7.', phone: '988' },
        { name: 'Crisis Text Line', detail: 'Text HOME to 741741.', phone: '741741' },
        { name: 'Disaster Distress Helpline', detail: 'Call 1-800-985-5990 or text "TalkWithUs" to 66746.', phone: '1-800-985-5990' },
      ],
    };
  }

  // Overwhelmed / emotional
  if (/overwhelm|stress|anxious|scared|alone|depress|can't cope|too much/i.test(lower)) {
    return {
      text: `What you're feeling is completely normal after what you've been through. You don't have to carry this alone. Here are people who can help — no cost, no judgment:`,
      resources: [
        { name: 'Crisis Counseling Program', detail: 'Free counseling for disaster survivors. Walk-ins welcome. Mon-Sat 8am-8pm.', phone: '(800) 555-2006' },
        { name: 'Disaster Distress Helpline', detail: '24/7 crisis support. Multilingual. Call or text.', phone: '1-800-985-5990' },
        { name: 'Your Navigator', detail: 'Your navigator can visit and talk with you. Sometimes just having someone present helps.', action: 'Contact navigator' },
      ],
    };
  }

  // Food
  if (/food|hungry|eat|grocer|snap|ebt|pantry|meal/i.test(lower)) {
    return {
      text: `Here's how to get food help right now in your area:`,
      resources: [
        { name: 'D-SNAP Application', detail: 'Emergency food benefits. Walk-in, same-day processing. Bring: ID, proof of address, proof of disaster loss.', phone: '(888) 555-2010', action: 'DCFS Office — 627 N 4th St, 1.1 mi, Bus #8' },
        { name: 'Second Harvest Food Bank', detail: 'Emergency food boxes available same-day. No ID required. Mon-Fri 8am-4pm.', phone: '(504) 555-2002' },
        { name: 'SNAP Retailers Near You', detail: 'Walmart (1.2 mi), Rouse\'s Market (2.1 mi), Albertsons (3.4 mi), Red Stick Farmers Market (4.0 mi) all accept EBT.' },
        { name: 'St. Vincent de Paul Food Pantry', detail: 'Walk-in pantry. Stays open late after storms. 3600 Magazine St.', phone: '(504) 555-0700' },
      ],
    };
  }

  // Housing
  if (/hous|home|shelter|roof|rent|live|stay|sleep|apartment|displaced/i.test(lower)) {
    return {
      text: `Here are your housing options right now:`,
      resources: [
        { name: 'FEMA Individual Assistance', detail: 'Grants for temporary housing and home repair. Call or visit a Recovery Center.', phone: '1-800-621-3362', action: 'Recovery Center — 1885 Wooddale Blvd, Mon-Sat 8am-6pm' },
        { name: 'Emergency Rental Assistance', detail: 'Up to 12 months of rental help. Income below 80% AMI. DCFS: 2415 Quail Dr.', phone: '(225) 555-8001' },
        { name: 'Red Cross Shelter', detail: '24/7 emergency shelter. Accepts families and pets at select sites.', phone: '(800) 733-2767' },
        { name: 'Fair Market Rent Info', detail: '1BR: $843/mo, 2BR: $1,012/mo, 3BR: $1,345/mo in your area (HUD FY2025).' },
      ],
    };
  }

  // Medical
  if (/medic|doctor|health|sick|prescri|pharma|hospital|clinic|hurt|injur|pill|medication/i.test(lower)) {
    return {
      text: `Here's where you can get medical care — most of these are free or sliding scale:`,
      resources: [
        { name: 'Community Health Center', detail: 'Primary care, dental, pharmacy. Walk-ins OK. Sliding scale — no one turned away. Mon-Sat.', phone: '(225) 555-6001', action: '3700 Florida Blvd, 2.7 mi' },
        { name: 'St. Francis Medical Outreach', detail: 'Primary care, prescriptions, chronic disease management. Mon-Sat 7am-7pm.', phone: '(225) 555-6003', action: '1250 Nicholson Dr, 1.8 mi, Bus #44' },
        { name: 'Disaster Prescription Refills', detail: 'Lost your medications? Get emergency 30-day refills at any participating pharmacy. Bring ID and disaster documentation. No prescription needed for refills.' },
        { name: '$4 Generic Program', detail: 'Walmart has 300+ generic medications for $4/30 days. Diabetes, blood pressure, antibiotics, mental health.' },
      ],
    };
  }

  // Employment
  if (/job|work|employ|money|income|career|hire|resume/i.test(lower)) {
    return {
      text: `Here's help finding work — including disaster recovery positions that are hiring now:`,
      resources: [
        { name: 'Disaster Unemployment Assistance', detail: 'Temporary benefits for workers displaced by disaster. Includes self-employed.', phone: '(866) 555-8005', action: 'LA Workforce Commission — 1001 N 23rd St' },
        { name: 'FEMA Disaster Recovery Specialist', detail: 'Hiring now. $52K-78K/yr. Support disaster survivors with applications and resources.', action: 'Apply at usajobs.gov' },
        { name: 'Construction Jobs — Storm Recovery', detail: 'Habitat for Humanity hiring laborers. $18-25/hr. Start immediately.', action: 'Contact: (225) 555-0300' },
        { name: 'LA Workforce Commission', detail: 'Job search help, resume assistance, training referrals. Walk-in Mon-Fri.', phone: '(866) 555-2008' },
      ],
    };
  }

  // Transportation
  if (/ride|transport|bus|car|drive|get there|get to|vehicle/i.test(lower)) {
    return {
      text: `Here's how to get where you need to go:`,
      resources: [
        { name: 'Medicaid Medical Transport', detail: 'FREE rides to doctor/pharmacy/dialysis for Medicaid recipients. Call 48 hours ahead.', phone: '1-866-384-0989' },
        { name: 'Emergency Bus Pass', detail: 'Free 7-day unlimited bus passes for disaster survivors. United Way office — bring disaster documentation.', phone: '(225) 555-7001' },
        { name: 'Volunteer Drivers', detail: 'Free rides for medical appointments, grocery, pharmacy. Priority for elderly/disabled. Mon-Sat 8am-5pm.', phone: '(225) 555-7002' },
        { name: 'Ride-Share Vouchers', detail: '$50 Lyft/Uber credit for critical appointments. Same-day available through Catholic Charities.', phone: '(225) 555-7004' },
      ],
    };
  }

  // Childcare
  if (/child|kid|daycare|babysit|school|preschool/i.test(lower)) {
    return {
      text: `Here's childcare help available to you:`,
      resources: [
        { name: 'Grace Community Church', detail: 'Respite childcare during recovery appointments. Free. Pastor Ruth is great with kids.', phone: '(228) 555-1300' },
        { name: "Children's Health Services", detail: 'Pediatrics, immunizations, developmental screening. Walk-ins OK. No insurance required.', phone: '(225) 555-6002' },
        { name: 'Catholic Charities', detail: 'Emergency childcare assistance and after-school programs for disaster-affected families.', phone: '(337) 555-0200' },
      ],
    };
  }

  // Legal
  if (/legal|lawyer|insurance|landlord|evict|fema appeal|contractor|fraud/i.test(lower)) {
    return {
      text: `Free legal help is available — you don't need to pay for a lawyer:`,
      resources: [
        { name: 'Free Legal Clinic', detail: 'Insurance disputes, landlord issues, FEMA appeals, contractor fraud. No appointment needed. Tue & Thu 9am-3pm.', phone: '(504) 555-8003', action: '1010 Common St, New Orleans' },
        { name: 'Louisiana Legal Services', detail: 'Full legal representation for disaster survivors. Income-qualified.', phone: '(504) 555-2007' },
      ],
    };
  }

  // Default — catch-all
  return {
    text: `I'm here to help you find whatever you need. Here are the most common things I can help with — or just tell me in your own words what's going on:`,
    resources: [
      { name: 'Call 211', detail: 'Dial 211 for any need — housing, food, health, employment, legal, financial. Free, 24/7, multilingual.' },
      { name: 'Your Navigator', detail: 'Your navigator knows your situation and can help with anything. Don\'t hesitate to reach out.', action: 'Contact navigator' },
    ],
  };
}

// ── Navigation steps for self-reporting ──
const SURVIVOR_STEPS = [
  { id: 'ss-001', title: 'Pick up medication refill', where: 'St. Francis Medical Outreach', distance: '1.8 mi' },
  { id: 'ss-002', title: 'Apply for food assistance (D-SNAP)', where: 'DCFS Office', distance: '1.1 mi' },
  { id: 'ss-003', title: 'Schedule FEMA home inspection', where: 'Recovery Center or call 1-800-621-3362', distance: '3.1 mi' },
];

export default function SurvivorPortal() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<{ role: 'nri' | 'user'; text: string; resources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const household = getHousehold(id || '');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!household) {
    return (
      <div className="min-h-screen parchment flex items-center justify-center p-4">
        <Card className="parchment-card p-8 text-center max-w-md">
          <Compass className="h-12 w-12 text-[hsl(var(--ignatian-gold))] mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-sm text-muted-foreground">This recovery link may have expired. Contact your navigator for a new link.</p>
        </Card>
      </div>
    );
  }

  const journey = getJourneyForHousehold(household.id);
  const needs = getNeedsForHousehold(household.id);
  const activeNeeds = needs.filter(n => n.status !== 'met');
  const firstName = household.headOfHousehold.split(' ')[0];

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const response = getNriResponse(msg, household.familyName);
    setMessages(prev => [
      ...prev,
      { role: 'user', text: msg },
      { role: 'nri', text: response.text, resources: response.resources },
    ]);
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen parchment flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="font-serif text-base font-bold">Refugium</p>
          <p className="text-[10px] opacity-70">{household.familyName} Family</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-1"
            onClick={() => setShowJourney(!showJourney)}
          >
            <Map className="h-3 w-3" />
            {showJourney ? 'Chat' : 'My Journey'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-1"
          >
            <Phone className="h-3 w-3" />
            Navigator
          </Button>
        </div>
      </div>

      {showJourney ? (
        /* ── Journey View ── */
        <div className="flex-1 overflow-auto px-4 py-6 max-w-lg mx-auto w-full space-y-6">
          {journey && (
            <Card className="parchment-card p-4">
              <p className="text-xs font-semibold text-[hsl(var(--ignatian-muted))] uppercase tracking-wider mb-3">Your Journey</p>
              <RenewalTrail journey={journey} />
            </Card>
          )}

          <div>
            <p className="font-serif text-base font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[hsl(var(--ignatian-brown))]" /> Help near you
            </p>
            <HouseholdResourceMap
              householdName={`${household.familyName} Family`}
              householdLat={household.lat}
              householdLng={household.lng}
              partners={partners}
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-[hsl(var(--ignatian-muted))] uppercase tracking-wider mb-2">
              Things you can do ({SURVIVOR_STEPS.length - completedSteps.size} remaining)
            </p>
            <div className="space-y-2">
              {SURVIVOR_STEPS.map(step => {
                const done = completedSteps.has(step.id);
                return (
                  <Card key={step.id} className={`p-3 flex items-center gap-3 ${done ? 'bg-green-50/50 border-green-200' : 'parchment-card'}`}>
                    <button onClick={() => toggleStep(step.id)} className="shrink-0">
                      {done ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-[hsl(var(--ignatian-tan))]" />}
                    </button>
                    <div className={done ? 'opacity-50' : ''}>
                      <p className={`text-sm font-medium ${done ? 'line-through' : ''}`}>{step.title}</p>
                      <p className="text-[11px] text-muted-foreground">{step.where} · {step.distance}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {showCelebration && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-3">
                <PartyPopper className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="font-serif text-sm text-green-700">One step closer to home.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {activeNeeds.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[hsl(var(--ignatian-muted))] uppercase tracking-wider mb-2">Being worked on ({activeNeeds.length})</p>
              {activeNeeds.map(n => {
                const cat = NEED_CATEGORIES[n.category];
                return (
                  <div key={n.id} className="flex items-center gap-2 py-1.5 text-sm">
                    <Badge variant="secondary" className={`text-[9px] ${cat?.color || ''}`}>{cat?.label}</Badge>
                    <span className="truncate">{n.title}</span>
                    {n.referredTo && <span className="text-[10px] text-primary ml-auto shrink-0">{n.referredTo}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ── Chat View (default) ── */
        <>
          <div className="flex-1 overflow-auto px-4 py-4 max-w-lg mx-auto w-full">
            {/* NRI greeting */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center pt-4 pb-2">
                  <Compass className="h-10 w-10 text-[hsl(var(--ignatian-gold))] mx-auto mb-3" />
                  <h1 className="font-serif text-xl font-bold">Hi {firstName}</h1>
                  <p className="text-sm text-muted-foreground mt-1">What do you need today?</p>
                </div>

                {/* Quick-need buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_NEEDS.map(need => (
                    <button
                      key={need.id}
                      onClick={() => handleSend(need.query)}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[hsl(var(--ignatian-border))] hover:bg-[hsl(var(--ignatian-cream))] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <need.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{need.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground italic">
                  Or type anything — I'll help you find it.
                </p>
              </div>
            )}

            {/* Chat messages */}
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div className={`max-w-[90%] ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5'
                    : ''
                  }`}>
                    {msg.role === 'nri' && (
                      <div className="space-y-2">
                        <div className="bg-[hsl(var(--ignatian-cream))] border border-[hsl(var(--ignatian-border))] rounded-2xl rounded-bl-md px-4 py-3">
                          <p className="text-sm text-foreground">{msg.text}</p>
                        </div>
                        {msg.resources && (
                          <div className="space-y-1.5 pl-1">
                            {msg.resources.map((r: any, ri: number) => (
                              <Card key={ri} className="p-3 border-l-2 border-l-primary/40">
                                <p className="text-sm font-semibold">{r.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{r.detail}</p>
                                {(r.phone || r.action) && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {r.phone && (
                                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                        <Phone className="h-3 w-3" />{r.phone}
                                      </Button>
                                    )}
                                    {r.action && (
                                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                        <ArrowRight className="h-3 w-3" />{r.action}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="shrink-0 border-t bg-background px-4 py-3 max-w-lg mx-auto w-full">
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tell me what you need..."
                className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shrink-0" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}

      {/* Privacy footer */}
      <div className="text-center py-2 px-4 shrink-0">
        <p className="text-[9px] text-[hsl(var(--ignatian-muted))]">
          Your information is private. Only shared with your navigator.
        </p>
      </div>
    </div>
  );
}
