import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BalanceCardProps {
  label: string;
  amount: string;
  variant?: 'default' | 'accent';
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function BalanceCard({ label, amount, variant = 'default', onRefresh, isLoading }: BalanceCardProps) {
  const amountClass = useMemo(
    () => (variant === 'accent' ? 'text-accent-green' : 'text-primary'),
    [variant]
  );

  const isAccent = variant === 'accent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
        isAccent
          ? 'bg-secondary border-accent-green/20 hover:border-accent-green/30'
          : 'bg-secondary border-white/10 hover:border-white/15'
      } ${isAccent ? 'card-glow-hover' : ''}`}
    >
      {isAccent && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent pointer-events-none" />
      )}
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
            {label}
          </p>
          <p className={`text-2xl font-bold ${amountClass} tabular-nums tracking-tight`}>
            {isLoading ? '…' : amount}
          </p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg text-secondary hover:text-accent-green hover:bg-white/5 transition-colors disabled:opacity-50"
            aria-label="Refresh balance"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
