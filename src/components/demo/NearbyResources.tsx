import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { findNearbyResources, type NearbyResources as NearbyResourcesType } from '@/services/resourceApi';
import { staggerContainer, staggerItem } from '@/lib/animations';
import {
  Briefcase, UtensilsCrossed, Home, Shield, Heart, Scale,
  AlertTriangle, MapPin, Phone, Clock, ExternalLink, Loader2,
  Sparkles, ChevronRight, DollarSign, Cloud, Star,
  Users, Baby, Bus, Stethoscope, Pill, ArrowRight, FileText,
  Navigation,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, typeof Briefcase> = {
  employment: Briefcase,
  food: UtensilsCrossed,
  housing: Home,
  shelter: Shield,
  mental_health: Heart,
  medical: Heart,
  legal: Scale,
};

interface NearbyResourcesProps {
  address: string;
  zip: string;
  state: string;
  needs?: string[];
  compact?: boolean;
}

export function NearbyResourcesPanel({ address, zip, state, needs, compact }: NearbyResourcesProps) {
  const [resources, setResources] = useState<NearbyResourcesType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    findNearbyResources(address, zip, state, needs).then(r => {
      setResources(r);
      setLoading(false);
    });
  }, [address, zip, state]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3"
        >
          <Loader2 className="w-6 h-6 text-primary" />
        </motion.div>
        <p className="text-sm font-medium text-foreground">Finding nearby resources...</p>
        <p className="text-xs text-muted-foreground mt-1">Searching FEMA, USAJOBS, SNAP, 211, shelters, and more</p>
      </div>
    );
  }

  if (!resources) return null;

  const activeDisaster = resources.disasters[0];
  const hasAlerts = resources.alerts.length > 0;
  const jobCount = resources.jobs.length;
  const disasterJobs = resources.jobs.filter(j => j.disasterRelated);

  return (
    <div className="space-y-4">
      {/* Header — the promise */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/5 border border-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Resources found near {address.split(',')[0]}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {jobCount} jobs &middot; {resources.snapRetailers.length} food locations &middot; {resources.shelters.length} shelters &middot; {resources.services.length} services
            </p>
          </div>
        </div>
      </div>

      {/* Active disaster declaration */}
      {activeDisaster && (
        <Card className="p-3 border-l-4 border-l-amber-400">
          <div className="flex items-start gap-2">
            <Cloud className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">{activeDisaster.title}</p>
              <p className="text-[11px] text-muted-foreground">
                FEMA DR-{activeDisaster.disasterNumber} &middot; Declared {new Date(activeDisaster.declarationDate).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activeDisaster.iaProgramDeclared && <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">Individual Assistance</Badge>}
                {activeDisaster.paProgramDeclared && <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">Public Assistance</Badge>}
                {activeDisaster.hmProgramDeclared && <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700">Hazard Mitigation</Badge>}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Weather alerts */}
      {hasAlerts && (
        <div className="space-y-1.5">
          {resources.alerts.map(alert => (
            <Card key={alert.id} className={`p-2.5 ${alert.severity === 'Extreme' || alert.severity === 'Severe' ? 'border-red-300 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${alert.severity === 'Extreme' || alert.severity === 'Severe' ? 'text-red-600' : 'text-amber-600'}`} />
                <p className="text-xs font-medium">{alert.headline}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation Steps — the roadmap */}
      {resources.navigationSteps.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">Next Steps — Your Recovery Roadmap</p>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.navigationSteps.map(step => (
              <motion.div key={step.id} variants={staggerItem}>
                <Card className={`p-3 border-l-3 ${step.urgency === 'today' ? 'border-l-red-400 bg-red-50/30' : step.urgency === 'this_week' ? 'border-l-amber-400' : 'border-l-border'}`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${step.urgency === 'today' ? 'bg-red-100' : 'bg-primary/10'}`}>
                      <ArrowRight className={`w-3.5 h-3.5 ${step.urgency === 'today' ? 'text-red-600' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <Badge variant="secondary" className={`text-[9px] ${step.urgency === 'today' ? 'bg-red-100 text-red-700' : step.urgency === 'this_week' ? 'bg-amber-100 text-amber-700' : 'bg-muted'}`}>
                          {step.urgency === 'today' ? 'Today' : step.urgency === 'this_week' ? 'This week' : 'Soon'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.destination} &middot; {step.distance}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Bus className="h-3 w-3 shrink-0" />
                        {step.transitOption}
                      </p>
                      {step.transitDetails && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 italic">{step.transitDetails}</p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Phone className="h-2.5 w-2.5" />{step.phone}</span>
                        <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{step.hours}</span>
                        <span className="flex items-center gap-0.5"><DollarSign className="h-2.5 w-2.5" />{step.cost}</span>
                      </div>
                      {step.whatToBring.length > 0 && (
                        <div className="mt-1.5 p-2 rounded-md bg-muted/40">
                          <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                            <FileText className="h-2.5 w-2.5 inline mr-0.5" />Bring:
                          </p>
                          <p className="text-[10px] text-muted-foreground">{step.whatToBring.join(' · ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Tabbed resources */}
      <Tabs defaultValue={needs?.includes('employment') ? 'jobs' : needs?.includes('medical_care') ? 'medical' : needs?.includes('transportation') ? 'transport' : 'services'}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-9">
          <TabsTrigger value="jobs" className="text-xs gap-1"><Briefcase className="h-3 w-3" />Jobs</TabsTrigger>
          <TabsTrigger value="medical" className="text-xs gap-1"><Stethoscope className="h-3 w-3" />Medical</TabsTrigger>
          <TabsTrigger value="transport" className="text-xs gap-1"><Bus className="h-3 w-3" />Transit</TabsTrigger>
          <TabsTrigger value="food" className="text-xs gap-1"><UtensilsCrossed className="h-3 w-3" />Food</TabsTrigger>
          <TabsTrigger value="shelter" className="text-xs gap-1"><Home className="h-3 w-3" />Shelter</TabsTrigger>
          <TabsTrigger value="services" className="text-xs gap-1"><Heart className="h-3 w-3" />Services</TabsTrigger>
        </TabsList>

        {/* ── Jobs ── */}
        <TabsContent value="jobs" className="mt-3">
          {disasterJobs.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                <Star className="h-3 w-3 inline mr-1 text-accent" />
                Disaster Recovery Positions
              </p>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                {disasterJobs.map(job => (
                  <motion.div key={job.id} variants={staggerItem}>
                    <Card className="p-3 border-l-2 border-l-accent">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{job.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-medium text-primary">{job.salary}</p>
                          <Badge variant="secondary" className="text-[10px] mt-1">{job.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span>{job.posted}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">All Nearby Jobs</p>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.jobs.filter(j => !j.disasterRelated).map(job => (
              <motion.div key={job.id} variants={staggerItem}>
                <Card className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company} &middot; {job.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-primary">{job.salary}</p>
                      <p className="text-[10px] text-muted-foreground">{job.posted}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-3 text-center">
            <p className="text-[10px] text-muted-foreground">
              Powered by USAJOBS &middot; JSearch &middot; Local listings
            </p>
          </div>
        </TabsContent>

        {/* ── Food / SNAP ── */}
        <TabsContent value="food" className="mt-3 space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            SNAP/EBT Accepted Nearby
          </p>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.snapRetailers.map(store => (
              <motion.div key={store.id} variants={staggerItem}>
                <Card className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{store.name}</p>
                      <p className="text-xs text-muted-foreground">{store.address}, {store.city}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="secondary" className="text-[10px]">{store.storeType}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{store.distance}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Separator />

          {/* D-SNAP and food services from 211 */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Food Assistance Programs</p>
          {resources.services.filter(s => s.category === 'food').map(svc => (
            <Card key={svc.id} className="p-3 border-l-2 border-l-green-400">
              <p className="text-sm font-medium">{svc.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{svc.phone}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{svc.hours}</span>
              </div>
            </Card>
          ))}

          <p className="text-[10px] text-center text-muted-foreground">Powered by USDA SNAP Retailer Locator &middot; 211</p>
        </TabsContent>

        {/* ── Shelter ── */}
        <TabsContent value="shelter" className="mt-3 space-y-2">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.shelters.map(shelter => (
              <motion.div key={shelter.id} variants={staggerItem}>
                <Card className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{shelter.name}</p>
                      <p className="text-xs text-muted-foreground">{shelter.address}, {shelter.city}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{shelter.phone}</span>
                        <span>{shelter.distance}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <Badge variant="secondary" className="text-[10px]">{shelter.type}</Badge>
                      {shelter.acceptsFamilies && <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700"><Users className="h-2.5 w-2.5 mr-0.5" />Families</Badge>}
                      {shelter.acceptsPets && <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">Pets OK</Badge>}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Housing costs */}
          <Separator />
          <Card className="p-3 bg-muted/30">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <DollarSign className="h-3 w-3 inline mr-1" />
              Fair Market Rent — {resources.fairMarketRent.areaName}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">1 BR</p>
                <p className="text-sm font-bold">${resources.fairMarketRent.oneBedroom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">2 BR</p>
                <p className="text-sm font-bold">${resources.fairMarketRent.twoBedroom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">3 BR</p>
                <p className="text-sm font-bold">${resources.fairMarketRent.threeBedroom}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1">HUD FY{resources.fairMarketRent.year}</p>
          </Card>

          <p className="text-[10px] text-center text-muted-foreground">Powered by Shelter API &middot; HUD Fair Market Rents</p>
        </TabsContent>

        {/* ── Social Services (211) ── */}
        <TabsContent value="services" className="mt-3 space-y-2">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.services.map(svc => {
              const Icon = CATEGORY_ICONS[svc.category] || Heart;
              return (
                <motion.div key={svc.id} variants={staggerItem}>
                  <Card className="p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">{svc.provider}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{svc.description}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{svc.phone}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{svc.hours}</span>
                          {svc.distance && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{svc.distance}</span>}
                        </div>
                        <p className="text-[10px] text-primary mt-1">Eligibility: {svc.eligibility}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <p className="text-[10px] text-center text-muted-foreground">Powered by 211 &middot; Open Referral HSDS</p>
        </TabsContent>

        {/* ── Medical ── */}
        <TabsContent value="medical" className="mt-3 space-y-3">
          {/* Health Centers */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Stethoscope className="h-3 w-3 inline mr-1" />
            Nearby Health Centers — No Insurance Required
          </p>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.health.healthCenters.map(hc => (
              <motion.div key={hc.id} variants={staggerItem}>
                <Card className="p-3 border-l-2 border-l-green-400">
                  <p className="text-sm font-medium">{hc.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hc.services.map(s => <Badge key={s} variant="secondary" className="text-[9px] bg-green-50 text-green-700">{s}</Badge>)}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{hc.distance}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{hc.phone}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{hc.hours}</span>
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {hc.slidingScale && <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">Sliding scale</Badge>}
                    {hc.walkInsAccepted && <Badge variant="secondary" className="text-[9px] bg-amber-100 text-amber-700">Walk-ins OK</Badge>}
                    {hc.languages.length > 1 && <Badge variant="secondary" className="text-[9px]">{hc.languages.join(', ')}</Badge>}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Separator />

          {/* Medication Programs */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Pill className="h-3 w-3 inline mr-1" />
            Medication Assistance
          </p>
          {resources.health.medicationPrograms.map(mp => (
            <Card key={mp.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{mp.name}</p>
                  <p className="text-xs text-muted-foreground">{mp.provider}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{mp.description}</p>
                  <p className="text-[10px] text-primary mt-1">How: {mp.howToAccess}</p>
                </div>
                <Badge variant="secondary" className={`text-[9px] shrink-0 ${mp.type === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {mp.type === 'free' ? 'Free' : mp.type === 'discount' ? 'Discount' : 'Assistance'}
                </Badge>
              </div>
            </Card>
          ))}

          <Separator />

          {/* Crisis Lines */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Crisis Lines — 24/7</p>
          <div className="grid grid-cols-1 gap-2">
            {resources.health.crisisLines.map(cl => (
              <Card key={cl.id} className="p-3 bg-red-50/30 border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{cl.name}</p>
                    <p className="text-[11px] text-muted-foreground">{cl.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{cl.phone}</p>
                    {cl.textOption && <p className="text-[10px] text-muted-foreground">{cl.textOption}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-[10px] text-center text-muted-foreground">Powered by HRSA Health Center Finder &middot; NeedyMeds &middot; SAMHSA</p>
        </TabsContent>

        {/* ── Transportation ── */}
        <TabsContent value="transport" className="mt-3 space-y-3">
          {/* Transit Routes */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Bus className="h-3 w-3 inline mr-1" />
            Nearby Bus Routes
          </p>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {resources.transit.routes.map(route => (
              <motion.div key={route.id} variants={staggerItem}>
                <Card className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{route.routeName}</p>
                      <p className="text-xs text-muted-foreground">{route.agency}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Nearest stop: {route.nearestStop} ({route.distanceToStop})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-primary">{route.fare}</p>
                      <p className="text-[10px] text-muted-foreground">Every {route.frequency.replace('Every ', '')}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Separator />

          {/* Transport Services */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Transportation Assistance
          </p>
          {resources.transit.services.map(svc => (
            <Card key={svc.id} className={`p-3 ${svc.type === 'medical_transport' ? 'border-l-2 border-l-green-400 bg-green-50/20' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{svc.name}</p>
                  <p className="text-xs text-muted-foreground">{svc.provider}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{svc.description}</p>
                  <p className="text-[10px] text-primary mt-1">How: {svc.howToAccess}</p>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{svc.phone}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-[9px] shrink-0 ${svc.cost === 'Free' || svc.cost.includes('Free') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {svc.cost}
                </Badge>
              </div>
            </Card>
          ))}

          <p className="text-[10px] text-center text-muted-foreground">Powered by GTFS Transit Feeds &middot; Medicaid NEMT &middot; 211</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
