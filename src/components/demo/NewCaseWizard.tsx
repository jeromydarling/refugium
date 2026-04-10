import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { partners, resources } from '@/data';
import { NEED_CATEGORIES, type NeedCategory } from '@/data/mockNeeds';
import {
  MapPin, Users, CloudLightning, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, Sparkles, Home, UtensilsCrossed, Stethoscope, Brain,
  Scale, Briefcase, Car, Baby, Zap, FileText, Shirt, PartyPopper,
  Shield, Phone,
} from 'lucide-react';

// ── Mock disaster detection ──
const MOCK_DISASTERS = [
  { name: 'Hurricane Francine 2024', type: 'hurricane', date: '2024-09-11', region: 'Gulf Coast', radius: 200 },
  { name: 'Spring Flooding 2024', type: 'flood', date: '2024-04-12', region: 'Louisiana / Mississippi', radius: 150 },
  { name: 'April Tornadoes 2024', type: 'tornado', date: '2024-04-06', region: 'Mississippi / Louisiana', radius: 100 },
];

const NEED_ICONS: Partial<Record<NeedCategory, typeof Home>> = {
  housing_repair: Home,
  temporary_shelter: Shield,
  food_assistance: UtensilsCrossed,
  medical_care: Stethoscope,
  mental_health: Brain,
  legal_aid: Scale,
  employment: Briefcase,
  transportation: Car,
  childcare: Baby,
  utilities: Zap,
  documentation: FileText,
  clothing: Shirt,
};

interface NewCaseWizardProps {
  open: boolean;
  onClose: () => void;
  onRefugeCreated?: (familyName: string) => void;
}

type Step = 'person' | 'detecting' | 'disaster' | 'needs' | 'matching' | 'done';

