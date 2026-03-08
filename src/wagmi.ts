import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export function getConfig() {
  // Connect to the user's installed wallet (MetaMask, Brave, etc.). No WalletConnect.
  const connectors = [
    injected(),
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
