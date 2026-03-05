interface PaymentSuccessModalProps {
  open: boolean;
  amount: string;
  onClose: () => void;
}

export function PaymentSuccessModal({ open, amount, onClose }: PaymentSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xs rounded-2xl bg-secondary border border-white/15 shadow-xl px-6 py-6 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-accent-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-base font-semibold text-primary">Payment sent</p>
        <p className="text-xs text-secondary">
          Your payment of <span className="font-semibold text-primary">{amount || '—'} USDC</span> has been sent from
          your connected wallet. You can close this window.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full rounded-full bg-accent-green px-4 py-2 text-xs font-semibold text-white hover:bg-accent-green-hover transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

