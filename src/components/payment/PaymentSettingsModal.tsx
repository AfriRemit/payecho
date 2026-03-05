import { useActiveAccount, useActiveWallet, useDisconnect, useWalletBalance } from 'thirdweb/react';
import { base } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';
import type { PaymentMethod } from './types';

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'fallback-client-id',
});

interface PaymentSettingsModalProps {
  open: boolean;
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: (method: PaymentMethod) => void;
  onClose: () => void;
}

export function PaymentSettingsModal({
  open,
  paymentMethod,
  onChangePaymentMethod,
  onClose,
}: PaymentSettingsModalProps) {
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { data: nativeBalance } = useWalletBalance({
    client,
    chain: base,
    address: account?.address,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-24 bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-secondary border border-white/15 shadow-xl px-6 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">Payment settings</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="w-7 h-7 rounded-full bg-tertiary/70 border border-white/10 flex items-center justify-center text-secondary hover:text-primary hover:bg-tertiary transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary">Payment method</label>
          <select
            value={paymentMethod}
            onChange={(e) => onChangePaymentMethod(e.target.value as PaymentMethod)}
            className="w-full rounded-lg bg-tertiary border border-white/10 px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          >
            <option value="wallet">Wallet (USDC on Base)</option>
            <option value="momo">Mobile Money (coming soon)</option>
            <option value="paystack">Card / Paystack (coming soon)</option>
            <option value="other">Other methods (coming soon)</option>
          </select>
        </div>
        {account && (
          <div className="space-y-2 pt-1 border-t border-white/10">
            <p className="text-xs font-semibold text-primary">Connected wallet</p>
            <p className="text-xs font-mono text-secondary break-all">
              {account.address.slice(0, 6)}…{account.address.slice(-4)}
            </p>
            <p className="text-[11px] text-secondary/80">
              {nativeBalance
                ? `${Number(nativeBalance.displayValue).toFixed(4)} ${nativeBalance.symbol} on Base`
                : '0 ETH on Base'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (activeWallet) {
                  disconnect(activeWallet);
                }
                onClose();
              }}
              className="mt-1 w-full rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-primary hover:bg-white/5 transition-colors"
            >
              Disconnect wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

