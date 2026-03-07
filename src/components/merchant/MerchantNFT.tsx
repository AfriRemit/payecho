import { motion } from 'framer-motion';

const TIER_COLORS: Record<string, { fill: string; stroke: string; glow: string }> = {
  Seed: { fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', glow: 'rgba(0,179,126,0.15)' },
  Bronze: { fill: 'rgba(205,127,50,0.25)', stroke: '#cd7f32', glow: 'rgba(205,127,50,0.2)' },
  Silver: { fill: 'rgba(192,192,192,0.2)', stroke: '#c0c0c0', glow: 'rgba(192,192,192,0.2)' },
  Gold: { fill: 'rgba(255,215,0,0.2)', stroke: '#ffd700', glow: 'rgba(255,215,0,0.25)' },
  Platinum: { fill: 'rgba(229,228,226,0.25)', stroke: '#e5e4e2', glow: 'rgba(229,228,226,0.2)' },
};

interface MerchantNFTProps {
  tier: string;
  score?: number;
  nextTierScore?: number;
  imageUrl?: string;
}

export function MerchantNFT({ tier, nextTierScore, imageUrl }: MerchantNFTProps) {
  const nextTier = nextTierScore != null ? `Score ${nextTierScore} unlocks next tier` : null;
  const colors = TIER_COLORS[tier] ?? TIER_COLORS.Seed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary rounded-xl border border-white/10 p-5 lg:sticky lg:top-24"
    >
      <h2 className="text-base font-semibold text-primary mb-4">Merchant NFT</h2>
      <div className="flex flex-col items-center">
        {/* NFT card */}
        <div
          className="relative w-full max-w-[200px] rounded-2xl overflow-hidden border-2 transition-colors duration-300"
          style={{
            borderColor: colors.stroke,
            boxShadow: `0 0 24px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
            background: `linear-gradient(165deg, ${colors.fill} 0%, rgba(0,0,0,0.2) 100%)`,
          }}
        >
          <div className="aspect-[3/4] flex flex-col p-4">
            {imageUrl ? (
              <div className="absolute inset-0">
                <img src={imageUrl} alt="Merchant NFT" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            ) : null}
            {/* Badge icon */}
            <div className="flex-1 flex items-center justify-center min-h-[100px]">
              <svg
                viewBox="0 0 80 80"
                className="w-20 h-20 shrink-0 drop-shadow-md"
                aria-hidden
              >
                <defs>
                  <linearGradient id={`nft-shield-grad-${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.1" />
                  </linearGradient>
                  <filter id={`nft-glow-${tier}`}>
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Shield shape */}
                <path
                  d="M40 4 L72 18 V42 C72 58 40 72 8 58 V18 Z"
                  fill={`url(#nft-shield-grad-${tier})`}
                  stroke={colors.stroke}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  filter={`url(#nft-glow-${tier})`}
                />
                {/* Inner check / reputation mark */}
                <path
                  d="M28 42 L36 50 L52 32 L48 28 L36 40 Z"
                  fill={colors.stroke}
                  fillOpacity="0.9"
                />
              </svg>
            </div>
            {/* Tier label */}
            <div className="text-center pt-2 border-t border-white/10">
              <span
                className="text-sm font-bold tracking-wide uppercase"
                style={{ color: colors.stroke }}
              >
                {tier}
              </span>
              <p className="text-[10px] text-secondary mt-0.5 uppercase tracking-wider">
                Reputation token
              </p>
            </div>
          </div>
        </div>
        {/* Caption */}
        <p className="text-xs text-secondary mt-4 text-center">
          Tier badge and metadata update when score crosses tier boundary.
        </p>
        {nextTier && (
          <p className="text-xs font-medium mt-1.5 text-center" style={{ color: colors.stroke }}>
            {nextTier}
          </p>
        )}
      </div>
    </motion.div>
  );
}
