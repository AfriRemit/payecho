import { motion } from 'framer-motion';

export default function SmartTokenPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl space-y-6"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Smart Token</h1>
          <p className="text-secondary text-sm sm:text-base">
            Learn how Payecho&apos;s smart token design connects merchant activity, protocol economics, and aligned
            incentives.
          </p>
        </section>
        <section className="bg-secondary rounded-xl border border-white/10 p-6">
          <p className="text-xs text-secondary">
            Token design details will be published post-MVP. This page will host the token model, distribution, and
            utility breakdown.
          </p>
        </section>
      </motion.div>
    </main>
  );
}

