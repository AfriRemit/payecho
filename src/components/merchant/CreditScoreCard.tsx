import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tierFromScore, type CreditTier } from '../../lib/utils';

const TIER_COLORS: Record<CreditTier, string> = {
  Seed: 'var(--text-secondary)',
  Bronze: '#cd7f32',
  Silver: '#c0c0c0',
  Gold: '#ffd700',
  Platinum: '#e5e4e2',
};

interface CreditScoreCardProps {
  score: number | null;
}

export function CreditScoreCard({ score }: CreditScoreCardProps) {
  const normalized = score ?? 0;
  const tier = tierFromScore(normalized);
  const tierColor = TIER_COLORS[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-secondary p-5 transition-all duration-300 hover:border-white/15"
    >
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
            Credit score
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary tabular-nums tracking-tight">
              {normalized > 0 ? normalized : '—'}
            </p>
            <span
              className="rounded px-2 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: `${tierColor}20`,
                color: tierColor,
              }}
            >
              {tier}
            </span>
          </div>
        </div>
        <Link
          to="/dashboard/identity"
          className="p-2 rounded-lg text-secondary hover:text-accent-green hover:bg-white/5 transition-colors"
          aria-label="View credit score details"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
