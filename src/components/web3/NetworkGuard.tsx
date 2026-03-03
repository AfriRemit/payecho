import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useActiveAccount, useActiveWalletChain, ConnectButton } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { BASE_SEPOLIA_CHAIN_ID } from '../../lib/base-rpc';

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'fallback-client-id',
});

interface NetworkGuardProps {
  children: ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const location = useLocation();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  const isCorrectNetwork = chain?.id === BASE_SEPOLIA_CHAIN_ID;

  if (!account) {
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="bg-secondary rounded-xl border border-white/10 p-6 max-w-md text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Wrong network</h2>
          <p className="text-secondary text-sm mb-4">
            Please switch to Base Sepolia to use PayEcho.
          </p>
          <ConnectButton client={client} switchButton={{ label: 'Switch Network' }} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
