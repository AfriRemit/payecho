import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SavingsPanel } from '../../components/merchant/SavingsPanel';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetJson } from '../../lib/api';

export default function Savings() {
  const [savingsBps, setSavingsBps] = useState(1000);
  const [data, setData] = useState<{
    balance: { liquidUsdc: string; savingsUsdc: string };
    savingsRateBps: number;
    maxSavingsBps: number;
  } | null>(null);
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
      const res = await apiGetJson<{
        balance: { liquidUsdc: string; savingsUsdc: string };
        savingsRateBps: number;
        maxSavingsBps: number;
      }>(`/api/merchants/${address.toLowerCase()}/dashboard`, { token });
      setData(res);
      setSavingsBps(typeof res.savingsRateBps === 'number' ? res.savingsRateBps : 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load savings data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [address, getToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const liquidBalance = data?.balance?.liquidUsdc ?? '0.00';
  const savingsBalance = data?.balance?.savingsUsdc ?? '0.00';
  const emergencyBalance = '0.00';
  const taxBalance = '0.00';
  const maxSavingsBps = data?.maxSavingsBps ?? 3000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Savings</h1>
        <p className="text-secondary text-sm mt-1">
          Configure % split (enforced at contract). Default: 80% liquid · 10% savings · 5% emergency · 5% tax.
        </p>
      </div>

      {error && <p className="text-sm text-amber-500/90">{error}</p>}

      {loading ? (
        <div className="bg-secondary rounded-xl border border-white/10 p-8 text-center text-secondary text-sm">
          Loading…
        </div>
      ) : (
        <SavingsPanel
          savingsBps={savingsBps}
          onSavingsChange={setSavingsBps}
          liquidBalance={liquidBalance}
          savingsBalance={savingsBalance}
          emergencyBalance={emergencyBalance}
          taxBalance={taxBalance}
          maxSavingsBps={maxSavingsBps}
        />
      )}
    </motion.div>
  );
}
