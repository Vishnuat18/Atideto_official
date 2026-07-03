import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import PreFooterCTA from '@/components/layout/PreFooterCTA';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/features/BackToTop';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Loader from '@/components/layout/Loader';
import Countdown from '@/components/layout/Countdown';

import Index from './pages/Index';
import Services from './pages/Services';
import Academy from './pages/Academy';
import About from './pages/About';
import ClientConnect from './pages/ClientConnect';
import Login from './pages/Login';
import RequirementGathering from './pages/RequirementGathering';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Set target launch time to 11:20 PM today
const LAUNCH_DATE = new Date();
LAUNCH_DATE.setHours(23, 20, 0, 0);
if (new Date().getTime() >= LAUNCH_DATE.getTime()) {
  LAUNCH_DATE.setDate(LAUNCH_DATE.getDate() + 1);
}

const App = () => {
  const [isLaunched, setIsLaunched] = useState(() => {
    return new Date().getTime() >= LAUNCH_DATE.getTime();
  });
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {!isLaunched ? (
          <Countdown targetDate={LAUNCH_DATE} onLaunch={() => setIsLaunched(true)} />
        ) : (
          <>
            <BrowserRouter>
              <ScrollToTop />
              <Navigation />
              <BackToTop />

              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/about" element={<About />} />
                <Route path="/client-connect" element={<ClientConnect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/requirement-gathering" element={<RequirementGathering />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <PreFooterCTA />
              <Footer />
            </BrowserRouter>

            <AnimatePresence>
              {isLoading && (
                <Loader key="loader" onComplete={() => setIsLoading(false)} />
              )}
            </AnimatePresence>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
