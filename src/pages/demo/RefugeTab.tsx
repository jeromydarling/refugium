import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PartnerCard } from '@/components/refuge/PartnerCard';
import { ResourceCard } from '@/components/refuge/ResourceCard';
import { partners, resources } from '@/data';
import { Info } from 'lucide-react';

export default function RefugeTab() {
  const [partnerType, setPartnerType] = useState<string>('all');
  const [resourceCat, setResourceCat] = useState<string>('all');

  const filteredPartners = useMemo(() => {
    if (partnerType === 'all') return partners;
    return partners.filter(p => p.type === partnerType);
  }, [partnerType]);

  const filteredResources = useMemo(() => {
    if (resourceCat === 'all') return resources;
    return resources.filter(r => r.category === resourceCat);
  }, [resourceCat]);

  return (
    <div className="p-4">
      <Tabs defaultValue="partners">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
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

          <div className="space-y-3">
            {filteredPartners.map(p => <PartnerCard key={p.id} partner={p} />)}
          </div>
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

          <div className="space-y-3">
            {filteredResources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              In production, Refugium connects to 211 and Findhelp for real-time public resources searchable by ZIP code.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
