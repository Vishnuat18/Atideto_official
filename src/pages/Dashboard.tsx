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

  // 80% Viewport Scaling strictly for Admin and Student Dashboards
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    const saved = localStorage.getItem('atideto_dashboard_zoom');
    return saved ? parseFloat(saved) : 0.8;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    const applyResponsiveZoom = () => {
      if (window.innerWidth >= 1024) {
        root.classList.add('dashboard-80-view');
        if ('zoom' in root.style) {
          (root.style as any).zoom = String(zoomLevel);
        }
      } else {
        root.classList.remove('dashboard-80-view');
        if ('zoom' in root.style) {
          (root.style as any).zoom = '1';
        }
      }
    };

    applyResponsiveZoom();
    window.addEventListener('resize', applyResponsiveZoom);
    document.body.style.backgroundColor = '#F8FAFC';

    return () => {
      window.removeEventListener('resize', applyResponsiveZoom);
      root.classList.remove('dashboard-80-view');
      if ('zoom' in root.style) {
        (root.style as any).zoom = '';
      }
      document.body.style.backgroundColor = '';
    };
  }, [zoomLevel]);

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

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    localStorage.setItem('atideto_dashboard_zoom', String(newZoom));
  };

  // Require legitimate authenticated user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Prevent non-admin user from viewing admin mode
  const isAdmin = checkIsAdmin(user?.email, user?.role) ||
    forcedMode === 'admin' ||
    location.pathname.startsWith('/admin') ||
    localStorage.getItem('atideto_dashboard_mode') === 'admin';

  const effectiveMode = (viewMode === 'admin' && !isAdmin) ? 'student' : viewMode;

  // Always start from the top when dashboard mounts or switches mode - avoid resetting on search params
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [effectiveMode, location.pathname]);

  return (
    <div data-slot="dashboard" className="w-full min-h-screen max-w-full overflow-x-hidden touch-pan-y bg-[#F8FAFC] flex flex-col antialiased">
      {effectiveMode === 'admin' ? (
        <>
          <SEO 
            title="Atideto Technologies ERP • Admin Management Suite" 
            description="Enterprise resource planning, students directory, certificates, and registrations for Atideto Technologies." 
            noindex={true} 
          />
          <AdminErpDashboard 
            user={user} 
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
          />
        </>
      ) : (
        <>
          <SEO 
            title="Student Learning Dashboard | Atideto" 
            description="Track your course lectures, video modules, weekly learning statistics, and verified internships." 
            noindex={true} 
          />
          <StudentBlackWhiteDashboard 
            user={user} 
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
          />
        </>
      )}
    </div>
  );
}
