import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import PreFooterCTA from '@/components/layout/PreFooterCTA';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/features/BackToTop';
import ScrollToTop from '@/components/layout/ScrollToTop';
import StickyLetsTalk from '@/components/layout/StickyLetsTalk';

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
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminApplicationDetail = lazy(() => import('./pages/admin/AdminApplicationDetail'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const RequireAdmin = lazy(() => import('./pages/admin/RequireAdmin'));
import ProtectedRoute from '@/components/layout/ProtectedRoute';

const queryClient = new QueryClient();

const PageWrapper = ({ children, isOverlay }: { children: React.ReactNode, isOverlay?: boolean }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const variants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      };

  return (
    <motion.div
      id="main-content"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`app-page-shell route-${location.pathname === '/' ? 'home' : location.pathname.split('/')[1] || 'not-found'} ${isOverlay ? "relative z-[200]" : "relative z-0"} overflow-x-hidden scroll-mt-24 flex-1 flex flex-col w-full`}
    >
      {children}
    </motion.div>
  );
};

const PageLoader = () => (
  <div className="flex h-[80vh] w-full items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#E0E7FF] border-t-[#2F2FE4] rounded-full animate-spin"></div>
      <p className="text-[#64748B] text-sm font-medium tracking-widest uppercase animate-pulse">Loading...</p>
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
          <Route path="/verify/:certificateId" element={<PageWrapper><VerifyCertificate /></PageWrapper>} />
          <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />

          {/* Admin console — standalone layout, no public chrome */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="applications/:applicationId" element={<AdminApplicationDetail />} />
            <Route path="certificates" element={<AdminCertificates />} />
          </Route>

          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

/**
 * Public layout wrapper: navigation & floating widgets at top/floating levels,
 * main page content in flex-1 main container, and PreFooterCTA + Footer at the end of the page.
 */
const MainLayout = () => {
  const location = useLocation();
  const isStandalone =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/verify');

  if (isStandalone) {
    return <AnimatedRoutes />;
  }

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-clip">
      <Navigation />
      <BackToTop />
      <StickyLetsTalk />
      <main className="flex-1 w-full flex flex-col">
        <AnimatedRoutes />
      </main>
      <PreFooterCTA />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
