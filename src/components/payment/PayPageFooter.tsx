import { useState } from 'react';

export function PayPageFooter() {
  const [showRpcTip, setShowRpcTip] = useState(false);
  return (
    <div className="px-6 py-3 bg-tertiary/50 border-t border-white/10">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-secondary">
          Base
        </span>
        <span className="text-secondary/60">·</span>
        <span className="text-[10px] text-secondary">PayEcho</span>
        <button
          type="button"
          onClick={() => setShowRpcTip((v) => !v)}
          className="text-[10px] text-secondary/80 hover:text-secondary underline"
        >
          RPC errors?
        </button>
      </div>
      {showRpcTip && (
        <p className="mt-2 text-[10px] text-secondary/90 text-center max-w-sm mx-auto">
          If MetaMask shows &quot;RPC endpoint returned too many errors&quot;, go to Settings → Networks → Base
          Sepolia → set RPC URL to <code className="bg-white/10 px-1 rounded">https://sepolia.base.org</code>
        </p>
      )}
    </div>
  );
}
