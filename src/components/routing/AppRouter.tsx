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

// Demo — full feature pages
import ReportsPage from '@/pages/demo/ReportsPage';
import VisitsPage from '@/pages/demo/VisitsPage';
import ActivitiesPage from '@/pages/demo/ActivitiesPage';
import SettingsPage from '@/pages/demo/SettingsPage';
import AnchorsPage from '@/pages/demo/AnchorsPage';
import PipelinePage from '@/pages/demo/PipelinePage';
import GraphPage from '@/pages/demo/GraphPage';
import ZonesPage from '@/pages/demo/ZonesPage';
import ProjectsPage from '@/pages/demo/ProjectsPage';
import ProvisionsPage from '@/pages/demo/ProvisionsPage';
import PlaybooksPage from '@/pages/demo/PlaybooksPage';
import JournalPage from '@/pages/demo/JournalPage';

// Survivor portal
import SurvivorPortal from '@/pages/SurvivorPortal';

// Not Found
import NotFound from '@/pages/NotFound';

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
