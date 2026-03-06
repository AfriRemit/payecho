import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NetworkGuardProps {
  children: ReactNode;
}

/**
 * With Privy, auth and wallet are unified. We only require the user to be logged in
 * (and thus have an embedded or linked wallet on the configured chain).
 */
export function NetworkGuard({ children }: NetworkGuardProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
