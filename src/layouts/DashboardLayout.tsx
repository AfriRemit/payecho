import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { NetworkGuard } from '../components/web3/NetworkGuard';
import { useOnboarding } from '../contexts/OnboardingContext';

/** Public path: no login or onboarding required. */
const PUBLIC_TRANSACTIONS_PATH = '/dashboard/transactions';

export default function DashboardLayout() {
  const location = useLocation();
  const { isOnboarded } = useOnboarding();
  const isPublicTransactions = location.pathname === PUBLIC_TRANSACTIONS_PATH;

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
