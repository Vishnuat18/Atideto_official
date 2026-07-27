import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import PreFooterCTA from '@/components/layout/PreFooterCTA';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/features/BackToTop';
import ScrollToTop from '@/components/layout/ScrollToTop';

const Index = lazy(() => import('./pages/Index'));
const Services = lazy(() => import('./pages/Services'));
const Academy = lazy(() => import('./pages/Academy'));
const About = lazy(() => import('./pages/About'));
const ClientConnect = lazy(() => import('./pages/ClientConnect'));
const Login = lazy(() => import('./pages/Login'));
const RequirementGathering = lazy(() => import('./pages/RequirementGathering'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
import ProtectedRoute from '@/components/layout/ProtectedRoute';

const queryClient = new QueryClient();

const PageWrapper = ({ children, isOverlay }: { children: React.ReactNode, isOverlay?: boolean }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const variants = isMobile
    ? {
        initial: { opacity: 0, x: 25, filter: 'blur(4px)' },
        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, x: -25, filter: 'blur(4px)' }
      }
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -15 }
      };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} // Native app-like spring ease
      className={isOverlay ? "relative z-[200] overflow-x-hidden" : "relative z-0 overflow-x-hidden"}
    >
      {children}
    </motion.div>
  );
};

const PageLoader = () => (
  <div className="flex h-[80vh] w-full items-center justify-center bg-[#050505]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#3B82F6]/20 border-t-[#3B82F6] rounded-full animate-spin"></div>
      <p className="text-[#AFAFAF] text-sm font-medium tracking-widest uppercase animate-pulse">Loading...</p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/academy" element={<PageWrapper><Academy /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/client-connect" element={<PageWrapper><ClientConnect /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper isOverlay><Login /></PageWrapper>} />
          <Route path="/requirement-gathering" element={<PageWrapper><RequirementGathering /></PageWrapper>} />
          <Route path="/locations/:city" element={<PageWrapper><LocationPage /></PageWrapper>} />
          <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <BackToTop />

          <AnimatedRoutes />

          <PreFooterCTA />
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
