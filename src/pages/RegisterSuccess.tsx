import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterSuccess: React.FC = () => {
  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="bg-secondary rounded-xl border border-white/10 p-6 md:p-8 shadow-card-dark text-center">
          <div className="w-14 h-14 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-accent-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-accent-green mb-2">Step 3 of 3 · You're set</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
            Merchant Vault deployed
          </h1>
          <p className="text-secondary text-sm mb-6">
            Your merchant profile is ready. Use your dashboard to manage payments and share your QR when you’re set up.
          </p>

          <ul className="text-left text-sm text-secondary space-y-2 mb-6">
            <li>• Go to Dashboard → QR to show full-screen QR or download PNG</li>
            <li>• Customers scan and pay in USDC; you hear instant voice confirmation</li>
            <li>• Every payment is onchain and builds your revenue ledger & credit score</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 rounded-full bg-accent-green px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-green-hover transition-colors text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/dashboard/qr"
              className="flex-1 rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-primary hover:bg-white/5 transition-colors text-center"
            >
              Show QR
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default RegisterSuccess;
