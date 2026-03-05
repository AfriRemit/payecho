import { motion } from 'framer-motion';

export default function ProductsPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl space-y-8"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Products</h1>
          <p className="text-secondary text-sm sm:text-base max-w-2xl">
            Payecho turns everyday merchant transactions into programmable financial products. Explore the core
            experiences that power QR payments, savings, and on-chain credit.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="bg-secondary rounded-xl border border-white/10 p-5 shadow-card-dark">
            <h2 className="text-lg font-semibold text-primary mb-1.5">RewardBank Account</h2>
            <p className="text-xs text-secondary mb-3">
              A smart USDC account on Base that merchants use like a mobile savings account—without ever seeing seed
              phrases or gas.
            </p>
          </div>

          <div className="bg-secondary rounded-xl border border-white/10 p-5 shadow-card-dark">
            <h2 className="text-lg font-semibold text-primary mb-1.5">QR Payment Rail</h2>
            <p className="text-xs text-secondary mb-3">
              Fraud-proof QR payments with instant AI voice confirmation and real-time dashboard updates.
            </p>
          </div>

          <div className="bg-secondary rounded-xl border border-white/10 p-5 shadow-card-dark">
            <h2 className="text-lg font-semibold text-primary mb-1.5">Auto-Savings Vault</h2>
            <p className="text-xs text-secondary mb-3">
              Smart splits on every payment into liquid balance, savings, emergency reserve, and tax buffer.
            </p>
          </div>

          <div className="bg-secondary rounded-xl border border-white/10 p-5 shadow-card-dark">
            <h2 className="text-lg font-semibold text-primary mb-1.5">Revenue-Based Credit</h2>
            <p className="text-xs text-secondary mb-3">
              Simple, score-gated micro-loans that auto-repay from incoming USDC—no paperwork, no collateral.
            </p>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

