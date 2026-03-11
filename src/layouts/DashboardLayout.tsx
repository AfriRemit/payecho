import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { NetworkGuard } from '../components/web3/NetworkGuard';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';
import { setPostLoginRedirect } from '../lib/postLoginRedirect';

/** Public path: no login or onboarding required. */
const PUBLIC_TRANSACTIONS_PATH = '/dashboard/transactions';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnboarded } = useOnboarding();
  const { isAuthenticated, ready, login } = useAuth();
  const isPublicTransactions = location.pathname === PUBLIC_TRANSACTIONS_PATH;

  useEffect(() => {
    if (!location.pathname.startsWith('/dashboard')) return;
    if (!ready) return;
    if (isPublicTransactions) return;

    if (!isAuthenticated) {
      toast.info('Log in to access your dashboard pages.', {
        toastId: 'dashboard-login-required',
      });
    } else if (!isOnboarded) {
      toast.info('Create your merchant profile to unlock dashboard features.', {
        toastId: 'dashboard-onboarding-required',
      });
    }
  }, [location.pathname, ready, isAuthenticated, isOnboarded, isPublicTransactions]);

  if (isPublicTransactions) {
    return (
      <div className="min-h-screen bg-primary">
        <main className="flex-1 pt-14 min-h-screen">
          <div className="px-4 sm:px-6 pt-3 pb-6 md:pt-4 md:pb-8 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <p className="text-secondary text-sm">Checking your account…</p>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Navigate to="/register" replace />;
  }

  return (
    <NetworkGuard>
      <div className="min-h-screen bg-primary">
        <main className="flex-1 pt-14 min-h-screen">
          <div className="px-4 sm:px-6 pt-3 pb-6 md:pt-4 md:pb-8 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </NetworkGuard>
  );
}
