import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetJson } from '../../lib/api';
import { shortenAddress } from '../../lib/utils';

interface PaymentRow {
  id: string;
  amount: string;
  total: string;
  payer: string;
  timestamp: string;
  txHash: string;
}

interface DashboardResponse {
  payments: PaymentRow[];
}

function exportToCsv(rows: PaymentRow[]) {
  const headers = ['Amount (USDC)', 'Payer', 'Time', 'Link'];
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      [r.amount, r.payer, r.timestamp, r.txHash.startsWith('http') ? r.txHash : ''].join(','),
    ),
  ].join('\n');
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
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, getToken } = useAuth();

  const loadPayments = useCallback(async () => {
    if (!address) {
      setPayments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await apiGetJson<DashboardResponse>(
        `/api/merchants/${address.toLowerCase()}/dashboard`,
        { token },
      );
      setPayments(data.payments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load transactions');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [address, getToken]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const sortedRows = useMemo(() => {
    const list = [...payments];
    if (filter === 'amount') {
      list.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }
    return list;
  }, [payments, filter]);

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
            onClick={() => exportToCsv(sortedRows)}
            disabled={sortedRows.length === 0}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {error && (
        <p className="text-sm text-amber-500/90">{error}</p>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-secondary">
                    Loading…
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-secondary">
                    No transactions yet. Payments will appear here when customers pay you.
                  </td>
                </tr>
              ) : (
                sortedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 hover:bg-tertiary/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-accent-green">
                      {row.amount} USDC
                    </td>
                    <td className="px-4 py-3 font-mono text-primary">
                      {row.payer ? shortenAddress(row.payer, 4) : '—'}
                    </td>
                    <td className="px-4 py-3 text-secondary">{row.timestamp}</td>
                    <td className="px-4 py-3 text-right">
                      {row.txHash ? (
                        <a
                          href={row.txHash.startsWith('http') ? row.txHash : `https://sepolia.basescan.org/tx/${row.txHash}`}
                          className="text-accent-green hover:underline text-xs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Basescan
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