export function NewCaseWizard({ open, onClose, onRefugeCreated }: NewCaseWizardProps) {
  const { simulateWrite } = useDemoMode();
  const [step, setStep] = useState<Step>('person');
  const [familyName, setFamilyName] = useState('');
  const [headName, setHeadName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [memberCount, setMemberCount] = useState('1');
  const [selectedNeeds, setSelectedNeeds] = useState<NeedCategory[]>([]);
  const [detectedDisaster, setDetectedDisaster] = useState(MOCK_DISASTERS[0]);
  const [matchedPartners, setMatchedPartners] = useState<typeof partners>([]);
  const [matchedResources, setMatchedResources] = useState<typeof resources>([]);

  const reset = () => {
    setStep('person');
    setFamilyName('');
    setHeadName('');
    setPhone('');
    setAddress('');
    setMemberCount('1');
    setSelectedNeeds([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Step 1 → 2: Auto-detect disaster
  const handleDetect = () => {
    setStep('detecting');
    // Simulate API call with 1.5s delay
    setTimeout(() => {
      // Pick disaster based on address keywords
      const addr = address.toLowerCase();
      if (addr.includes('mississippi') || addr.includes('ms') || addr.includes('hattiesburg')) {
        setDetectedDisaster(MOCK_DISASTERS[2]); // tornadoes
      } else if (addr.includes('new orleans') || addr.includes('slidell') || addr.includes('lafayette')) {
        setDetectedDisaster(MOCK_DISASTERS[1]); // flooding
      } else {
        setDetectedDisaster(MOCK_DISASTERS[0]); // hurricane (default)
      }
      setStep('disaster');
    }, 1500);
  };

  // Step 3 → 4: Match resources based on selected needs
  const handleMatchResources = () => {
    setStep('matching');
    setTimeout(() => {
      // Match partners by services that relate to selected needs
      const needLabels = selectedNeeds.map(n => NEED_CATEGORIES[n]?.label.toLowerCase() || '');
      const matched = partners.filter(p =>
        p.services.some(s => {
          const sl = s.toLowerCase();
          return needLabels.some(nl =>
            sl.includes(nl.split(' ')[0]) || // Match first word
            (nl.includes('housing') && (sl.includes('housing') || sl.includes('shelter') || sl.includes('home'))) ||
            (nl.includes('food') && (sl.includes('food') || sl.includes('meal') || sl.includes('pantry'))) ||
            (nl.includes('medical') && (sl.includes('care') || sl.includes('health') || sl.includes('medical'))) ||
            (nl.includes('mental') && (sl.includes('counseling') || sl.includes('mental'))) ||
            (nl.includes('legal') && (sl.includes('legal') || sl.includes('dispute') || sl.includes('rights'))) ||
            (nl.includes('transport') && sl.includes('transport'))
          );
        })
      ).slice(0, 5);

      const matchedRes = resources.filter(r =>
        selectedNeeds.some(n => {
          const cat = NEED_CATEGORIES[n]?.label.toLowerCase() || '';
          return r.category === n.replace('_repair', '').replace('_assistance', '') ||
            r.description.toLowerCase().includes(cat.split(' ')[0]);
        })
      ).slice(0, 5);

      setMatchedPartners(matched.length > 0 ? matched : partners.slice(0, 3));
      setMatchedResources(matchedRes.length > 0 ? matchedRes : resources.slice(0, 3));
      setStep('done');
    }, 2000);
  };

  const toggleNeed = (need: NeedCategory) => {
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const canProceedPerson = familyName.trim() && headName.trim() && address.trim();

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  const progressSteps = ['Person', 'Disaster', 'Needs', 'Resources'];
  const progressIndex =
    step === 'person' ? 0 :
    step === 'detecting' || step === 'disaster' ? 1 :
    step === 'needs' ? 2 : 3;

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Progress bar */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-1 mb-1">
            {progressSteps.map((label, i) => (
              <div key={label} className="flex-1 flex items-center gap-1">
                <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i <= progressIndex ? 'bg-primary' : 'bg-muted'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
            {progressSteps.map((label, i) => (
              <span key={label} className={i <= progressIndex ? 'text-primary font-medium' : ''}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Person / Family Info ── */}
            {step === 'person' && (
              <motion.div key="person" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <div className="text-center mb-6">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl font-bold">Who needs help?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Enter the person or family in need</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="familyName" className="text-xs">Family name</Label>
                      <Input id="familyName" value={familyName} onChange={e => setFamilyName(e.target.value)} placeholder="Rodriguez" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="headName" className="text-xs">Head of household</Label>
                      <Input id="headName" value={headName} onChange={e => setHeadName(e.target.value)} placeholder="Ana Rodriguez" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs">Phone (optional)</Label>
                      <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(225) 555-0000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="members" className="text-xs">Family members</Label>
                      <Input id="members" type="number" min="1" max="20" value={memberCount} onChange={e => setMemberCount(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </Label>
                    <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="1234 Main St, Baton Rouge, LA 70802" />
                    <p className="text-[10px] text-muted-foreground">We'll auto-detect the disaster event for this area</p>
                  </div>

                  <Button onClick={handleDetect} disabled={!canProceedPerson} className="w-full gap-2" size="lg">
                    Detect Disaster
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Detecting (loading) ── */}
            {step === 'detecting' && (
              <motion.div key="detecting" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <Loader2 className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h2 className="font-serif text-xl font-bold">Detecting disaster event...</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Checking FEMA alerts, weather data, and local reports for <span className="font-medium text-foreground">{address}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Disaster Detected ── */}
            {step === 'disaster' && (
              <motion.div key="disaster" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-3"
                  >
                    <CloudLightning className="w-7 h-7 text-amber-700" />
                  </motion.div>
                  <h2 className="font-serif text-xl font-bold">Disaster detected</h2>
                  <p className="text-sm text-muted-foreground mt-1">We found a recent event for this area</p>
                </div>

                <Card className="p-4 border-l-4 border-l-amber-500 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{detectedDisaster.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {detectedDisaster.region} &middot; {new Date(detectedDisaster.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">{detectedDisaster.type}</Badge>
                  </div>
                </Card>

                <Card className="p-4 bg-muted/30 mb-4">
                  <p className="text-sm font-medium mb-1">Refuge summary</p>
                  <p className="text-xs text-muted-foreground">
                    {headName} ({familyName} family) &middot; {memberCount} member{parseInt(memberCount) > 1 ? 's' : ''} &middot; {address}
                  </p>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('person')} className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button onClick={() => setStep('needs')} className="flex-1 gap-2" size="lg">
                    Assess Needs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Needs Assessment ── */}
            {step === 'needs' && (
              <motion.div key="needs" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <div className="text-center mb-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl font-bold">What does this family need?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Tap all that apply — we'll match resources automatically</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(Object.keys(NEED_CATEGORIES) as NeedCategory[]).map(key => {
                    const cat = NEED_CATEGORIES[key];
                    const Icon = NEED_ICONS[key] || FileText;
                    const selected = selectedNeeds.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleNeed(key)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          selected ? 'bg-primary/15' : 'bg-muted'
                        }`}>
                          <Icon className={`w-4 h-4 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <span className={`text-xs font-medium ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* What Matters prompts — appear for selected needs */}
                {selectedNeeds.length > 0 && (
                  <div className="mb-3 space-y-1.5 rounded-xl bg-primary/5 border border-primary/10 p-3">
                    <p className="text-xs font-medium text-primary">Things to ask:</p>
                    {selectedNeeds.slice(0, 3).map(key => (
                      <p key={key} className="text-[11px] text-muted-foreground italic leading-relaxed">
                        {NEED_CATEGORIES[key].whatMatters}
                      </p>
                    ))}
                    {selectedNeeds.length > 3 && (
                      <p className="text-[10px] text-muted-foreground">+ {selectedNeeds.length - 3} more</p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('disaster')} className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleMatchResources}
                    disabled={selectedNeeds.length === 0}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    Find Resources
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 5: Matching (loading) ── */}
            {step === 'matching' && (
              <motion.div key="matching" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <div className="text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mx-auto w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-accent" />
                  </motion.div>
                  <h2 className="font-serif text-xl font-bold">Matching resources...</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Searching 211, Findhelp, and {partners.length} trusted local partners
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Step 6: Done! ── */}
            {step === 'done' && (
              <motion.div key="done" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mx-auto w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-3"
                  >
                    <PartyPopper className="w-8 h-8 text-green-700" />
                  </motion.div>
                  <h2 className="font-serif text-xl font-bold">Refuge opened!</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    The {familyName} family is now being tracked. Here's what we found:
                  </p>
                </div>

                {/* Summary card */}
                <Card className="p-4 border-l-4 border-l-green-500 mb-4">
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">{headName}</span> ({familyName} family)</p>
                    <p className="text-xs text-muted-foreground">{address}</p>
                    <p className="text-xs text-muted-foreground">{detectedDisaster.name}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedNeeds.map(n => (
                        <Badge key={n} variant="secondary" className={`text-xs ${NEED_CATEGORIES[n].color}`}>
                          {NEED_CATEGORIES[n].label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Matched partners */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {matchedPartners.length} Matched Partners
                  </p>
                  <div className="space-y-1.5">
                    {matchedPartners.map(p => (
                      <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 min-w-0">
                          <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{p.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
                          {p.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched resources */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {matchedResources.length} Public Resources
                  </p>
                  <div className="space-y-1.5">
                    {matchedResources.map(r => (
                      <div key={r.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{r.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{r.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  onClick={() => {
                    simulateWrite(`Refuge opened for ${familyName} family`);
                    onRefugeCreated?.(familyName);
                    handleClose();
                  }}
                  className="w-full gap-2"
                  size="lg"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Begin This Refuge
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
