import { motion } from 'framer-motion';

export default function CryptoAPIPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl space-y-6"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Crypto API</h1>
          <p className="text-secondary text-sm sm:text-base">
            A future Payecho API will let partners query merchant revenue, credit scores, and savings data in a
            privacy-preserving way.
          </p>
        </section>
        <section className="bg-secondary rounded-xl border border-white/10 p-6">
          <p className="text-xs text-secondary">
            Documentation and test keys will be available here once the public API is ready. For now, this is a
            placeholder aligned with the Masterplan.
          </p>
        </section>
      </motion.div>
    </main>
  );
}

