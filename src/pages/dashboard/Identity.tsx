import React from 'react';
import { motion } from 'framer-motion';

const TIERS = ['Seed', 'Bronze', 'Silver', 'Gold', 'Platinum'] as const;
const FACTORS = [
  { name: 'Revenue stability', weight: '25%', value: '—' },
  { name: 'Transaction frequency', weight: '20%', value: '—' },
  { name: 'Revenue growth', weight: '20%', value: '—' },
  { name: 'Account age', weight: '15%', value: '—' },
  { name: 'Loan repayment', weight: '15%', value: '—' },
  { name: 'Avg transaction size', weight: '5%', value: '—' },
];

const Identity: React.FC = () => {
  const score = 0;
  const tier = TIERS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Identity</h1>
        <p className="text-secondary text-sm mt-1">
          Credit score 0–1000, tier badge, factor breakdown. NFT and SBT when available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Credit score</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--accent-green)"
                  strokeWidth="2"
                  strokeDasharray={`${score / 10}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{score}</p>
              <p className="text-sm text-secondary">out of 1000</p>
              <span className="inline-block mt-2 rounded-full bg-tertiary px-3 py-1 text-xs font-medium text-primary border border-white/10">
                {tier}
              </span>
            </div>
          </div>
          <p className="text-xs text-secondary mt-4">Score updates every 24h from onchain revenue data.</p>
        </div>
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Score factors</h2>
          <ul className="space-y-2">
            {FACTORS.map((f) => (
              <li key={f.name} className="flex justify-between items-center text-sm">
                <span className="text-secondary">{f.name}</span>
                <span className="text-primary font-medium">{f.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-secondary rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Merchant NFT</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-tertiary border border-white/10 flex items-center justify-center text-secondary text-xs">
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

export default Identity;
