import { useState } from 'react';
import { motion } from 'framer-motion';

const TIERS = [
  { name: 'Seed', scoreMin: 0, scoreMax: 299, multiple: '0×', rate: '—' },
  { name: 'Bronze', scoreMin: 300, scoreMax: 499, multiple: '1×', rate: '8%' },
  { name: 'Silver', scoreMin: 500, scoreMax: 699, multiple: '2×', rate: '6%' },
  { name: 'Gold', scoreMin: 700, scoreMax: 849, multiple: '3×', rate: '4%' },
  { name: 'Platinum', scoreMin: 850, scoreMax: 1000, multiple: '5×', rate: '2%' },
] as const;

interface LoanPanelProps {
  isEligible: boolean;
  daysActive: number;
  creditScore: number;
  avgMonthlyRevenue?: number;
  currentTier: string;
  maxLoanUsdc: number;
  outstandingBalance?: string;
  repayments?: { amount: string; date: string; remaining: string }[];
}

export function LoanPanel({
  isEligible,
  daysActive,
  creditScore,
  currentTier,
  maxLoanUsdc,
  outstandingBalance = '0.00',
  repayments = [],
}: LoanPanelProps) {
  const [amount, setAmount] = useState('');

  return (
    <div className="space-y-6">
      {/* Eligibility + Request loan side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-semibold text-primary">Eligibility</h2>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isEligible
                  ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                  : 'bg-tertiary text-secondary border border-white/10'
              }`}
            >
              {isEligible ? 'Eligible' : 'Locked'}
            </span>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Payment history</span>
              <span className="text-primary font-medium tabular-nums">{daysActive}/90 days</span>
            </div>
            <div className="h-1.5 rounded-full bg-tertiary overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full transition-all"
                style={{ width: `${Math.min(100, (daysActive / 90) * 100)}%` }}
              />
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-secondary">
            <li className="flex items-center gap-2">
              {daysActive >= 90 ? (
                <span className="text-accent-green">✓</span>
              ) : (
                <span className="text-secondary/60">○</span>
              )}
              90+ days on-chain history
            </li>
            <li className="flex items-center gap-2">
              {creditScore >= 300 ? (
                <span className="text-accent-green">✓</span>
              ) : (
                <span className="text-secondary/60">○</span>
              )}
              Score ≥ 300 (current: {creditScore || '—'})
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-secondary rounded-xl border border-white/10 p-5"
        >
          <h2 className="text-base font-semibold text-primary mb-3">Request loan</h2>
          {isEligible && maxLoanUsdc > 0 && (
            <p className="text-xs text-secondary mb-2">
              Max <span className="text-accent-green font-semibold">{maxLoanUsdc.toFixed(2)} USDC</span>
            </p>
          )}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-secondary">Amount (USDC)</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={!isEligible}
              className="w-full rounded-lg bg-tertiary border border-white/10 px-3 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green/50 disabled:opacity-50"
            />
            <button
              type="button"
              disabled={!isEligible}
              className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed bg-accent-green text-white hover:bg-accent-green-hover disabled:bg-tertiary disabled:text-secondary disabled:opacity-60"
            >
              {isEligible ? 'Request loan' : 'Build 90 days history'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Loan by tier */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-secondary rounded-xl border border-white/10 p-5 overflow-hidden"
      >
        <h3 className="text-sm font-semibold text-primary mb-3">Loan by tier</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[320px]">
            <thead>
              <tr className="border-b border-white/10 text-secondary">
                <th className="pb-2 pr-4 font-medium">Tier</th>
                <th className="pb-2 pr-4 font-medium">Score</th>
                <th className="pb-2 pr-4 font-medium">Max loan</th>
                <th className="pb-2 font-medium">Fee</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr
                  key={t.name}
                  className={`border-b border-white/5 last:border-0 ${
                    t.name === currentTier ? 'bg-tertiary/30' : ''
                  }`}
                >
                  <td className="py-2 pr-4 font-medium text-primary">{t.name}</td>
                  <td className="py-2 pr-4 text-secondary">
                    {t.scoreMin}–{t.scoreMax}
                  </td>
                  <td className="py-2 pr-4 text-primary">{t.multiple}× avg monthly revenue</td>
                  <td className="py-2 text-accent-green">{t.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Repayment schedule */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-secondary rounded-xl border border-white/10 p-5"
      >
        <h2 className="text-base font-semibold text-primary mb-1">Repayment schedule</h2>
        <p className="text-xs text-secondary mb-4">
          15% of each incoming USDC payment auto-deducted until repaid.
        </p>
        {repayments.length > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-secondary">
              <span>Outstanding</span>
              <span className="text-primary">{outstandingBalance} USDC</span>
            </div>
            {repayments.map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-white/5 text-sm last:border-0"
              >
                <span className="text-secondary">{r.date}</span>
                <span className="text-accent-green">{r.amount} USDC</span>
                <span className="text-primary">{r.remaining} left</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-tertiary/50 border border-white/5 p-4 text-center">
            <p className="text-secondary text-sm">No active loan</p>
            <p className="text-xs text-secondary/80 mt-0.5">
              Repayments appear here once you have an active loan.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
