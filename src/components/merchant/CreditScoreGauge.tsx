import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { tierFromScore, type CreditTier } from '../../lib/utils';

const TIER_COLORS: Record<CreditTier, string> = {
  Seed: 'var(--text-secondary)',
  Bronze: '#cd7f32',
  Silver: '#c0c0c0',
  Gold: '#ffd700',
  Platinum: '#e5e4e2',
};

interface CreditScoreGaugeProps {
  score: number | null;
  size?: number;
  showTier?: boolean;
  compact?: boolean;
}

export function CreditScoreGauge({ score, size = 120, showTier = true, compact = false }: CreditScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const normalized = score ?? 0;
  const tier = tierFromScore(normalized);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(normalized), 100);
    return () => clearTimeout(timer);
  }, [normalized]);

  const circumference = 2 * Math.PI * 45;
  const strokeDash = normalized > 0 ? (animatedScore / 1000) * circumference : 0;

  const gaugeSize = compact ? 48 : size;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative shrink-0" style={{ width: gaugeSize, height: gaugeSize }}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
            {normalized > 0 && (
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={TIER_COLORS[tier]}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - strokeDash }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-sm font-bold text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {normalized > 0 ? normalized : '—'}
            </motion.span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          {showTier && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold border w-fit"
              style={{
                backgroundColor: `${TIER_COLORS[tier]}20`,
                color: TIER_COLORS[tier],
                borderColor: `${TIER_COLORS[tier]}50`,
              }}
            >
              {tier}
            </span>
          )}
          <p className="text-xs text-secondary">out of 1000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: gaugeSize, height: gaugeSize }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
          {normalized > 0 && (
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={TIER_COLORS[tier]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - strokeDash }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {normalized > 0 ? normalized : '—'}
          </motion.span>
        </div>
      </div>
      {showTier && (
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold border"
          style={{
            backgroundColor: `${TIER_COLORS[tier]}20`,
            color: TIER_COLORS[tier],
            borderColor: `${TIER_COLORS[tier]}50`,
          }}
        >
          {tier}
        </span>
      )}
      <p className="text-xs text-secondary">out of 1000</p>
    </div>
  );
}
