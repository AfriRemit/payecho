import { useState } from 'react';
import { motion } from 'framer-motion';

const PLACEHOLDER_ROWS = [
  { amount: '25.00', payer: '0x2A01...9EA9', time: '2 min ago', link: '#' },
  { amount: '50.00', payer: '0xDc04...d3a1', time: '1 hour ago', link: '#' },
  { amount: '15.00', payer: '0xae2F...aE13', time: '3 hours ago', link: '#' },
];

function exportToCsv(rows: typeof PLACEHOLDER_ROWS) {
  const headers = ['Amount (USDC)', 'Payer', 'Time'];
  const csv = [headers.join(','), ...rows.map((r) => [r.amount, r.payer, r.time].join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payecho-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const [filter, setFilter] = useState<'all' | 'date' | 'amount'>('all');

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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => exportToCsv(PLACEHOLDER_ROWS)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'date', 'amount'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
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
              {PLACEHOLDER_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-tertiary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-accent-green">{row.amount} USDC</td>
                  <td className="px-4 py-3 font-mono text-primary">{row.payer}</td>
                  <td className="px-4 py-3 text-secondary">{row.time}</td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={row.link}
                      className="text-accent-green hover:underline text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
}
