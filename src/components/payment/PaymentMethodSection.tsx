import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { base } from 'wagmi/chains';
import type { PaymentMethod } from './types';

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  amount: string;
  onChangePaymentMethod: (method: PaymentMethod) => void;
  onRequestPay: () => void;
}

export function PaymentMethodSection({
  paymentMethod,
  amount,
  onChangePaymentMethod,
  onRequestPay,
}: PaymentMethodSectionProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: nativeBalance } = useBalance({
    address,
    chainId: base.id,
  });

  const canPay = Boolean(amount && paymentMethod === 'wallet' && isConnected && address);

  return (
    <>
      <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-6 py-5 space-y-4">
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-semibold text-secondary">Scan to pay · choose method</label>
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

        {paymentMethod === 'wallet' ? (
          isConnected && address ? (
            <p className="text-xs text-secondary text-center">
              Connected:{' '}
              <span className="font-mono text-primary">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
              {' · '}
              <span>
                {nativeBalance ? `${Number(nativeBalance.formatted).toFixed(4)} ${nativeBalance.symbol} on Base` : '0 ETH on Base'}
                {chainId !== base.id ? ' (wrong network)' : ''}
              </span>
            </p>
          ) : (
            <>
              <p className="text-xs text-secondary text-center mb-3">Base network · USDC required</p>
              <div className="flex justify-center">
                <Wallet>
                  <ConnectWallet
                    className="!bg-accent-green hover:!bg-accent-green-hover !text-white !rounded-full !px-6 !py-2 !font-medium"
                    disconnectedLabel="Connect wallet"
                  />
                </Wallet>
              </div>
            </>
          )
        ) : (
          <div className="mt-1 rounded-lg bg-tertiary/70 border border-white/10 px-3 py-3 text-left">
            <p className="text-sm font-medium text-primary mb-1">
              {paymentMethod === 'momo'
                ? 'Mobile Money (coming soon)'
                : paymentMethod === 'paystack'
                  ? 'Card / Paystack (coming soon)'
                  : 'Other payment methods (coming soon)'}
            </p>
            <p className="text-xs text-secondary">
              This method will be available in a future version. For now, please pay with USDC from your Base wallet.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/15 bg-tertiary/60 px-6 py-4 text-center space-y-2">
        <button
          type="button"
          disabled={!canPay}
          onClick={onRequestPay}
          className="mt-1 w-full rounded-xl bg-accent-green px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {paymentMethod === 'wallet'
            ? `Pay ${amount || '—'} USDC`
            : 'Payment method not available yet'}
        </button>
      </div>
    </>
  );
}

