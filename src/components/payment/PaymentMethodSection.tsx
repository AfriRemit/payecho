import { useAuth } from '../../contexts/AuthContext';
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
  const { address, isAuthenticated, login } = useAuth();

  const canPay = Boolean(amount && paymentMethod === 'wallet' && isAuthenticated && address);

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
          isAuthenticated && address ? (
            <p className="text-xs text-secondary text-center">
              Connected:{' '}
              <span className="font-mono text-primary">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
              {' · Base'}
            </p>
          ) : (
            <>
              <p className="text-xs text-secondary text-center mb-3">Base network · USDC required</p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={login}
                  className="rounded-full bg-accent-green px-6 py-2 font-medium text-white hover:bg-accent-green-hover"
                >
                  Log in to pay
                </button>
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

