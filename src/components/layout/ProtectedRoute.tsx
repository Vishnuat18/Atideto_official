import { Navigate } from 'react-router-dom';
import { useAuth, checkIsAdmin } from '@/hooks/useAuth';
import LogoLoader from '@/components/ui/LogoLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Check active session immediately from hook or cache
  let effectiveUser = user;
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('atideto_sql_user');
      if (saved) effectiveUser = JSON.parse(saved);
    } catch {}
  }

  // Only display fullscreen loader if no user is cached anywhere and auth is truly initializing
  if (loading && !effectiveUser) {
    return <LogoLoader size="fullscreen" />;
  }

  if (!effectiveUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin') {
    const isAdmin = checkIsAdmin(effectiveUser.email, effectiveUser.role) ||
      (typeof window !== 'undefined' && localStorage.getItem('atideto_dashboard_mode') === 'admin');

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
