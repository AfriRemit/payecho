import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const FEED_PLACEHOLDER = [
  { amount: '25', total: '120' },
  { amount: '50', total: '200' },
  { amount: '15', total: '85' },
];

const Dashboard: React.FC = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent-green mb-2">Merchant dashboard · Base · USDC</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary leading-tight mb-2">
            Your onchain revenue home
          </h1>
          <p className="text-secondary text-sm md:text-base max-w-2xl">
            Balance, live payment feed, and credit score. Every payment builds your ledger.
          </p>
        </div>
        <Link
          to="/dashboard/qr"
          className="inline-flex items-center gap-2 rounded-full bg-accent-green px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-green-hover transition-colors shrink-0 sm:mt-9"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Create QR code
        </Link>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          variants={item}
          className="bg-secondary rounded-xl border border-white/10 p-5"
        >
          <p className="text-xs font-medium text-secondary mb-1">Liquid USDC</p>
          <p className="text-2xl font-bold text-primary">0.00</p>
        </motion.div>
        <motion.div
          variants={item}
          className="bg-secondary rounded-xl border border-white/10 p-5"
        >
          <p className="text-xs font-medium text-secondary mb-1">Savings</p>
          <p className="text-2xl font-bold text-accent-green">0.00</p>
        </motion.div>
        <motion.div
          variants={item}
          className="bg-secondary rounded-xl border border-white/10 p-5"
        >
          <p className="text-xs font-medium text-secondary mb-1">Credit score</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-primary">—</p>
            <span className="rounded-full bg-tertiary px-2 py-0.5 text-xs text-secondary border border-white/10">Seed</span>
          </div>
        </motion.div>
      </div>

      {/* Live payment feed */}
      <motion.div variants={item} className="bg-secondary rounded-xl border border-white/10 p-5">
        <h2 className="text-lg font-semibold text-primary mb-3">Live payment feed</h2>
        <div className="rounded-lg bg-tertiary/50 border border-white/5 overflow-hidden">
          <div className="max-h-40 overflow-y-auto">
            {FEED_PLACEHOLDER.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-white/5 last:border-0 text-sm"
              >
                <span className="text-secondary">Payment confirmed.</span>
                <span>
                  <span className="text-accent-green font-semibold">{row.amount} USDC</span>
                  <span className="text-secondary"> received · Today: </span>
                  <span className="text-accent-green font-semibold">{row.total} USDC</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-secondary mt-2">Updates in real time when payments land on Base.</p>
      </motion.div>

      {/* Onboarding CTA */}
      <motion.div variants={item} className="bg-secondary rounded-xl border border-white/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">New merchant?</h2>
          <p className="text-sm text-secondary">Connect wallet, create profile, and get your QR.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="rounded-full bg-accent-green px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-green-hover transition-colors"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
