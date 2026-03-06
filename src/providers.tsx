'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type State, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { getConfig } from './wagmi';

const apiKey = import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY ?? '';

export function AppProviders(props: { children: ReactNode; initialState?: State }) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={apiKey} chain={baseSepolia}>
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
