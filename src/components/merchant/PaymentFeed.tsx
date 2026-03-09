import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shortenAddress } from '../../lib/utils';

export interface PaymentFeedItem {
  id: string;
  amount: string;
  total: string;
  payer?: string;
  timestamp?: string;
  txHash?: string;
}

interface PaymentFeedProps {
  /** Payments from dashboard API; empty array = no payments (show empty state). */
  items?: PaymentFeedItem[];
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
}

const BASESCAN_BASE = 'https://sepolia.basescan.org/tx/';

export function PaymentFeed({
  items = [],
  soundEnabled = true,
  onSoundToggle,
}: PaymentFeedProps) {
  const [soundOn, setSoundOn] = useState(soundEnabled);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    onSoundToggle?.(next);
  };

  return (
    <div className="bg-secondary rounded-xl border border-white/10 p-5 h-full flex flex-col min-h-[320px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <h2 className="text-lg font-semibold text-primary">Live payment feed</h2>
        </div>
        {onSoundToggle && (
          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
            aria-label={soundOn ? 'Mute payment sounds' : 'Unmute payment sounds'}
          >
            {soundOn ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.076L4 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2l4.383-4.924a1 1 0 011.617.076z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.076L4 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2l4.383-4.924a1 1 0 011.617.076zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        )}
      </div>
      <div className="rounded-lg bg-tertiary/50 border border-white/5 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-secondary text-sm">
              No payments yet. Payments will appear here when customers pay you via your QR or pay link.
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-4 py-2.5 border-b border-white/5 last:border-0 text-sm"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-secondary">Payment confirmed</span>
                    {row.payer && (
                      <span className="font-mono text-xs text-secondary truncate">
                        {shortenAddress(row.payer, 4)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-1 sm:pt-0">
                    <span className="text-right sm:text-left">
                      <span className="text-accent-green font-semibold">{row.amount} USDC</span>
                      <span className="text-secondary"> · Total: </span>
                      <span className="text-accent-green font-semibold">{row.total} USDC</span>
                    </span>
                    {row.txHash && (
                      <a
                        href={row.txHash.startsWith('http') ? row.txHash : `${BASESCAN_BASE}${row.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-green hover:underline text-xs shrink-0"
                      >
                        Basescan
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      <p className="text-xs text-secondary mt-2 shrink-0">
        Updates in real time when payments land on Base.
      </p>
    </div>
  );
}
