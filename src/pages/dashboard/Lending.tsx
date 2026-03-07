import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LoanPanel } from '../../components/merchant/LoanPanel';
import { MerchantNFT } from '../../components/merchant/MerchantNFT';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetJson } from '../../lib/api';

const NEXT_TIER_SCORE: Record<string, number> = {
  Seed: 300,
  Bronze: 500,
  Silver: 700,
  Gold: 850,
  Platinum: 1000,
};

interface DashboardData {
  balance: { liquidUsdc: string; savingsUsdc: string; lockedInLoanUsdc: string };
  revenue: { daily: unknown[]; weekly: unknown[]; monthly: Array<{ label: string; value: number; usdc: string }> };
  score: number;
  tier: string;
  creditLimit: number;
}

export default function Lending() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, getToken } = useAuth();

  const loadData = useCallback(async () => {
    if (!address) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await apiGetJson<DashboardData>(
        `/api/merchants/${address.toLowerCase()}/dashboard`,
        { token },
      );
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lending data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [address, getToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const creditScore = data?.score ?? 0;
  const currentTier = data?.tier ?? 'Seed';
  const lockedInLoan = data?.balance?.lockedInLoanUsdc ?? '0.00';
  const creditLimit = data?.creditLimit ?? 0;
  const avgMonthlyRevenue =
    data?.revenue?.monthly?.reduce((sum, d) => sum + (d?.value ?? 0), 0) ?? 0;
  const monthlyCount = data?.revenue?.monthly?.length ?? 0;
  const avgMonthly = monthlyCount > 0 ? avgMonthlyRevenue / monthlyCount : 0;
  const isEligible = creditScore >= 300;
  const daysActive = 0;
  const maxLoanUsdc = isEligible
    ? (creditLimit > 0 ? Number(creditLimit) : avgMonthly)
    : 0;
  const nextTierScore = NEXT_TIER_SCORE[currentTier] ?? 300;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Lending</h1>
        <p className="text-secondary text-sm mt-1">
          Revenue-based USDC loans. 15% of each payment auto-deducted until repaid.
        </p>
      </div>

      {error && <p className="text-sm text-amber-500/90">{error}</p>}

      {loading ? (
        <div className="bg-secondary rounded-xl border border-white/10 p-8 text-center text-secondary text-sm">
          Loading…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoanPanel
            isEligible={isEligible}
            daysActive={daysActive}
            creditScore={creditScore}
            avgMonthlyRevenue={avgMonthly}
            currentTier={currentTier}
            maxLoanUsdc={maxLoanUsdc}
            outstandingBalance={lockedInLoan}
          />
          <MerchantNFT tier={currentTier} score={creditScore} nextTierScore={nextTierScore} />
        </div>
      )}
    </motion.div>
  );
}
