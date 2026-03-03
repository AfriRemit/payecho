import { motion } from 'framer-motion';

const FACTORS = [
  { name: 'Revenue stability', weight: 25, key: 'stability' },
  { name: 'Transaction frequency', weight: 20, key: 'frequency' },
  { name: 'Revenue growth rate', weight: 20, key: 'growth' },
  { name: 'Account age', weight: 15, key: 'age' },
  { name: 'Loan repayment history', weight: 15, key: 'repayment' },
  { name: 'Average transaction size', weight: 5, key: 'avgSize' },
] as const;

interface FactorValue {
  key: string;
  value: number;
}

interface ScoreFactorsProps {
  /** 0–1 per factor */
  factors?: FactorValue[];
}

export function ScoreFactors({ factors = [] }: ScoreFactorsProps) {
  const getFactorValue = (key: string) => {
    const f = factors.find((x) => x.key === key);
    return f?.value ?? 0;
  };

  return (
    <div className="space-y-2">
      {FACTORS.map((f, i) => {
        const val = getFactorValue(f.key);
        const pct = Math.round(val * 100);
        return (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="text-secondary">{f.name}</span>
              <span className="text-primary font-medium">{(pct || '—').toString()}%</span>
            </div>
            <div className="h-2 rounded-full bg-tertiary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent-green"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            </div>
          </motion.div>
        );
      })}
      <p className="text-xs text-secondary mt-4 pt-3 border-t border-white/10">
        Explains what drives your score. Improve each factor to unlock higher tiers.
      </p>
    </div>
  );
}
