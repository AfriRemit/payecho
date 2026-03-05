import type { PayMode } from './types';

interface AmountSectionProps {
  mode: PayMode;
  amount: string;
  vault: string;
  onChangeAmount: (value: string) => void;
  vaultEditable?: boolean;
  onVaultChange?: (value: string) => void;
}

export function AmountSection({
  mode,
  amount,
  vault,
  onChangeAmount,
  vaultEditable,
  onVaultChange,
}: AmountSectionProps) {
  return (
    <div className="px-6 py-6 space-y-2">
      {vaultEditable && onVaultChange ? (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-secondary">Pay to vault address</label>
          <input
            type="text"
            value={vault}
            onChange={(e) => onVaultChange(e.target.value)}
            placeholder="0x…"
            className="w-full rounded-xl bg-tertiary border border-white/10 px-4 py-3 text-primary font-mono text-sm outline-none focus:ring-2 focus:ring-accent-green/50"
          />
        </div>
      ) : null}
      <label className="block text-sm font-medium text-secondary">
        Amount (USDC)
        {mode === 'fixed' && amount ? ' · fixed by merchant' : ''}
      </label>
      {mode === 'fixed' ? (
        <div className="flex items-center gap-3 rounded-xl bg-tertiary border border-white/10 px-4 py-4 overflow-hidden">
          <span className="text-2xl font-bold text-primary min-w-0 truncate">{amount || '—'}</span>
          <span className="text-secondary text-sm shrink-0">USDC</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-tertiary border border-white/10 px-4 py-3 overflow-hidden">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => onChangeAmount(e.target.value)}
            placeholder="Enter amount"
            className="min-w-0 flex-1 bg-transparent outline-none text-primary text-xl font-semibold"
          />
          <span className="text-secondary text-sm shrink-0">USDC</span>
        </div>
      )}
      {vault ? (
        <p className="text-[10px] text-secondary/80 break-all">Paying to vault: {vault}</p>
      ) : null}
    </div>
  );
}

