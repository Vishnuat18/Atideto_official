import { Navigate } from 'react-router-dom';
import { useAuth, checkIsAdmin } from '@/hooks/useAuth';
import LogoLoader from '@/components/ui/LogoLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LogoLoader size="fullscreen" />;
  }

  // Fallback to localStorage session check
  let effectiveUser = user;
  if (!effectiveUser) {
    try {
      const saved = localStorage.getItem('atideto_sql_user');
      if (saved) effectiveUser = JSON.parse(saved);
    } catch {}
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
