import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletButton } from '../components/web3/WalletButton';

export default function Connect() {
  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-secondary rounded-xl border border-white/10 p-8 shadow-card-dark">
          <img src="/assets/Remifi logo.svg" alt="PayEcho" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-primary mb-2">Connect your wallet</h1>
          <p className="text-secondary text-sm mb-6">
            Connect to Base Sepolia to register as a merchant and start accepting USDC payments.
          </p>
          <div className="flex justify-center mb-4">
            <WalletButton />
          </div>
          <p className="text-xs text-secondary">
            New to crypto?{' '}
            <Link to="/" className="text-accent-green hover:underline">
              Learn more
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
