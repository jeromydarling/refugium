import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PartnerCard } from '@/components/refuge/PartnerCard';
import { ResourceCard } from '@/components/refuge/ResourceCard';
import PartnerMapView from '@/components/map/PartnerMapView';
import MapLegend from '@/components/map/MapLegend';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { partners, resources } from '@/data';
import { PARTNER_TYPE_COLORS } from '@/config/mapbox';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Info, Map, List } from 'lucide-react';
import { StaggerList } from '@/components/shared/StaggerList';

const PARTNER_TYPE_LABELS: Record<string, string> = {
  church: 'Churches',
  nonprofit: 'Nonprofits',
  government: 'Government',
  host_family: 'Host Families',
  business: 'Businesses',
};

export default function RefugeTab() {
  const [partnerType, setPartnerType] = useState<string>('all');
  const [resourceCat, setResourceCat] = useState<string>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | undefined>(undefined);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list');
  const isDesktop = useIsDesktop();

  const filteredPartners = useMemo(() => {
    if (partnerType === 'all') return partners;
    return partners.filter(p => p.type === partnerType);
  }, [partnerType]);

  const filteredResources = useMemo(() => {
    if (resourceCat === 'all') return resources;
    return resources.filter(r => r.category === resourceCat);
  }, [resourceCat]);

  const legendItems = useMemo(() =>
    Object.entries(PARTNER_TYPE_COLORS).map(([key, color]) => ({
      color,
      label: PARTNER_TYPE_LABELS[key] || key,
    })),
    []
  );

  const infoBanner = (
    <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex gap-2">
      <Info className="h-4 w-4 text-sky-700 shrink-0 mt-0.5" />
      <p className="text-xs text-sky-800">
        In production, Refugium connects to 211 and Findhelp for real-time public resources searchable by ZIP code.
      </p>
    </div>
  );

  // ── Desktop: Resizable split layout ──
  if (isDesktop) {
    return (
      <div className="h-[calc(100vh-105px)]">
        <Tabs defaultValue="partners" className="h-full flex flex-col">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left: Map */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="relative h-full">
                <PartnerMapView
                  partners={filteredPartners}
                  selectedPartnerId={selectedPartnerId}
                  onPartnerSelect={setSelectedPartnerId}
                  className="h-full w-full"
                />
                <MapLegend items={legendItems} className="absolute bottom-4 left-4" />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right: Tabs + lists */}
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className="h-full flex flex-col overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="partners">Partners</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="partners" className="flex-1 overflow-auto px-4 pb-4 space-y-4 mt-0">
                  <Select value={partnerType} onValueChange={setPartnerType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="church">Churches</SelectItem>
                      <SelectItem value="nonprofit">Nonprofits</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="host_family">Host Families</SelectItem>
                      <SelectItem value="business">Businesses</SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-muted-foreground">{filteredPartners.length} Partners</p>

                  <StaggerList className="space-y-3">
                    {filteredPartners.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPartnerId(p.id)}
                        className={`cursor-pointer rounded-lg transition-colors ${
                          selectedPartnerId === p.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <PartnerCard partner={p} />
                      </div>
                    ))}
                  </StaggerList>
                </TabsContent>

                <TabsContent value="resources" className="flex-1 overflow-auto px-4 pb-4 space-y-4 mt-0">
                  <Select value={resourceCat} onValueChange={setResourceCat}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-muted-foreground">{filteredResources.length} Resources</p>

                  <StaggerList className="space-y-3">
                    {filteredResources.map(r => <ResourceCard key={r.id} resource={r} />)}
                  </StaggerList>

                  {infoBanner}
                </TabsContent>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Tabs>
      </div>
    );
  }

  // ── Mobile: Current layout preserved ──
  return (
    <div className="p-4">
      <Tabs defaultValue="partners">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          {/* Map/List toggle for mobile partners */}
          <div className="flex gap-2">
            <Button
              variant={mobileView === 'list' ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setMobileView('list')}
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              variant={mobileView === 'map' ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setMobileView('map')}
            >
              <Map className="h-4 w-4" />
              Map
            </Button>
          </div>

          {mobileView === 'map' ? (
            <div className="h-[60vh] rounded-lg overflow-hidden border">
              <PartnerMapView
                partners={filteredPartners}
                selectedPartnerId={selectedPartnerId}
                onPartnerSelect={setSelectedPartnerId}
                className="h-full w-full"
              />
            </div>
          ) : (
            <>
              <Select value={partnerType} onValueChange={setPartnerType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="church">Churches</SelectItem>
                  <SelectItem value="nonprofit">Nonprofits</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="host_family">Host Families</SelectItem>
                  <SelectItem value="business">Businesses</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-sm text-muted-foreground">{filteredPartners.length} Partners</p>

              <StaggerList className="space-y-3">
                {filteredPartners.map(p => <PartnerCard key={p.id} partner={p} />)}
              </StaggerList>
            </>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Select value={resourceCat} onValueChange={setResourceCat}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="mental_health">Mental Health</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-sm text-muted-foreground">{filteredResources.length} Resources</p>

          <StaggerList className="space-y-3">
            {filteredResources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </StaggerList>

          {infoBanner}
        </TabsContent>
      </Tabs>
    </div>
  );
}
