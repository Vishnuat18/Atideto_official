import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LogoLoader from '@/components/ui/LogoLoader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LogoLoader size="fullscreen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
