interface WalletPayPanelProps {
  walletAddress: string | undefined;
  usdcBalance: string | null;
  hasInsufficientBalance: boolean;
  amount: string;
  vault: string;
  needsSwitch: boolean;
  isConnectPending: boolean;
  isSwitchPending: boolean;
  zeroAddress: string;
  onConnect: () => void;
  onPay: () => void;
}

export function WalletPayPanel({
  walletAddress,
  usdcBalance,
  hasInsufficientBalance,
  amount,
  vault,
  needsSwitch,
  isConnectPending,
  isSwitchPending,
  zeroAddress,
  onConnect,
  onPay,
}: WalletPayPanelProps) {
  const canPay = amount && vault.trim() && vault !== zeroAddress && !hasInsufficientBalance && !isSwitchPending;

  return (
    <div className="rounded-xl border border-white/10 bg-tertiary/30 p-4 space-y-3">
      {!walletAddress ? (
        <>
          <p className="text-xs text-secondary">Connect your wallet to pay with USDC.</p>
          <button
            type="button"
            onClick={onConnect}
            disabled={isConnectPending}
            className="w-full rounded-lg bg-accent-green px-4 py-3 text-sm font-semibold text-white hover:bg-accent-green-hover disabled:opacity-50 active:scale-[0.98] touch-manipulation"
          >
            {isConnectPending ? 'Connecting…' : 'Connect wallet'}
          </button>
        </>
      ) : (
        <>
          <p className="text-xs text-secondary">
            {needsSwitch ? "We'll switch to Base Sepolia when you pay." : 'Connected · Base Sepolia'}
          </p>
          {usdcBalance !== null && (
            <p className="text-sm font-medium text-primary">
              Balance: <span className="text-accent-green">{usdcBalance} USDC</span>
            </p>
          )}
          {hasInsufficientBalance && (
            <p className="text-xs text-amber-500">Insufficient USDC balance. You need {amount} USDC.</p>
          )}
          <button
            type="button"
            disabled={!canPay}
            onClick={onPay}
            className="w-full rounded-lg bg-accent-green px-4 py-3 text-sm font-semibold text-white hover:bg-accent-green-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwitchPending ? 'Switching…' : `Pay ${amount || '0'} USDC`}
          </button>
        </>
      )}
    </div>
  );
}
