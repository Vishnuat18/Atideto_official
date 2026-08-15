import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchMe, type AdminUser } from '@/lib/adminApi';

/**
 * Guards /admin/* routes. Checks the session cookie via GET /api/admin/auth/me.
 * Redirects to /admin/login when unauthenticated.
 */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<{ loading: boolean; admin: AdminUser | null }>({ loading: true, admin: null });

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((admin) => {
        if (!cancelled) setState({ loading: false, admin });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, admin: null });
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (state.loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#E0E7FF] border-t-[#2F2FE4] rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
