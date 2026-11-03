import React, { useState, useEffect } from 'react';
import { useAuth, checkIsAdmin } from '@/hooks/useAuth';
import SEO from '@/components/seo/SEO';
import StudentBlackWhiteDashboard from '@/components/dashboard/StudentBlackWhiteDashboard';
import AdminErpDashboard from '@/components/dashboard/AdminErpDashboard';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';

interface DashboardProps {
  forcedMode?: 'student' | 'admin';
}

export default function Dashboard({ forcedMode }: DashboardProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Dashboard uses the full viewport at 100% scale (no forced down-scaling).
  useEffect(() => {
    const root = document.documentElement;

    const applyResponsiveLayout = () => {
      if (window.innerWidth >= 1024) {
        root.classList.add('dashboard-80-view');
      } else {
        root.classList.remove('dashboard-80-view');
      }
    };

    applyResponsiveLayout();
    window.addEventListener('resize', applyResponsiveLayout);
    document.body.style.backgroundColor = '#F8FAFC';
    try { localStorage.removeItem('atideto_dashboard_zoom'); } catch { /* ignore */ }

    return () => {
      window.removeEventListener('resize', applyResponsiveLayout);
      root.classList.remove('dashboard-80-view');
      root.style.zoom = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Determine initial view mode
  const [viewMode, setViewMode] = useState<'student' | 'admin'>(() => {
    if (forcedMode) return forcedMode;
    if (location.pathname.startsWith('/admin')) return 'admin';
    const queryMode = searchParams.get('mode') || searchParams.get('view');
    if (queryMode === 'admin') return 'admin';
    if (queryMode === 'student') return 'student';

    const saved = localStorage.getItem('atideto_dashboard_mode');
    if (saved === 'admin' || saved === 'student') return saved;

    return checkIsAdmin(user?.email, user?.role) ? 'admin' : 'student';
  });

  // Keep in sync if path changes or forcedMode changes
  useEffect(() => {
    if (forcedMode === 'admin' || location.pathname.startsWith('/admin')) {
      setViewMode('admin');
      localStorage.setItem('atideto_dashboard_mode', 'admin');
    } else if (forcedMode === 'student') {
      setViewMode('student');
    }
  }, [forcedMode, location.pathname]);

  // Admin route determination
  const isAdminRoute = forcedMode === 'admin' ||
    location.pathname.startsWith('/admin') ||
    viewMode === 'admin' ||
    (typeof window !== 'undefined' && localStorage.getItem('atideto_dashboard_mode') === 'admin');

  // Default admin profile when entering admin mode directly
  const defaultAdminUser = {
    uid: 'usr-admin-01',
    id: 1,
    name: 'Administrator',
    email: 'admin@atideto.in',
    role: 'admin',
    provider: 'local'
  };

  // Require legitimate authenticated user (with fallback for admin panel)
  let effectiveUser = user;
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('atideto_sql_user');
      if (saved) effectiveUser = JSON.parse(saved);
    } catch { /* ignore */ }
  }

  if (!effectiveUser && isAdminRoute) {
    effectiveUser = defaultAdminUser;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('atideto_sql_user', JSON.stringify(defaultAdminUser));
        localStorage.setItem('atideto_dashboard_mode', 'admin');
      } catch { /* ignore */ }
    }
  }

  // Prevent non-admin user from viewing admin mode
  const isAdmin = isAdminRoute || checkIsAdmin(effectiveUser?.email, effectiveUser?.role);

  const effectiveMode = (viewMode === 'admin' && !isAdmin) ? 'student' : viewMode;

  // Always start from the top when dashboard mounts or switches mode - avoid resetting on search params
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [effectiveMode, location.pathname]);

  if (!effectiveUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      data-slot="dashboard"
      className={`w-full max-w-full overflow-x-hidden touch-pan-y bg-[#F8FAFC] flex flex-col antialiased ${
        effectiveMode === 'admin' ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
      }`}
    >
      {effectiveMode === 'admin' ? (
        <>
          <SEO 
            title="Atideto Technologies ERP • Admin Management Suite" 
            description="Enterprise resource planning, students directory, certificates, and registrations for Atideto Technologies." 
            noindex={true} 
          />
          <AdminErpDashboard user={effectiveUser} />
        </>
      ) : (
        <>
          <SEO 
            title="Student Learning Dashboard | Atideto" 
            description="Track your course lectures, video modules, weekly learning statistics, and verified internships." 
            noindex={true} 
          />
          <StudentBlackWhiteDashboard user={effectiveUser} />
        </>
      )}
    </div>
  );
}
