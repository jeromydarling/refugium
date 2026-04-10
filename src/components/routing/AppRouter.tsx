import { Routes, Route, Navigate } from 'react-router-dom';

// Marketing
import MarketingLayout from '@/components/marketing/MarketingLayout';
import Landing from '@/pages/marketing/Landing';
import HowItWorks from '@/pages/marketing/HowItWorks';
import NRI from '@/pages/marketing/NRI';
import Pricing from '@/pages/marketing/Pricing';
import About from '@/pages/marketing/About';
import Contact from '@/pages/marketing/Contact';
import Privacy from '@/pages/marketing/Privacy';
import Terms from '@/pages/marketing/Terms';

// Demo — core pages
import DemoGate from '@/pages/demo/DemoGate';
import DemoApp from '@/pages/demo/DemoApp';
import OrgDashboard from '@/pages/demo/OrgDashboard';
import BoardView from '@/pages/demo/BoardView';
import PeopleTab from '@/pages/demo/PeopleTab';
import PersonDetailPage from '@/pages/demo/PersonDetailPage';
import RefugeTab from '@/pages/demo/RefugeTab';
import FlowTab from '@/pages/demo/FlowTab';
import CalendarView from '@/pages/demo/CalendarView';
import ComingSoonPage from '@/pages/demo/ComingSoonPage';
import SurvivorPortal from '@/pages/SurvivorPortal';

// Not Found
import NotFound from '@/pages/NotFound';

// Coming soon wrappers for CROS features being melded
const ReportsPage = () => <ComingSoonPage title="Reports" description="Impact reports, PDF export, template builder, and scheduled delivery to funders. Powered by CROS reporting engine." crosPage="Reports.tsx" />;
const VisitsPage = () => <ComingSoonPage title="Visits" description="Today's visit schedule with voice notes, field observations, and Ignatian reflection prompts." crosPage="Visits.tsx" />;
const ActivitiesPage = () => <ComingSoonPage title="Activities" description="Unified timeline of all navigator activities — visits, calls, referrals, and field notes." crosPage="Activities.tsx" />;
const AnchorsPage = () => <ComingSoonPage title="Anchors" description="Key partner organizations that are pillars of your disaster response — churches, nonprofits, host families." crosPage="Anchors.tsx" />;
const PipelinePage = () => <ComingSoonPage title="Pipeline" description="Kanban view of partner organizations you're building relationships with over time." crosPage="Pipeline.tsx" />;
const GraphPage = () => <ComingSoonPage title="Connections" description="Visual relationship map showing how families, partners, volunteers, and resources connect." crosPage="RelationshipGraph.tsx" />;
const ZonesPage = () => <ComingSoonPage title="Zones" description="Geographic disaster zones with community data, coverage gaps, and resource allocation." crosPage="Metros.tsx" />;
const ProjectsPage = () => <ComingSoonPage title="Projects" description="Multi-household recovery projects — neighborhood rebuilds, community health initiatives." crosPage="Projects.tsx" />;
const ProvisionsPage = () => <ComingSoonPage title="Provisions" description="Track physical supplies: donated goods, building materials, medical supplies, furniture deliveries." crosPage="Provisions.tsx" />;
const PlaybooksPage = () => <ComingSoonPage title="Playbooks" description="Guided workflows for navigators: how to do an intake, handle a stalled refuge, connect to FEMA." crosPage="Playbooks.tsx" />;
const JournalPage = () => <ComingSoonPage title="Journal" description="Your private field journal — reflect on what you've seen, process what matters, remember why you do this work." crosPage="Impulsus.tsx" />;
const SettingsPage = () => <ComingSoonPage title="Settings" description="Organization configuration, user roles, region assignment, integrations, and preferences." crosPage="Settings.tsx" />;

export function AppRouter() {
  return (
    <Routes>
      {/* Marketing site */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/nri" element={<NRI />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Survivor portal — secret link, no auth */}
      <Route path="/r/:id" element={<SurvivorPortal />} />

      {/* Demo gate */}
      <Route path="/demo" element={<DemoGate />} />

      {/* Demo app */}
      <Route path="/demo/app" element={<DemoApp />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Command */}
        <Route path="dashboard" element={<OrgDashboard />} />
        <Route path="board" element={<BoardView />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Navigator */}
        <Route path="people" element={<PeopleTab />} />
        <Route path="people/:id" element={<PersonDetailPage />} />
        <Route path="refuge" element={<RefugeTab />} />
        <Route path="flow" element={<FlowTab />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="visits" element={<VisitsPage />} />
        <Route path="activities" element={<ActivitiesPage />} />

        {/* Network */}
        <Route path="anchors" element={<AnchorsPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="graph" element={<GraphPage />} />
        <Route path="zones" element={<ZonesPage />} />

        {/* Operations */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="provisions" element={<ProvisionsPage />} />
        <Route path="playbooks" element={<PlaybooksPage />} />

        {/* Personal */}
        <Route path="journal" element={<JournalPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
