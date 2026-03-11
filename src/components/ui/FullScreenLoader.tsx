import { motion } from 'framer-motion';

type FullScreenLoaderProps = {
  title?: string;
  subtitle?: string;
};

export function FullScreenLoader({
  title = 'Setting things up…',
  subtitle = 'This can take a few seconds while we talk to the blockchain.',
}: FullScreenLoaderProps) {
  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-secondary rounded-2xl border border-white/10 px-6 py-8 shadow-xl shadow-black/20"
        >
          <div className="mb-6 flex items-center justify-center">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-accent-green/20" />
              <div className="absolute inset-1 rounded-full border-2 border-t-accent-green border-r-accent-green/40 border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-primary/90 flex items-center justify-center text-xs font-semibold text-accent-green">
                PayEcho
              </div>
            </div>
          </div>
          <h1 className="text-lg font-semibold text-primary mb-2">{title}</h1>
          <p className="text-sm text-secondary mb-4">{subtitle}</p>
          <p className="text-[11px] text-secondary/70">
            You can keep this tab open. We’ll move you forward as soon as everything is ready.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

