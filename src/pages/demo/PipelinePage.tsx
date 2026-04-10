import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { partners } from '@/data';
import {
  Building2,
  Church,
  Home,
  Landmark,
  Store,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';

const TYPE_ICON: Record<string, typeof Building2> = {
  church: Church,
  nonprofit: Building2,
  government: Landmark,
  host_family: Home,
  business: Store,
};

const TYPE_LABEL: Record<string, string> = {
  church: 'Church',
  nonprofit: 'Nonprofit',
  government: 'Government',
  host_family: 'Host Family',
  business: 'Business',
};

interface PipelineOrg {
  id: string;
  name: string;
  type: string;
  contactPerson: string;
  daysInStage: number;
  stage: 'identified' | 'contacted' | 'partnered' | 'active';
}

const COLUMN_META: Record<string, { label: string; color: string; bgColor: string }> = {
  identified: { label: 'Identified', color: 'text-slate-600', bgColor: 'bg-slate-50' },
  contacted: { label: 'Contacted', color: 'text-sky-800', bgColor: 'bg-sky-50' },
  partnered: { label: 'Partnered', color: 'text-amber-800', bgColor: 'bg-amber-50' },
  active: { label: 'Active', color: 'text-emerald-800', bgColor: 'bg-emerald-50' },
};

function buildPipelineData(): PipelineOrg[] {
  // Use real partner data + a few fabricated orgs
  const realOrgs: PipelineOrg[] = [
    { id: partners[0].id, name: partners[0].name, type: partners[0].type, contactPerson: partners[0].contactPerson, daysInStage: 120, stage: 'active' },
    { id: partners[1].id, name: partners[1].name, type: partners[1].type, contactPerson: partners[1].contactPerson, daysInStage: 90, stage: 'active' },
    { id: partners[2].id, name: partners[2].name, type: partners[2].type, contactPerson: partners[2].contactPerson, daysInStage: 45, stage: 'active' },
    { id: partners[6].id, name: partners[6].name, type: partners[6].type, contactPerson: partners[6].contactPerson, daysInStage: 30, stage: 'partnered' },
    { id: partners[7].id, name: partners[7].name, type: partners[7].type, contactPerson: partners[7].contactPerson, daysInStage: 21, stage: 'partnered' },
    { id: partners[11].id, name: partners[11].name, type: partners[11].type, contactPerson: partners[11].contactPerson, daysInStage: 14, stage: 'contacted' },
  ];

  const fabricated: PipelineOrg[] = [
    { id: 'pipe-001', name: 'Mercy Housing Alliance', type: 'nonprofit', contactPerson: 'Rev. James Cooper', daysInStage: 7, stage: 'identified' },
    { id: 'pipe-002', name: 'Gulf States Electric Coop', type: 'business', contactPerson: 'Regional Manager', daysInStage: 3, stage: 'identified' },
    { id: 'pipe-003', name: 'Second Harvest Food Bank', type: 'nonprofit', contactPerson: 'Director of Programs', daysInStage: 12, stage: 'contacted' },
    { id: 'pipe-004', name: 'Bayou Community Church', type: 'church', contactPerson: 'Pastor Eleanor Hayes', daysInStage: 18, stage: 'partnered' },
  ];

  return [...realOrgs, ...fabricated];
}

export default function PipelinePage() {
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  const pipelineOrgs = useMemo(() => buildPipelineData(), []);

  const columns = useMemo(() => {
    const stages = ['identified', 'contacted', 'partnered', 'active'] as const;
    return stages.map((stage) => ({
      stage,
      ...COLUMN_META[stage],
      orgs: pipelineOrgs.filter((o) => o.stage === stage),
    }));
  }, [pipelineOrgs]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              Organizations you're building relationships with
            </p>
          </div>
          <Button
            size="sm"
            className="text-xs"
            onClick={() => simulateWrite('New organization added to pipeline')}
          >
            + Add Organization
          </Button>
        </div>
      </AnimatedSection>

      {/* Kanban */}
      <AnimatedSection delay={0.15}>
        <div
          className={
            isDesktop
              ? 'grid grid-cols-4 gap-4'
              : 'space-y-6'
          }
        >
          {columns.map((col) => (
            <div key={col.stage} className="space-y-3">
              {/* Column header */}
              <div className={`rounded-lg px-3 py-2 ${col.bgColor}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-sm font-semibold ${col.color}`}>{col.label}</h2>
                  <Badge variant="secondary" className="text-[10px]">
                    {col.orgs.length}
                  </Badge>
                </div>
              </div>

              {/* Cards */}
              <StaggerList className="space-y-2">
                {col.orgs.map((org) => {
                  const OrgIcon = TYPE_ICON[org.type] || Building2;
                  return (
                    <Card
                      key={org.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => simulateWrite(`Opened ${org.name}`)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <OrgIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {org.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {TYPE_LABEL[org.type] || org.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {org.daysInStage}d in stage
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{org.contactPerson}</span>
                        </div>
                        {col.stage !== 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-7 text-[11px] mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              simulateWrite(`Moved ${org.name} to next stage`);
                            }}
                          >
                            Advance <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {col.orgs.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No organizations in this stage
                  </div>
                )}
              </StaggerList>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
