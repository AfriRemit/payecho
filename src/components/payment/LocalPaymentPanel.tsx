export function LocalPaymentPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-tertiary/30 p-4 space-y-3">
      <p className="text-sm font-medium text-primary">Pay with local payment</p>
      <p className="text-xs text-secondary">
        Use Mobile Money (Momo), Paystack (card/bank), or other local options. No crypto wallet needed.
      </p>
      <ul className="space-y-2 text-xs">
        <li className="flex items-center gap-2 text-secondary">
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-medium">Momo</span>
          Mobile Money · Coming soon
        </li>
        <li className="flex items-center gap-2 text-secondary">
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-medium">Paystack</span>
          Card / bank · Coming soon
        </li>
      </ul>
      <p className="text-[10px] text-secondary/80">
        We're adding these so you can pay in your local currency. For now, use USDC (wallet) above.
      </p>
    </div>
  );
}
