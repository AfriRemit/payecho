import { motion } from 'framer-motion';

export default function InterestPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl space-y-6"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Interest & Yield</h1>
          <p className="text-secondary text-sm sm:text-base">
            Phase 2 of Payecho introduces yield on savings via Aave on Base. This page will explain how merchants earn
            and how protocol economics work.
          </p>
        </section>
        <section className="bg-secondary rounded-xl border border-white/10 p-6">
          <p className="text-xs text-secondary">
            Yield mechanics, risk disclosures, and projected APYs will be documented here before savings are routed
            into DeFi strategies.
          </p>
        </section>
      </motion.div>
    </main>
  );
}

