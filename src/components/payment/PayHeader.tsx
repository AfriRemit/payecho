import type { PayPayload } from './types';

interface PayHeaderProps {
  parsed: PayPayload | null;
}

export function PayHeader({ parsed }: PayHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-white/10">
      <h2 className="text-lg font-semibold text-primary">
        {parsed ? 'Pay merchant' : 'Pay'}
      </h2>
      <p className="text-sm text-secondary mt-0.5">
        Pay with USDC (wallet) or local payment (Mobile Money, Paystack).
      </p>
    </div>
  );
}

