import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

import Navigation from '@/components/layout/Navigation';
import PreFooterCTA from '@/components/layout/PreFooterCTA';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/features/BackToTop';
import FloatingLetsTalk from '@/components/layout/FloatingLetsTalk';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CookieBanner from '@/components/layout/CookieBanner';
import LogoLoader from '@/components/ui/LogoLoader';
import { ThemeProvider } from '@/context/ThemeContext';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import RouteSeoInjector from '@/components/seo/RouteSeoInjector';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { initIdlePreload } from '@/utils/preload';

const Index = lazy(() => import('./pages/Index'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const InternshipDetail = lazy(() => import('./pages/InternshipDetail'));
const Academy = lazy(() => import('./pages/Academy'));
const About = lazy(() => import('./pages/About'));
const ClientConnect = lazy(() => import('./pages/ClientConnect'));
const Login = lazy(() => import('./pages/Login'));
const RequirementGathering = lazy(() => import('./pages/RequirementGathering'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const BotPage = lazy(() => import('./pages/BotPage'));
const Careers = lazy(() => import('./pages/Careers'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const StudentVerify = lazy(() => import('./pages/StudentVerify'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

    // Global Scroll Reveal IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
      elements.forEach((el) => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 30) {
          el.classList.add('revealed');
        }
      });
    };

    const animTimer = setTimeout(observeElements, 60);

    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={isOverlay ? "relative z-[200] w-full min-h-screen" : "relative z-0 w-full min-h-screen overflow-x-hidden"}
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
      <Route path="/services/:serviceId" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
      <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
      <Route path="/courses/:courseId" element={<PageWrapper><CourseDetail /></PageWrapper>} />
      <Route path="/internships/:internshipId" element={<PageWrapper><InternshipDetail /></PageWrapper>} />
      <Route path="/internships" element={<PageWrapper><Academy defaultTab="internships" /></PageWrapper>} />
      <Route path="/upskill/:internshipId" element={<PageWrapper><InternshipDetail /></PageWrapper>} />
      <Route path="/upskill" element={<PageWrapper><Academy defaultTab="internships" /></PageWrapper>} />
      <Route path="/academy" element={<PageWrapper><Academy /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
      <Route path="/careers" element={<PageWrapper><Careers /></PageWrapper>} />
      <Route path="/client-connect" element={<PageWrapper><ClientConnect /></PageWrapper>} />
      <Route path="/login" element={<PageWrapper isOverlay><Login /></PageWrapper>} />
      <Route path="/bot" element={<PageWrapper><BotPage /></PageWrapper>} />
      <Route path="/ai-assistant" element={<PageWrapper><BotPage /></PageWrapper>} />
      <Route path="/requirement-gathering" element={<PageWrapper><RequirementGathering /></PageWrapper>} />
      <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
      <Route path="/terms-and-conditions" element={<PageWrapper><TermsAndConditions /></PageWrapper>} />
      <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><PageWrapper><Dashboard forcedMode="admin" /></PageWrapper></ProtectedRoute>} />
      <Route path="/admin-erp" element={<ProtectedRoute requiredRole="admin"><PageWrapper><Dashboard forcedMode="admin" /></PageWrapper></ProtectedRoute>} />
      <Route path="/studentverify" element={<PageWrapper><StudentVerify /></PageWrapper>} />
      <Route path="/studentverify/:id" element={<PageWrapper><StudentVerify /></PageWrapper>} />
      <Route path="/verify" element={<PageWrapper><StudentVerify /></PageWrapper>} />
      <Route path="/verify/:id" element={<PageWrapper><StudentVerify /></PageWrapper>} />
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
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <BrowserRouter>
                <ScrollToTop />
                <RouteSeoInjector />
                <Navigation />
                <BackToTop />
                <FloatingLetsTalk />

                {/* Suspense boundary for page routes */}
                <Suspense fallback={<LogoLoader size="fullscreen" />}>
                  <AnimatedRoutes />
                  <PreFooterCTA />
                  <Footer />
                </Suspense>

                <CookieBanner />
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
