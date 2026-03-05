import { motion } from 'framer-motion';

export default function BlockchainExplorerPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl space-y-6"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Blockchain Explorer</h1>
          <p className="text-secondary text-sm sm:text-base">
            Every Payecho transaction is verifiable on Base. This page will link to curated explorer views for
            MerchantVaults, SavingsVault, and LendingPool.
          </p>
        </section>
        <section className="bg-secondary rounded-xl border border-white/10 p-6">
          <p className="text-xs text-secondary">
            Once contracts are deployed to Base Sepolia and Base mainnet, you&apos;ll find direct Basescan links and
            example queries here.
          </p>
        </section>
      </motion.div>
    </main>
  );
}

