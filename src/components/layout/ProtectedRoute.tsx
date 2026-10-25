import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Non-admin attempting to view admin ERP gets redirected to student dashboard
    if (requiredRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
