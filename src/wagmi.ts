import { http, fallback, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { BASE_SEPOLIA_RPC } from './lib/base-rpc';

// WalletConnect: popup/modal flow on mobile (wallet app opens to connect & sign). Get projectId at https://cloud.reown.com
const walletConnectProjectId = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string)?.trim() ?? '';

// Multiple RPC endpoints: when one returns "too many errors" / rate limit, the next is tried.
const baseSepoliaTransport = fallback([
  http(import.meta.env.VITE_BASE_SEPOLIA_RPC || BASE_SEPOLIA_RPC, { batch: false, retryCount: 3 }),
  http('https://base-sepolia-rpc.publicnode.com', { batch: false, retryCount: 2 }),
  http('https://base-sepolia.drpc.org', { batch: false, retryCount: 2 }),
]);

/** Testnet only: single chain so the app can never send txs for Base mainnet (8453). */
export function getConfig() {
  const connectors = [
    injected(),
    coinbaseWallet({
      appName: 'payecho',
      preference: 'smartWalletOnly',
      version: '4',
    }),
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: 'payecho',
              description: 'Pay with USDC on Base Sepolia',
              url: typeof window !== 'undefined' ? window.location.origin : '',
              icons: [],
            },
            showQrModal: true,
          }),
        ]
      : []),
  ];

  return createConfig({
    chains: [baseSepolia],
    connectors,
    transports: {
      [baseSepolia.id]: baseSepoliaTransport,
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
