import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TIERS = [
  { name: 'Seed', scoreMin: 0, scoreMax: 299, multiple: '0×', rate: '—', status: 'locked' },
  { name: 'Bronze', scoreMin: 300, scoreMax: 499, multiple: '1×', rate: '8%', status: 'available' },
  { name: 'Silver', scoreMin: 500, scoreMax: 699, multiple: '2×', rate: '6%', status: 'available' },
  { name: 'Gold', scoreMin: 700, scoreMax: 849, multiple: '3×', rate: '4%', status: 'available' },
  { name: 'Platinum', scoreMin: 850, scoreMax: 1000, multiple: '5×', rate: '2%', status: 'available' },
] as const;

const Lending: React.FC = () => {
  const [amount, setAmount] = useState('');
  const isEligible = false; // Replace with real: 90+ days history && score >= 300
  const daysActive = 0; // Replace with real onboarding/ first payment date
  const creditScore = 0; // Replace with real score
  const avgMonthlyRevenue = 0; // Replace with real from ledger
  const currentTier = TIERS[0];
  const maxLoanUsdc = isEligible && avgMonthlyRevenue > 0 ? avgMonthlyRevenue : 0; // 1× for Bronze; use tier multiple in real impl

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-primary">Lending</h1>
          <p className="text-secondary text-sm mt-1">
            Revenue-based USDC loans. Repay automatically from 15% of each payment.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="text-sm text-secondary hover:text-accent-green transition-colors flex items-center gap-1.5 w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>
      </div>

      {/* Eligibility & status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-secondary rounded-2xl border border-white/10 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-primary">Eligibility</h2>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  isEligible
                    ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                    : 'bg-tertiary text-secondary border border-white/10'
                }`}
              >
                {isEligible ? 'Eligible' : 'Locked'}
              </span>
            </div>
            {!isEligible && (
              <>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Payment history</span>
                    <span className="text-primary font-medium">{daysActive} of 90 days</span>
                  </div>
                  <div className="h-2 rounded-full bg-tertiary overflow-hidden">
                    <div
                      className="h-full bg-accent-green rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (daysActive / 90) * 100)}%` }}
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-secondary">
                  <li className="flex items-center gap-2">
                    {daysActive >= 90 ? (
                      <span className="text-accent-green">✓</span>
                    ) : (
                      <span className="text-secondary">○</span>
                    )}
                    90+ days of on-chain payment history
                  </li>
                  <li className="flex items-center gap-2">
                    {creditScore >= 300 ? (
                      <span className="text-accent-green">✓</span>
                    ) : (
                      <span className="text-secondary">○</span>
                    )}
                    Credit score ≥ 300 (current: {creditScore || '—'})
                  </li>
                </ul>
                <p className="text-xs text-secondary mt-4 pt-4 border-t border-white/10">
                  Once eligible, you can request a USDC loan. 15% of each incoming payment is
                  auto-deducted until the loan is repaid. Interest is a one-time flat fee at
                  disbursement (2–8% by tier).
                </p>
              </>
            )}
            {isEligible && (
              <p className="text-sm text-secondary">
                You meet the requirements. Your tier determines max loan size and fee. Request a
                loan below; 15% of each payment will go toward repayment until the balance is cleared.
              </p>
            )}
          </div>

          {/* Tier table */}
          <div className="bg-secondary rounded-2xl border border-white/10 p-5 overflow-hidden">
            <h3 className="text-sm font-semibold text-primary mb-3">Loan by tier</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
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
                      className={`border-b border-white/5 ${
                        t.name === currentTier.name ? 'bg-tertiary/30' : ''
                      }`}
                    >
                      <td className="py-2.5 pr-4 font-medium text-primary">{t.name}</td>
                      <td className="py-2.5 pr-4 text-secondary">
                        {t.scoreMin}–{t.scoreMax}
                      </td>
                      <td className="py-2.5 pr-4 text-primary">{t.multiple} avg monthly revenue</td>
                      <td className="py-2.5 text-accent-green">{t.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Request loan card */}
        <div>
          <div className="bg-secondary rounded-2xl border border-white/10 p-5 sticky top-24">
            <h2 className="text-lg font-semibold text-primary mb-4">Request loan</h2>
            {isEligible && maxLoanUsdc > 0 && (
              <p className="text-xs text-secondary mb-3">
                Max: <span className="text-accent-green font-medium">{maxLoanUsdc.toFixed(2)} USDC</span> (1×
                avg monthly revenue for Bronze)
              </p>
            )}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-primary">Amount (USDC)</label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={!isEligible}
                className="w-full rounded-xl bg-tertiary border border-white/10 px-4 py-3 text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 disabled:opacity-60"
              />
              {isEligible && (
                <p className="text-xs text-secondary">
                  Flat fee at disbursement (e.g. 8% for Bronze). 15% of each payment auto-repaid.
                </p>
              )}
              <button
                type="button"
                disabled={!isEligible}
                className="w-full rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-accent-green text-white hover:bg-accent-green-hover disabled:bg-tertiary disabled:text-secondary disabled:hover:bg-tertiary"
              >
                {isEligible ? 'Request loan' : 'Unlock by building 90 days history'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Repayment schedule */}
      <div className="bg-secondary rounded-2xl border border-white/10 p-5 md:p-6">
        <h2 className="text-lg font-semibold text-primary mb-1">Repayment schedule</h2>
        <p className="text-sm text-secondary mb-4">
          15% of each incoming USDC payment is auto-deducted until the loan is repaid.
        </p>
        <div className="rounded-xl bg-tertiary/50 border border-white/5 p-6 text-center">
          <p className="text-secondary text-sm">No active loan</p>
          <p className="text-xs text-secondary mt-1">
            Repayments and outstanding balance will appear here once you have an active loan.
          </p>
        </div>
      </div>

      {/* Merchant NFT */}
      <div className="bg-secondary rounded-2xl border border-white/10 p-5 md:p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Merchant NFT</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-tertiary border border-white/10 flex items-center justify-center text-secondary text-xs shrink-0">
            NFT
          </div>
          <div>
            <p className="text-primary font-medium">Reputation token</p>
            <p className="text-sm text-secondary">Tier badge and metadata update when score crosses tier.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Lending;
