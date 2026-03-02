import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Analytics: React.FC = () => {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Analytics</h1>
        <p className="text-secondary text-sm mt-1">
          Revenue bar chart, volume trend line, peak hours heatmap, top payers.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['daily', 'weekly', 'monthly'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              range === r ? 'bg-accent-green text-white' : 'bg-tertiary text-secondary hover:text-primary'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Revenue</h2>
          <div className="h-48 rounded-lg bg-tertiary/50 flex items-center justify-center text-secondary text-sm">
            Bar chart (Recharts)
          </div>
        </div>
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Volume trend</h2>
          <div className="h-48 rounded-lg bg-tertiary/50 flex items-center justify-center text-secondary text-sm">
            Line chart
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Peak hours</h2>
          <div className="h-40 rounded-lg bg-tertiary/50 flex items-center justify-center text-secondary text-sm">
            7×24 heatmap
          </div>
        </div>
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Top payers</h2>
          <ul className="space-y-2 text-sm text-secondary">
            <li>0x2A01...9EA9 — 12 payments</li>
            <li>0xDc04...d3a1 — 8 payments</li>
            <li>0xae2F...aE13 — 5 payments</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
