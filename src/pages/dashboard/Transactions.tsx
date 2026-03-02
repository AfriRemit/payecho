import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'date' | 'amount'>('all');
  const placeholderRows = [
    { amount: '25.00', payer: '0x2A01...9EA9', time: '2 min ago', link: '#' },
    { amount: '50.00', payer: '0xDc04...d3a1', time: '1 hour ago', link: '#' },
    { amount: '15.00', payer: '0xae2F...aE13', time: '3 hours ago', link: '#' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">Transactions</h1>
          <p className="text-secondary text-sm mt-1">
            Full payment history. Filter by date or amount. Export CSV. Basescan link per tx.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-primary hover:bg-white/5 w-fit"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'date', 'amount'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              filter === f ? 'bg-accent-green text-white' : 'bg-tertiary text-secondary hover:text-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 font-medium text-secondary">Amount</th>
                <th className="px-4 py-3 font-medium text-secondary">Payer</th>
                <th className="px-4 py-3 font-medium text-secondary">Time</th>
                <th className="px-4 py-3 font-medium text-secondary text-right">Link</th>
              </tr>
            </thead>
            <tbody>
              {placeholderRows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-tertiary/30">
                  <td className="px-4 py-3 font-medium text-accent-green">{row.amount} USDC</td>
                  <td className="px-4 py-3 font-mono text-primary">{row.payer}</td>
                  <td className="px-4 py-3 text-secondary">{row.time}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={row.link} className="text-accent-green hover:underline text-xs">
                      Basescan
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Transactions;
