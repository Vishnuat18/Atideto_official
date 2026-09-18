import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import PreFooterCTA from '@/components/layout/PreFooterCTA';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/features/BackToTop';
import FloatingLetsTalk from '@/components/layout/FloatingLetsTalk';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CookieBanner from '@/components/layout/CookieBanner';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';

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
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { ThemeProvider } from '@/context/ThemeContext';
import LogoLoader from '@/components/ui/LogoLoader';

const queryClient = new QueryClient();

const PageWrapper = ({ children, isOverlay = false }: { children: React.ReactNode; isOverlay?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={isOverlay ? "relative z-[200]" : "relative z-0"}
  >
    {children}
  </motion.div>
);

const PageLoader = () => (
  <LogoLoader size="fullscreen" />
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
          <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/terms-and-conditions" element={<PageWrapper><TermsAndConditions /></PageWrapper>} />
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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Navigation />
            <BackToTop />
            <FloatingLetsTalk />
            <StickyMobileCTA />

            <AnimatedRoutes />

            <PreFooterCTA />
            <Footer />
            <CookieBanner />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
