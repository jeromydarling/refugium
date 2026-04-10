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

// Demo
import DemoGate from '@/pages/demo/DemoGate';
import DemoApp from '@/pages/demo/DemoApp';
import OrgDashboard from '@/pages/demo/OrgDashboard';
import BoardView from '@/pages/demo/BoardView';
import PeopleTab from '@/pages/demo/PeopleTab';
import PersonDetailPage from '@/pages/demo/PersonDetailPage';
import RefugeTab from '@/pages/demo/RefugeTab';
import FlowTab from '@/pages/demo/FlowTab';

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

      {/* Demo gate */}
      <Route path="/demo" element={<DemoGate />} />

      {/* Demo app */}
      <Route path="/demo/app" element={<DemoApp />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OrgDashboard />} />
        <Route path="board" element={<BoardView />} />
        <Route path="people" element={<PeopleTab />} />
        <Route path="people/:id" element={<PersonDetailPage />} />
        <Route path="refuge" element={<RefugeTab />} />
        <Route path="flow" element={<FlowTab />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
