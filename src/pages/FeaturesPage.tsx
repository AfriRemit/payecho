import { motion } from 'framer-motion';

export default function FeaturesPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl space-y-8"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Features</h1>
          <p className="text-secondary text-sm sm:text-base max-w-2xl">
            From QR payments and AI voice to savings and lending, Payecho ships a full-stack experience designed for
            informal merchants.
          </p>
        </section>

        <section className="space-y-3">
          <div className="bg-secondary rounded-xl border border-white/10 p-5">
            <h2 className="text-base font-semibold text-primary mb-1.5">AI Voice Confirmation</h2>
            <p className="text-xs text-secondary">
              Instant audio confirmation in the merchant&apos;s preferred language every time a payment lands on-chain.
            </p>
          </div>
          <div className="bg-secondary rounded-xl border border-white/10 p-5">
            <h2 className="text-base font-semibold text-primary mb-1.5">Real-time Dashboard</h2>
            <p className="text-xs text-secondary">
              Live balances, transaction feed, analytics, and credit score updates without page reloads.
            </p>
          </div>
          <div className="bg-secondary rounded-xl border border-white/10 p-5">
            <h2 className="text-base font-semibold text-primary mb-1.5">Auto-Savings & Credit</h2>
            <p className="text-xs text-secondary">
              Enforce savings splits at the contract level and unlock revenue-based loans with automatic repayment.
            </p>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

