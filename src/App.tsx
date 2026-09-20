import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import PreFooterCTA from '@/components/layout/PreFooterCTA';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/features/BackToTop';
import FloatingLetsTalk from '@/components/layout/FloatingLetsTalk';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CookieBanner from '@/components/layout/CookieBanner';
import LogoLoader from '@/components/ui/LogoLoader';
import { ThemeProvider } from '@/context/ThemeContext';
import { initIdlePreload } from '@/utils/preload';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

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

const queryClient = new QueryClient();

// Fast, non-blocking page transition (0.15s instant fade without freezing wait cycles)
const PageWrapper = ({ children, isOverlay = false }: { children: React.ReactNode; isOverlay?: boolean }) => {
  useEffect(() => {
    // When the actual page content mounts, guarantee scroll is reset to top
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={isOverlay ? "relative z-[200]" : "relative z-0"}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
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
  );
};

const App = () => {
  useEffect(() => {
    // Disable browser scroll restoration immediately on mount
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Automatically prefetch primary pages in idle time for zero-latency clicks
    initIdlePreload();
  }, []);

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

            {/* Suspense boundary wrapping the routes, pre-footer, and footer so that during loading,
                ONLY the fullscreen Atideto 'A' logo loader is rendered, completely eliminating
                footer flash and preventing page load from the bottom on refresh. */}
            <Suspense fallback={<LogoLoader size="fullscreen" />}>
              <AnimatedRoutes />
              <PreFooterCTA />
              <Footer />
            </Suspense>

            <CookieBanner />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
