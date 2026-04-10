import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { donations, getTotalMonetaryDonations, households } from '@/data';
import {
  Package,
  Truck,
  Warehouse,
  Clock,
  Hammer,
  Home,
  Droplets,
  Stethoscope,
  Shirt,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Heart,
  HandHelping,
  Wrench,
  Plus,
} from 'lucide-react';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

/* ── Summary KPIs ────────────────────────────────────────── */

const SUMMARY = [
  { label: 'Total Items', value: 340, icon: Package, color: 'text-primary' },
  { label: 'Distributed', value: 280, icon: CheckCircle2, color: 'text-emerald-700' },
  { label: 'In Stock', value: 60, icon: Warehouse, color: 'text-sky-700' },
  { label: 'Pending Delivery', value: 15, icon: Truck, color: 'text-amber-600' },
];

/* ── Category data ───────────────────────────────────────── */

interface ProvisionItem {
  name: string;
  quantity: number;
  status: 'in-stock' | 'low' | 'pending';
}

interface ProvisionCategory {
  id: string;
  name: string;
  icon: typeof Package;
  items: ProvisionItem[];
  distributed: number;
  total: number;
}

const CATEGORIES: ProvisionCategory[] = [
  {
    id: 'cat-building',
    name: 'Building Materials',
    icon: Hammer,
    items: [
      { name: 'Tarps', quantity: 50, status: 'in-stock' },
      { name: 'Drywall sheets', quantity: 120, status: 'in-stock' },
      { name: 'Roofing supplies', quantity: 30, status: 'low' },
    ],
    distributed: 160,
    total: 200,
  },
  {
    id: 'cat-household',
    name: 'Household Items',
    icon: Home,
    items: [
      { name: 'Beds', quantity: 8, status: 'low' },
      { name: 'Furniture sets', quantity: 5, status: 'in-stock' },
      { name: 'Kitchen kits', quantity: 12, status: 'in-stock' },
    ],
    distributed: 20,
    total: 25,
  },
  {
    id: 'cat-food',
    name: 'Food & Water',
    icon: Droplets,
    items: [
      { name: 'Cases of water', quantity: 200, status: 'in-stock' },
      { name: 'Non-perishable food boxes', quantity: 45, status: 'in-stock' },
    ],
    distributed: 180,
    total: 245,
  },
  {
    id: 'cat-medical',
    name: 'Medical Supplies',
    icon: Stethoscope,
    items: [
      { name: 'First aid kits', quantity: 25, status: 'in-stock' },
      { name: 'Prescription delivery', quantity: 8, status: 'pending' },
    ],
    distributed: 22,
    total: 33,
  },
  {
    id: 'cat-clothing',
    name: 'Clothing',
    icon: Shirt,
    items: [
      { name: 'Winter coats', quantity: 30, status: 'in-stock' },
      { name: "Children's clothing boxes", quantity: 18, status: 'in-stock' },
    ],
    distributed: 36,
    total: 48,
  },
];

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  'in-stock': { label: 'In Stock', variant: 'secondary' },
  low: { label: 'Low Stock', variant: 'destructive' },
  pending: { label: 'Pending', variant: 'outline' },
};

function CategoryCard({ category }: { category: ProvisionCategory }) {
  const Icon = category.icon;
  const distributionPct = category.total > 0 ? Math.round((category.distributed / category.total) * 100) : 0;
  const totalItems = category.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div {...cardHover}>
      <Card className="parchment-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-serif font-bold">{category.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{totalItems} items across {category.items.length} types</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Item list */}
          <div className="space-y-2">
            {category.items.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground tabular-nums">{item.quantity}</span>
                    <Badge variant={badge.variant} className="text-[9px]">
                      {badge.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Distribution bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Distribution
              </span>
              <span className="font-semibold text-foreground">
                {category.distributed}/{category.total} ({distributionPct}%)
              </span>
            </div>
            <Progress value={distributionPct} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Donation type badge styles ──────────────────────── */
const DONATION_TYPE_STYLES: Record<string, { label: string; className: string; icon: typeof DollarSign }> = {
  monetary: { label: 'Monetary', className: 'bg-emerald-50 text-emerald-800', icon: DollarSign },
  in_kind: { label: 'In-Kind', className: 'bg-sky-50 text-sky-800', icon: Package },
  service: { label: 'Service', className: 'bg-violet-50 text-violet-800', icon: HandHelping },
};

function DonationsTab({ isDesktop }: { isDesktop: boolean }) {
  const { simulateWrite } = useDemoMode();
  const totalMonetary = getTotalMonetaryDonations();

  return (
    <div className="space-y-6">
      {/* Donation KPIs */}
      <AnimatedSection delay={0.1}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'}`}
        >
          <motion.div variants={staggerItem}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-emerald-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${totalMonetary.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Monetary</p>
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-sky-700">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{donations.length}</p>
                  <p className="text-xs text-muted-foreground">Total Donations</p>
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-amber-600">
                  <HandHelping className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {donations.filter(d => d.householdId).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Designated Gifts</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatedSection>

      {/* Log Donation button */}
      <AnimatedSection delay={0.15}>
        <Button onClick={() => simulateWrite('Donation logged')} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Donation
        </Button>
      </AnimatedSection>

      {/* Donation list */}
      <AnimatedSection delay={0.2}>
        <StaggerList className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {donations.map((donation) => {
            const typeInfo = DONATION_TYPE_STYLES[donation.type];
            const TypeIcon = typeInfo.icon;
            const household = donation.householdId
              ? households.find(h => h.id === donation.householdId)
              : null;

            return (
              <motion.div key={donation.id} {...cardHover}>
                <Card className="parchment-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{donation.donorName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{donation.purpose}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`text-xs shrink-0 ${typeInfo.className}`}>
                      {typeInfo.label}
                    </Badge>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {donation.type === 'monetary' && (
                        <span className="font-semibold text-emerald-700 text-sm">
                          ${donation.amount.toLocaleString()}
                        </span>
                      )}
                      {donation.type === 'in_kind' && donation.amount > 0 && (
                        <span className="font-semibold text-sky-700 text-sm">
                          ~${donation.amount.toLocaleString()} value
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>
                    {household && (
                      <Badge variant="outline" className="text-[10px]">
                        {household.familyName} family
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}

export default function ProvisionsPage() {
  const isDesktop = useIsDesktop();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Provisions</h1>
            <p className="text-sm text-muted-foreground">
              Track supplies, donations, and material resources
            </p>
          </div>
        </div>
      </AnimatedSection>

      <Tabs defaultValue="supplies">
        <AnimatedSection delay={0.05}>
          <TabsList className="mb-4">
            <TabsTrigger value="supplies">
              <Warehouse className="h-3.5 w-3.5 mr-1.5" />
              Supplies
            </TabsTrigger>
            <TabsTrigger value="donations">
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              Donations
            </TabsTrigger>
          </TabsList>
        </AnimatedSection>

        <TabsContent value="supplies">
          {/* Summary KPIs */}
          <AnimatedSection delay={0.1}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`grid gap-4 ${isDesktop ? 'grid-cols-4' : 'grid-cols-2'}`}
            >
              {SUMMARY.map((kpi) => (
                <motion.div key={kpi.label} variants={staggerItem}>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                        <kpi.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>

          {/* Category list */}
          <AnimatedSection delay={0.2}>
            <StaggerList className={`grid gap-4 mt-6 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {CATEGORIES.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </StaggerList>
          </AnimatedSection>
        </TabsContent>

        <TabsContent value="donations">
          <DonationsTab isDesktop={isDesktop} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
