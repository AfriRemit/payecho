import { type RefObject } from 'react';
import { Settings } from 'lucide-react';
import type { PayPayload } from './types';

interface PayPageHeaderProps {
  parsed: PayPayload | null;
  walletMenuOpen: boolean;
  onToggleWalletMenu: () => void;
  walletMenuRef: RefObject<HTMLDivElement | null>;
  walletAddress: string | undefined;
  isConnectPending: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function PayPageHeader({
  parsed,
  walletMenuOpen,
  onToggleWalletMenu,
  walletMenuRef,
  walletAddress,
  isConnectPending,
  onConnect,
  onDisconnect,
}: PayPageHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-primary">{parsed ? 'Pay merchant' : 'Pay'}</h2>
      
      </div>
      <div className="relative shrink-0" ref={walletMenuRef}>
        <button
          type="button"
          onClick={onToggleWalletMenu}
          className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-white/10 transition-colors touch-manipulation"
          aria-label="Wallet settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        {walletMenuOpen && (
          <div className="absolute right-0 top-full mt-1 py-1 min-w-[160px] rounded-xl border border-white/10 bg-secondary shadow-lg z-10">
            {walletAddress ? (
              <>
                <p className="px-3 py-2 text-xs text-secondary truncate max-w-[200px]" title={walletAddress}>
                  {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
                </p>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-white/10"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onConnect}
                disabled={isConnectPending}
                className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-white/10 disabled:opacity-50"
              >
                {isConnectPending ? 'Connecting…' : 'Connect wallet'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
