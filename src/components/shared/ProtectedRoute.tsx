import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user?.roles?.some((role) => allowedRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard or show unauthorized page
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
