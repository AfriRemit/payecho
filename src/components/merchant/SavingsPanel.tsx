import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { bpsToPercent } from '../../lib/utils';

interface SavingsPanelProps {
  savingsBps: number;
  onSavingsChange: (bps: number) => void;
  liquidBalance?: string;
  savingsBalance?: string;
  emergencyBalance?: string;
  taxBalance?: string;
  /** Max savings % from contract (bps). Default 3000 (30%). */
  maxSavingsBps?: number;
}

const DEFAULT_SAVINGS_MAX_BPS = 3000; // 30%
const EMERGENCY_BPS = 500; // 5% fixed
const TAX_BPS = 500; // 5% fixed

export function SavingsPanel({
  savingsBps,
  onSavingsChange,
  liquidBalance = '0.00',
  savingsBalance = '0.00',
  emergencyBalance = '0.00',
  taxBalance = '0.00',
  maxSavingsBps = DEFAULT_SAVINGS_MAX_BPS,
}: SavingsPanelProps) {
  const savingsMax = Math.max(0, Math.min(5000, maxSavingsBps)); // clamp 0–50%
  const savingsPct = savingsBps / 100;
  const emergencyPct = EMERGENCY_BPS / 100;
  const taxPct = TAX_BPS / 100;
  const liquidPct = 100 - savingsPct - emergencyPct - taxPct;

  const preview = useMemo(
    () => ({
      liquid: Math.max(0, liquidPct),
      savings: savingsPct,
      emergency: emergencyPct,
      tax: taxPct,
    }),
    [liquidPct, savingsPct, emergencyPct, taxPct]
  );

  const balanceRows: { label: string; value: string; accent?: boolean; hint?: string }[] = [
    { label: 'Liquid USDC', value: liquidBalance },
    { label: 'Savings', value: savingsBalance, accent: true },
    { label: 'Emergency reserve', value: emergencyBalance, hint: '30-day lock · 2% early penalty' },
    { label: 'Tax buffer', value: taxBalance, hint: 'Quarterly export' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Split configurator */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary rounded-xl border border-white/10 p-6"
      >
        <h2 className="text-lg font-semibold text-primary mb-1">Split configurator</h2>
        <p className="text-sm text-secondary mb-4">
          Max 30% to savings. Emergency and tax fixed at 5% each.
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary">Savings</span>
              <span className="text-accent-green font-semibold tabular-nums">{bpsToPercent(savingsBps)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={savingsMax}
              step="100"
              value={Math.min(savingsBps, savingsMax)}
              onChange={(e) => onSavingsChange(Number(e.target.value))}
              className="w-full h-3 rounded-full bg-tertiary appearance-none accent-accent-green cursor-pointer"
            />
          </div>
          <div className="rounded-lg bg-tertiary/50 border border-white/5 p-3">
            <p className="text-xs font-medium text-secondary mb-2">Next payment split</p>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="bg-accent-green/60 transition-all" style={{ width: `${preview.liquid}%` }} />
              <div className="bg-accent-green transition-all" style={{ width: `${preview.savings}%` }} />
              <div className="bg-accent-green/80 transition-all" style={{ width: `${preview.emergency}%` }} />
              <div className="bg-accent-green/70 transition-all" style={{ width: `${preview.tax}%` }} />
            </div>
            <div className="flex flex-wrap gap-x-3 mt-1.5 text-xs text-secondary">
              <span>Liquid {preview.liquid}%</span>
              <span className="text-accent-green">Savings {preview.savings}%</span>
              <span>Emergency {preview.emergency}%</span>
              <span>Tax {preview.tax}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Balances */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-secondary rounded-xl border border-white/10 p-6"
      >
        <h2 className="text-lg font-semibold text-primary mb-4">Balances</h2>
        <div className="space-y-0">
          {balanceRows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between items-center gap-4 py-2.5 border-b border-white/5 last:border-0"
            >
              <div className="min-w-0">
                <span className="text-secondary text-sm">{row.label}</span>
                {row.hint && (
                  <p className="text-xs text-secondary/70">{row.hint}</p>
                )}
              </div>
              <span
                className={`font-semibold tabular-nums shrink-0 text-right ${
                  row.accent === true ? 'text-accent-green' : 'text-primary'
                }`}
              >
                {row.value} USDC
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-secondary mt-3 pt-3 border-t border-white/10">
          Default: 80% liquid · 10% savings · 5% emergency · 5% tax.
        </p>
      </motion.div>
    </div>
  );
}
