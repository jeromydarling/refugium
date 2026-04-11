/**
 * NRI Compass for Refugium Demo
 *
 * Reuses CROS compass UI patterns without CROS auth/tenant dependencies.
 * For Lovable integration: replace mock data with real useCompassSessionEngine,
 * useAIChatSession, etc. The UI doesn't change.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Compass, Heart, RotateCcw, Zap, Eye, X, Send, ArrowRight, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { checkNriScope } from '@/lib/nri/scopeGuardrails';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { households, getNeedsForHousehold, getSignalsForHousehold, getSystemSignals } from '@/data';

// ── Posture system (from CROS compassDirection.ts) ──
type Posture = 'care' | 'discernment' | 'narrative' | 'accompaniment';

const POSTURE_CONFIG: Record<Posture, { label: string; icon: typeof Heart }> = {
  care: { label: 'Care', icon: Heart },
  discernment: { label: 'Discernment', icon: Eye },
  narrative: { label: 'Narrative', icon: Sparkles },
  accompaniment: { label: 'Accompaniment', icon: RotateCcw },
};

function inferPosture(pathname: string): Posture {
  if (pathname.includes('/dashboard') || pathname.includes('/board')) return 'discernment';
  if (pathname.includes('/people/') || pathname.includes('/flow')) return 'care';
  if (pathname.includes('/calendar')) return 'accompaniment';
  return 'care';
}

// ── Nudge engine (simplified from CROS useCompassSessionEngine) ──
interface CompassNudge {
  id: string;
  direction: Posture;
  message: string;
  action?: { label: string; route?: string };
  urgency: 'high' | 'medium' | 'low';
}

function generateNudges(pathname: string): CompassNudge[] {
  const nudges: CompassNudge[] = [];
  const systemSignals = getSystemSignals();

  // Stalled refuges
  const stalledFamilies = households.filter(h => {
    const days = Math.floor((Date.now() - new Date(h.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return days > 14 && h.currentStatus !== 'recovered';
  });
  if (stalledFamilies.length > 0) {
    nudges.push({
      id: 'stalled',
      direction: 'care',
      message: `${stalledFamilies.length} ${stalledFamilies.length === 1 ? 'family hasn\'t' : 'families haven\'t'} been contacted in over 2 weeks.`,
      action: { label: 'View board', route: '/demo/app/board' },
      urgency: 'high',
    });
  }

  // Unassigned households
  const unassigned = households.filter(h => !h.assignedVolunteerId && h.currentStatus !== 'recovered');
  if (unassigned.length > 0) {
    nudges.push({
      id: 'unassigned',
      direction: 'care',
      message: `${unassigned.length} ${unassigned.length === 1 ? 'household has' : 'households have'} no navigator assigned.`,
      action: { label: 'View people', route: '/demo/app/people' },
      urgency: 'medium',
    });
  }

  // Critical needs
  const criticalNeeds = households.flatMap(h =>
    getNeedsForHousehold(h.id).filter(n => n.priority === 'critical' && n.status === 'unmet')
  );
  if (criticalNeeds.length > 0) {
    nudges.push({
      id: 'critical',
      direction: 'care',
      message: `${criticalNeeds.length} critical unmet ${criticalNeeds.length === 1 ? 'need requires' : 'needs require'} attention today.`,
      urgency: 'high',
    });
  }

  // Context-specific nudges
  if (pathname.includes('/people/')) {
    const id = pathname.split('/people/')[1];
    if (id) {
      const signals = getSignalsForHousehold(id);
      if (signals.length > 0) {
        nudges.push({
          id: 'household-signals',
          direction: 'care',
          message: `NRI has ${signals.length} ${signals.length === 1 ? 'observation' : 'observations'} about this family.`,
          urgency: 'low',
        });
      }
    }
  }

  return nudges.slice(0, 3);
}

// ── Mock chat responses ──
function getDemoResponse(message: string, pathname: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('stalled') || lower.includes('stuck') || lower.includes('behind')) {
    return 'Three families have been in stabilization for over 2 weeks: Johnson (18 days, no volunteer), Brown (15 days, single mother), and Nguyen (in shelter, no housing plan). I\'d suggest starting with Johnson — they have children showing respiratory symptoms from mold.';
  }
  if (lower.includes('martinez') || lower.includes('elena')) {
    return 'The Martinez family is in stabilization. Elena\'s medication gap is the most urgent issue — St. Francis Pharmacy has a 90-day supply program, 1.8 miles away on Bus #44. Carlos wants to rebuild the kids\' bedrooms himself — that\'s a strong meaning anchor for when they reach the rebuild stage.';
  }
  if (lower.includes('volunteer') || lower.includes('capacity')) {
    return 'You have 8 active volunteers across 5 zones. Zone 3 (Lafayette) is the weakest — only 2 active volunteers for 3 households. Jennifer Adams is on break and Robert Kim only works afternoons. Consider recruiting in that area or temporarily reassigning from Zone 1.';
  }
  if (lower.includes('what') && (lower.includes('do') || lower.includes('help') || lower.includes('can'))) {
    return 'I can help you understand your families\' situations, surface patterns across your caseload, suggest next steps for specific households, find resources nearby, and notice things you might miss in the daily rush. Ask me about a specific family, or about your operation as a whole.';
  }
  if (lower.includes('week') || lower.includes('today') || lower.includes('schedule')) {
    return 'You have 2 visits scheduled today: the Martinez family (9 AM, follow-up on medication) and the Nguyen family (2 PM, housing transition). Wednesday\'s health clinic could serve both the Nguyen and Robinson families. Thursday is distribution day at First Baptist.';
  }

  return 'I\'m here to help you navigate. Ask me about a specific family, your overall caseload, stalled refuges, volunteer capacity, or what to focus on today. I notice patterns and surface what might need your attention.';
}

// ── The Compass Component ──
export function NriCompass() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'nri'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const { isDemoMode } = useDemoMode();
  const isDesktop = useIsDesktop();
  const location = useLocation();

  const posture = inferPosture(location.pathname);
  const postureConfig = POSTURE_CONFIG[posture];
  const PostureIcon = postureConfig.icon;
  const nudges = useMemo(() => generateNudges(location.pathname), [location.pathname]);

  if (!isDemoMode) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');

    // Guardrails check FIRST
    const scopeCheck = checkNriScope(userMsg);
    if (!scopeCheck.allowed) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: userMsg },
        { role: 'nri', text: scopeCheck.response || 'I\'m your navigator companion — I help with disaster recovery coordination. Let me know how I can help with your families and resources.' },
      ]);
      return;
    }

    // Demo response
    const response = getDemoResponse(userMsg, location.pathname);
    setMessages(prev => [
      ...prev,
      { role: 'user', text: userMsg },
      { role: 'nri', text: response },
    ]);
  };

  const quickPrompts = [
    'What should I focus on today?',
    'Which families need attention?',
    'How is volunteer capacity?',
    'Tell me about the Martinez family',
  ];

  return (
    <>
      {/* Compass Button — on mobile sits behind bottom nav (z-40 < nav z-50), peeking up */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed rounded-full bg-[hsl(var(--ignatian-deep))] text-[hsl(var(--ignatian-cream))] shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center ${
          isDesktop
            ? 'bottom-8 left-8 z-50 w-12 h-12'
            : 'bottom-[20px] left-1/2 -translate-x-1/2 z-40 w-14 h-14'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open NRI Compass"
      >
        <Compass className={isDesktop ? 'h-6 w-6' : 'h-7 w-7'} />
        {nudges.some(n => n.urgency === 'high') && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-[hsl(var(--ignatian-deep))]" />
        )}
      </motion.button>

      {/* Compass Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[420px] p-0 flex flex-col">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b bg-[hsl(var(--ignatian-bg))]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-[hsl(var(--ignatian-brown))]" />
                <h2 className="font-serif text-lg font-bold text-foreground">NRI Compass</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <PostureIcon className="h-3 w-3 text-[hsl(var(--ignatian-muted))]" />
              <p className="text-xs italic text-[hsl(var(--ignatian-muted))]">{postureConfig.label} posture</p>
            </div>
          </div>

          {/* Nudges */}
          {nudges.length > 0 && (
            <div className="px-5 py-3 border-b bg-[hsl(var(--ignatian-cream))]">
              <p className="text-[10px] font-semibold text-[hsl(var(--ignatian-muted))] uppercase tracking-wider mb-2">
                Today's Movement
              </p>
              <div className="space-y-2">
                {nudges.map(nudge => (
                  <div key={nudge.id} className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      nudge.urgency === 'high' ? 'bg-primary' : nudge.urgency === 'medium' ? 'bg-accent' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">{nudge.message}</p>
                      {nudge.action && (
                        <button
                          onClick={() => { setOpen(false); window.location.href = `/refugium${nudge.action!.route}`; }}
                          className="text-[10px] text-primary font-medium mt-0.5 flex items-center gap-0.5 hover:underline"
                        >
                          {nudge.action.label} <ChevronRight className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className="flex-1 overflow-auto px-5 py-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Compass className="h-8 w-8 text-[hsl(var(--ignatian-tan))] mx-auto mb-3" />
                <p className="text-sm font-serif text-[hsl(var(--ignatian-brown))]">
                  I notice what you might miss.
                </p>
                <p className="text-xs text-[hsl(var(--ignatian-muted))] mt-1">
                  Ask me about your families, resources, or what needs attention.
                </p>
                <div className="mt-4 space-y-1.5">
                  {quickPrompts.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => { setInput(prompt); }}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-[hsl(var(--ignatian-border))] hover:bg-[hsl(var(--ignatian-cream))] transition-colors text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-[hsl(var(--ignatian-cream))] text-foreground border border-[hsl(var(--ignatian-border))]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="px-5 py-3 border-t bg-background">
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask NRI..."
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
