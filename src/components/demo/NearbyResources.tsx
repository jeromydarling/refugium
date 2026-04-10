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
  Users, Baby,
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

      {/* Tabbed resources */}
      <Tabs defaultValue={needs?.includes('employment') ? 'jobs' : 'services'}>
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="jobs" className="text-xs gap-1"><Briefcase className="h-3 w-3" />Jobs</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
