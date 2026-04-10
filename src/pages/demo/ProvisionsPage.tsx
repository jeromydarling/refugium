import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
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
} from 'lucide-react';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

/* ── Summary KPIs ────────────────────────────────────────── */

const SUMMARY = [
  { label: 'Total Items', value: 340, icon: Package, color: 'text-primary' },
  { label: 'Distributed', value: 280, icon: CheckCircle2, color: 'text-green-600' },
  { label: 'In Stock', value: 60, icon: Warehouse, color: 'text-blue-500' },
  { label: 'Pending Delivery', value: 15, icon: Truck, color: 'text-amber-500' },
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
        <StaggerList className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </StaggerList>
      </AnimatedSection>
    </div>
  );
}
