import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl space-y-8"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">About Payecho</h1>
          <p className="text-secondary text-sm sm:text-base">
            Payecho is an onchain financial operating system for informal merchants. We help market traders and small
            businesses across Africa turn everyday payments into financial identity, savings, and access to credit.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="bg-secondary rounded-xl border border-white/10 p-5">
            <h2 className="text-base font-semibold text-primary mb-1.5">Mission</h2>
            <p className="text-xs text-secondary">
              Eliminate payment fraud and financial invisibility for informal merchants using Base and stablecoins.
            </p>
          </div>
          <div className="bg-secondary rounded-xl border border-white/10 p-5">
            <h2 className="text-base font-semibold text-primary mb-1.5">What we build</h2>
            <p className="text-xs text-secondary">
              A QR payment rail, onchain revenue ledger, and embedded finance layer—wrapped in a simple mobile-first
              experience.
            </p>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

