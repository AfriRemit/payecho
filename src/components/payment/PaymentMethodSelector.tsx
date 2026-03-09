import type { PaymentMethod } from './types';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <>
      <p className="text-xs font-medium text-secondary">How do you want to pay?</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('wallet')}
          className={`rounded-xl border px-4 py-3 text-left transition-colors ${
            value === 'wallet'
              ? 'border-accent-green bg-accent-green/10 text-primary'
              : 'border-white/10 bg-tertiary/50 text-secondary hover:border-white/20'
          }`}
        >
          <span className="block text-sm font-semibold">USDC</span>
          <span className="block text-[10px] mt-0.5 opacity-80">Wallet · Base</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('momo')}
          className={`rounded-xl border px-4 py-3 text-left transition-colors ${
            value !== 'wallet'
              ? 'border-accent-green bg-accent-green/10 text-primary'
              : 'border-white/10 bg-tertiary/50 text-secondary hover:border-white/20'
          }`}
        >
          <span className="block text-sm font-semibold">Local</span>
          <span className="block text-[10px] mt-0.5 opacity-80">Momo · Paystack</span>
        </button>
      </div>
    </>
  );
}
