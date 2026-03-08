import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const walletConnectProjectId = import.meta.env.VITE_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export function getConfig() {
  // Injected first = MetaMask (and other extension wallets) on desktop. WalletConnect for mobile (user can pick MetaMask in modal).
  const connectors = [
    injected(), // MetaMask, Brave, etc. — no account needed
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: true })]
      : []),
    coinbaseWallet({
      appName: 'PayEcho',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ];

  return createConfig({
    chains: [baseSepolia, base],
    connectors,
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
