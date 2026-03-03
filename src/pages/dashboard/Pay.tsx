import { motion } from 'framer-motion';

/**
 * Customer payment screen — what customers see when they scan a merchant's QR code.
 */
export default function PayPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto min-h-[60vh] flex flex-col justify-center px-4 py-8 sm:px-6"
    >
      <div className="bg-secondary rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {/* Merchant info */}
        <div className="bg-gradient-to-br from-accent-green/15 to-transparent px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">Merchant Store</h2>
              <p className="text-xs text-secondary">Pay with USDC on Base</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="px-6 py-6">
          <label className="block text-sm font-medium text-secondary mb-2">Amount (USDC)</label>
          <div className="flex items-center gap-3 rounded-xl bg-tertiary border border-white/10 px-4 py-4">
            <span className="text-2xl font-bold text-primary">25.00</span>
            <span className="text-secondary text-sm">USDC</span>
          </div>
        </div>

        {/* Connect & pay */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-6 py-8 text-center">
            <svg className="w-12 h-12 text-secondary mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            <p className="text-sm font-medium text-primary mb-1">Connect wallet to pay</p>
            <p className="text-xs text-secondary">Base network · USDC required</p>
            <button
              type="button"
              disabled
              className="mt-4 w-full rounded-xl bg-accent-green/50 px-6 py-3 text-sm font-semibold text-white/80 cursor-not-allowed"
            >
              Pay 25.00 USDC
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-tertiary/50 border-t border-white/10 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-secondary">
            Base
          </span>
          <span className="text-secondary/60">·</span>
          <span className="text-[10px] text-secondary">PayEcho Protocol</span>
        </div>
      </div>
    </motion.div>
  );
}
