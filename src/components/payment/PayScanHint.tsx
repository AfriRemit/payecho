export function PayScanHint() {
  return (
    <div className="mx-6 mt-2 rounded-xl bg-tertiary/50 border border-white/10 px-4 py-3">
      <p className="text-sm font-medium text-primary">Scan to pay</p>
      <p className="text-xs text-secondary mt-0.5">
        Open your camera or QR app and scan the merchant&apos;s PayEcho QR code. You&apos;ll be taken here with the
        amount and merchant pre-filled. No account required.
      </p>
    </div>
  );
}
