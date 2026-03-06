'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePrivy, useCreateWallet } from '@privy-io/react-auth';
import { useAuth } from '../../contexts/AuthContext';

/**
 * When the user is logged in but has no EVM wallet (e.g. signed up with Google/X only),
 * creates an embedded wallet so they get a Web3 account. Shows a short "Creating…" state
 * so the rest of the app doesn't show "no profile" or missing address.
 */
export function EnsureWallet({ children }: { children: ReactNode }) {
  const { authenticated, user, ready } = usePrivy();
  const { address } = useAuth();
  const { createWallet } = useCreateWallet({
    onError: (err) => {
      console.error('[EnsureWallet] createWallet failed:', err);
    },
  });
  const [creating, setCreating] = useState(false);
  const triggered = useRef(false);

  const hasNoAddress = Boolean(ready && authenticated && user && !address);

  useEffect(() => {
    if (!hasNoAddress || triggered.current) return;
    triggered.current = true;
    setCreating(true);
    createWallet()
      .then(() => {
        setCreating(false);
      })
      .catch(() => {
        setCreating(false);
        triggered.current = false; // allow retry later if needed
      });
  }, [hasNoAddress, createWallet]);

  if (hasNoAddress && creating) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent-green border-t-transparent" />
          <p className="text-primary font-medium">Creating your PayEcho wallet…</p>
          <p className="text-sm text-secondary">You’ll use this address to receive payments.</p>
        </div>
      </div>
    );
  }

  if (hasNoAddress) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-primary font-medium">Create your PayEcho wallet</p>
          <p className="text-sm text-secondary">
            You need a wallet to receive payments and use your profile. Create one now.
          </p>
          <button
            type="button"
            onClick={() => {
              triggered.current = false;
              setCreating(true);
              createWallet()
                .then(() => setCreating(false))
                .catch(() => setCreating(false));
            }}
            className="rounded-full bg-accent-green px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-green-hover transition-colors"
          >
            Create wallet
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
