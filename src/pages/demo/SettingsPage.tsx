import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';
import {
  Building2,
  Users,
  Plug,
  Settings,
  Shield,
  MapPin,
  CloudLightning,
  Bell,
  RefreshCw,
  Radio,
  User,
  Mail,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Director' | 'Coordinator' | 'Navigator' | 'Volunteer';
  status: 'active' | 'invited';
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'available';
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm-001', name: 'Fr. Michael Torres', email: 'mtorres@refugium.org', role: 'Director', status: 'active' },
  { id: 'tm-002', name: 'Sarah Thompson', email: 'sarah.t@refugium.org', role: 'Coordinator', status: 'active' },
  { id: 'tm-003', name: 'David Park', email: 'dpark@refugium.org', role: 'Navigator', status: 'active' },
  { id: 'tm-004', name: 'Maria Santos', email: 'maria.s@refugium.org', role: 'Navigator', status: 'active' },
];

const INTEGRATIONS: Integration[] = [
  { id: 'int-001', name: 'FEMA DisasterAssistance.gov', description: 'Sync household FEMA applications and status updates', status: 'connected' },
  { id: 'int-002', name: '211 Resource Directory', description: 'Search and refer to local social services', status: 'connected' },
  { id: 'int-003', name: 'Mapbox Geocoding', description: 'Address validation and household mapping', status: 'connected' },
  { id: 'int-004', name: 'SNAP Benefits Portal', description: 'Check eligibility and track application status', status: 'available' },
  { id: 'int-005', name: 'USAJOBS Disaster Relief', description: 'Surface disaster-related job opportunities for survivors', status: 'available' },
];

const ROLE_COLORS: Record<string, string> = {
  Director: 'bg-purple-100 text-purple-800',
  Coordinator: 'bg-blue-100 text-blue-800',
  Navigator: 'bg-green-100 text-green-800',
  Volunteer: 'bg-amber-100 text-amber-800',
};

export default function SettingsPage() {
  const isDesktop = useIsDesktop();
  const { simulateWrite } = useDemoMode();

  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [nriSignals, setNriSignals] = useState(true);

  const handleToggle = (label: string, setter: (val: boolean) => void, current: boolean) => {
    setter(!current);
    simulateWrite(`${label} ${current ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <AnimatedSection>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Organization configuration, team management, and integrations.
          </p>
        </div>
      </AnimatedSection>

      <div className={`grid gap-6 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* Organization */}
        <AnimatedSection delay={0.1}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Organization Name
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    Catholic Charities Gulf Coast Recovery
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CloudLightning className="h-3 w-3" />
                    Disaster Event
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    Hurricane Francine 2024
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Region
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    Gulf Coast — Louisiana, Mississippi, Southeast Texas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection delay={0.15}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Team
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => simulateWrite('Team member invited')}
                >
                  Invite
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <StaggerList className="space-y-2">
                {TEAM_MEMBERS.map((member) => (
                  <Card key={member.id} className="p-3 border border-border">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs shrink-0 ${ROLE_COLORS[member.role]}`}
                        variant="secondary"
                      >
                        {member.role}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </StaggerList>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Integrations */}
        <AnimatedSection delay={0.2}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Plug className="h-4 w-4 text-muted-foreground" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {INTEGRATIONS.map((integration) => (
                  <motion.div key={integration.id} variants={staggerItem}>
                    <motion.div {...cardHover}>
                      <Card className="p-3 border border-border">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {integration.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {integration.description}
                            </p>
                          </div>
                          {integration.status === 'connected' ? (
                            <Badge className="text-xs bg-green-100 text-green-800 shrink-0" variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              onClick={() =>
                                simulateWrite(`${integration.name} connected`)
                              }
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Preferences */}
        <AnimatedSection delay={0.25}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {/* Notifications */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified about stalled cases and urgent needs
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={() =>
                    handleToggle('Push Notifications', setNotifications, notifications)
                  }
                />
              </div>

              <Separator />

              {/* Auto-sync */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-Sync</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically sync data with connected integrations
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autoSync}
                  onCheckedChange={() =>
                    handleToggle('Auto-Sync', setAutoSync, autoSync)
                  }
                />
              </div>

              <Separator />

              {/* NRI Signals */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Radio className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">NRI Signals</p>
                    <p className="text-xs text-muted-foreground">
                      Enable AI-powered recovery signals and pattern detection
                    </p>
                  </div>
                </div>
                <Switch
                  checked={nriSignals}
                  onCheckedChange={() =>
                    handleToggle('NRI Signals', setNriSignals, nriSignals)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
