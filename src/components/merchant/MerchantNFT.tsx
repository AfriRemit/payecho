import { motion } from 'framer-motion';

interface MerchantNFTProps {
  tier: string;
  score?: number;
  nextTierScore?: number;
  imageUrl?: string;
}

export function MerchantNFT({ tier, nextTierScore, imageUrl }: MerchantNFTProps) {
  const nextTier = nextTierScore != null ? `Score ${nextTierScore} unlocks next tier` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary rounded-xl border border-white/10 p-5 lg:sticky lg:top-24"
    >
      <h2 className="text-base font-semibold text-primary mb-4">Merchant NFT</h2>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-tertiary border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt="Merchant NFT" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-secondary">◆</span>
          )}
        </div>
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-accent-green/20 text-accent-green px-2 py-0.5 text-xs font-semibold mb-2">
            {tier}
          </span>
          <p className="text-primary font-medium text-sm">Reputation token</p>
          <p className="text-xs text-secondary mt-0.5">
            Tier badge and metadata update when score crosses tier boundary.
          </p>
          {nextTier && (
            <p className="text-xs text-accent-green mt-1.5">{nextTier}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
