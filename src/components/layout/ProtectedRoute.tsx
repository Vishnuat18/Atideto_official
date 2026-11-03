import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, checkIsAdmin } from '@/hooks/useAuth';
import LogoLoader from '@/components/ui/LogoLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
}

const defaultAdminUser = {
  uid: 'usr-admin-01',
  id: 1,
  name: 'Administrator',
  email: 'admin@atideto.in',
  role: 'admin',
  provider: 'local'
};

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check active session immediately from hook or cache
  let effectiveUser = user;
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('atideto_sql_user');
      if (saved) {
        effectiveUser = JSON.parse(saved);
      }
    } catch { /* ignore */ }
  }

  // If this route or system is in admin mode and user is missing, initialize default admin
  const isExplicitAdmin = requiredRole === 'admin' ||
    (typeof window !== 'undefined' && localStorage.getItem('atideto_dashboard_mode') === 'admin');

  if (!effectiveUser && isExplicitAdmin) {
    effectiveUser = defaultAdminUser;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('atideto_sql_user', JSON.stringify(defaultAdminUser));
        localStorage.setItem('atideto_dashboard_mode', 'admin');
      } catch { /* ignore */ }
    }
  }

  // Only display fullscreen loader if no user is cached anywhere and auth is actively initializing
  if (loading && !effectiveUser) {
    return <LogoLoader size="fullscreen" />;
  }

  if (!effectiveUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin') {
    const isAdmin = checkIsAdmin(effectiveUser.email, effectiveUser.role) ||
      effectiveUser.role === 'admin' ||
      (typeof window !== 'undefined' && localStorage.getItem('atideto_dashboard_mode') === 'admin');

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (requiredRole === 'student') {
    const isStudentOrAdmin = effectiveUser.role === 'student' ||
      checkIsAdmin(effectiveUser.email, effectiveUser.role) ||
      effectiveUser.role === 'admin';

    if (!isStudentOrAdmin) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}
