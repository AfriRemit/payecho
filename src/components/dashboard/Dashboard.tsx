import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BalanceCard } from '../merchant/BalanceCard';
import { PaymentFeed } from '../merchant/PaymentFeed';
import { CreditScoreCard } from '../merchant/CreditScoreCard';
import { RevenueChart } from '../merchant/RevenueChart';
import { useAuth } from '../../contexts/AuthContext';
import { setPostLoginRedirect } from '../../lib/postLoginRedirect';
import { apiGetJson } from '../../lib/api';

interface DashboardData {
  balance: { liquidUsdc: string; savingsUsdc: string; lockedInLoanUsdc: string };
  payments: Array<{ id: string; amount: string; total: string; payer: string; timestamp: string; txHash: string }>;
  revenue: {
    daily: Array<{ label: string; value: number; usdc: string }>;
    weekly: Array<{ label: string; value: number; usdc: string }>;
    monthly: Array<{ label: string; value: number; usdc: string }>;
  };
  score: number;
  tier: string;
  scoreUpdatedAt?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [revenueRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const navigate = useNavigate();
  const { isAuthenticated, login, address, getToken } = useAuth();

  const loadDashboard = useCallback(async () => {
    if (!address) return;
    setDashboardError(null);
    try {
      const token = await getToken();
      const data = await apiGetJson<DashboardData>(
        `/api/merchants/${address.toLowerCase()}/dashboard`,
        { token },
      );
      setDashboard(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load dashboard';
      setDashboardError(msg);
      setDashboard(null);
    }
  }, [address, getToken]);

  useEffect(() => {
    if (isAuthenticated && address) loadDashboard();
    else setDashboard(null);
  }, [isAuthenticated, address, loadDashboard]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard().finally(() => setTimeout(() => setRefreshing(false), 800));
  };

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      navigate('/register');
    } else {
      setPostLoginRedirect('/register');
      login();
    }
  };

  const liquidUsdc = dashboard?.balance?.liquidUsdc ?? '0.00';
  const savingsUsdc = dashboard?.balance?.savingsUsdc ?? '0.00';
  const lockedUsdc = dashboard?.balance?.lockedInLoanUsdc ?? '0.00';
  const score = dashboard != null ? dashboard.score : null;
  const paymentItems = dashboard ? (dashboard.payments ?? []) : [];
  const revenueData =
    dashboard?.revenue && revenueRange ? dashboard.revenue[revenueRange] : undefined;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-8">
      {/* Hero section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl hero-gradient border border-white/[0.06] p-6 md:p-8"
      >
        <div className="absolute top-4 right-4 z-20">
          <Link
            to="/dashboard/qr"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-green-hover transition-all duration-200 shadow-lg shadow-accent-green/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Create QR code
          </Link>
        </div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-semibold text-accent-green border border-accent-green/20">
              Base
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-secondary border border-white/10">
              USDC
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">
            Your onchain revenue home
          </h1>
          <p className="text-secondary text-base md:text-lg max-w-2xl mb-1">
            Balance, live payment feed, and credit score. Every payment builds your ledger.
          </p>
          <p className="text-accent-green/90 text-sm font-medium italic">
            "When money speaks, identity grows."
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <BalanceCard
            label="Liquid USDC"
            amount={liquidUsdc}
            onRefresh={handleRefresh}
            isLoading={refreshing}
          />
        </motion.div>
        <motion.div variants={item}>
          <BalanceCard
            label="Savings"
            amount={savingsUsdc}
            variant="accent"
            onRefresh={handleRefresh}
            isLoading={refreshing}
          />
        </motion.div>
        <motion.div variants={item}>
          <BalanceCard
            label="Locked in loan"
            amount={lockedUsdc}
            onRefresh={handleRefresh}
            isLoading={refreshing}
          />
        </motion.div>
        <motion.div variants={item}>
          <CreditScoreCard score={score} />
        </motion.div>
      </div>

      {dashboardError && (
        <motion.p variants={item} className="text-sm text-amber-500/90">
          {dashboardError}
        </motion.p>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <PaymentFeed items={paymentItems} onSoundToggle={() => {}} />
        </motion.div>
        <motion.div variants={item}>
          <div className="bg-secondary rounded-xl border border-white/10 p-5 h-full">
            <h2 className="text-lg font-semibold text-primary mb-4">Revenue</h2>
            <RevenueChart data={revenueData} range={revenueRange} />
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-white/10 bg-secondary/80 backdrop-blur-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-lg font-semibold text-primary">New merchant?</h2>
          <p className="text-sm text-secondary">Connect wallet, create profile, and get your QR.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRegisterClick}
            className="rounded-xl bg-accent-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-green-hover transition-colors"
          >
            Register
          </button>
          <Link
            to="/dashboard/qr"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-white/5 transition-colors"
          >
            Get QR
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
