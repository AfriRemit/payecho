import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';

const walletConnectProjectId = import.meta.env.VITE_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export function getConfig() {
  const connectors = [
    coinbaseWallet({
      appName: 'PayEcho',
      preference: 'smartWalletOnly',
      version: '4',
    }),
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: true })]
      : []),
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
