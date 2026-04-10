import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import ScrollToTop from "@/components/ScrollToTop";
import { AppRouter } from "@/components/routing/AppRouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      retry: 0,
    },
  },
});

const App = () => (
  <MotionConfig reducedMotion="user">
    <QueryClientProvider client={queryClient}>
      <DemoModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/refugium">
            <ScrollToTop />
            <AppRouter />
          </BrowserRouter>
        </TooltipProvider>
      </DemoModeProvider>
    </QueryClientProvider>
  </MotionConfig>
);

export default App;
