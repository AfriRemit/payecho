import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { BASE_SEPOLIA_CHAIN_ID } from '../../lib/base-rpc';

interface NetworkGuardProps {
  children: ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();

  const isCorrectNetwork = chainId === BASE_SEPOLIA_CHAIN_ID;

  if (!isConnected || !address) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="bg-secondary rounded-xl border border-white/10 p-6 max-w-md text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Wrong network</h2>
          <p className="text-secondary text-sm mb-4">
            Please switch to Base Sepolia to use PayEcho.
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={async () => {
              try {
                await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
              } catch {
                // wallet rejected / unsupported switching
              }
            }}
            className="w-full rounded-full bg-accent-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Switch to Base Sepolia
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
