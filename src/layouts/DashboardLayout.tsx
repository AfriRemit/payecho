import { Outlet, Navigate } from 'react-router-dom';
import { NetworkGuard } from '../components/web3/NetworkGuard';
import { useOnboarding } from '../contexts/OnboardingContext';

export default function DashboardLayout() {
  const { isOnboarded } = useOnboarding();
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
