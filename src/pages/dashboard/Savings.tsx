import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Savings: React.FC = () => {
  const [savingsBps, setSavingsBps] = useState(1000); // 10%

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Split configurator</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary">Savings</span>
                <span className="text-primary font-medium">{(savingsBps / 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={savingsBps}
                onChange={(e) => setSavingsBps(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-tertiary appearance-none accent-accent-green"
              />
            </div>
            <p className="text-xs text-secondary">Max 30% to savings. Rest stays liquid.</p>
          </div>
        </div>
        <div className="bg-secondary rounded-xl border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-primary">Balances</h2>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-secondary">Liquid USDC</span>
            <span className="font-medium text-primary">0.00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-secondary">Savings</span>
            <span className="font-medium text-accent-green">0.00</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-secondary">Emergency reserve</span>
            <span className="font-medium text-primary">0.00</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Savings;
