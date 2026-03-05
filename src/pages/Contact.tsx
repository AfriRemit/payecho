import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-xl space-y-6"
      >
        <section>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-3">Contact</h1>
          <p className="text-secondary text-sm sm:text-base">
            Building a bankless operating system for informal commerce takes partners. Reach out to talk pilots,
            integrations, or ecosystem collaborations.
          </p>
        </section>

        <section className="bg-secondary rounded-xl border border-white/10 p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs text-secondary mb-1">Email</p>
              <p className="text-primary">hello@payecho.xyz</p>
            </div>
            <div>
              <p className="text-xs text-secondary mb-1">Region</p>
              <p className="text-primary">Ghana · Pan-Africa</p>
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

