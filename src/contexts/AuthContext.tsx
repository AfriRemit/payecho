'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { usePrivy, useIdentityToken } from '@privy-io/react-auth';

type AuthContextValue = {
  /** Privy identity token for API calls (Bearer or privy-id-token). */
  getToken: () => Promise<string | null>;
  /** EVM wallet address (embedded or linked). */
  address: string | null;
  /** True when user is logged in via Privy. */
  isAuthenticated: boolean;
  /** Open Privy login modal. */
  login: () => void;
  /** Log out from Privy. */
  logout: () => void;
  /** Privy SDK ready. */
  ready: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getEvmAddressFromUser(user: {
  linkedAccounts?: Array<{ type?: string; address?: string; chainType?: string; connectorType?: string }>;
}): string | null {
  const accounts = user?.linkedAccounts ?? [];
  for (const a of accounts) {
    if (!a.address?.startsWith('0x')) continue;
    const isEvm =
      a.chainType === 'ethereum' ||
      a.type === 'wallet' ||
      a.type === 'smart_wallet' ||
      a.connectorType === 'embedded';
    if (isEvm) return a.address;
  }
  return accounts.find((a) => a.address?.startsWith('0x'))?.address ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login: privyLogin, logout: privyLogout, getAccessToken } = usePrivy();
  const { identityToken } = useIdentityToken();

  const address = useMemo(() => (user ? getEvmAddressFromUser(user) : null), [user]);
  const isAuthenticated = Boolean(ready && authenticated && user);

  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      if (identityToken) return identityToken;
      const accessToken = await getAccessToken();
      return accessToken ?? null;
    } catch {
      return null;
    }
  }, [identityToken, getAccessToken]);

  const login = useCallback(() => {
    privyLogin();
  }, [privyLogin]);

  const logout = useCallback(() => {
    privyLogout();
  }, [privyLogout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      getToken,
      address,
      isAuthenticated,
      login,
      logout,
      ready,
    }),
    [getToken, address, isAuthenticated, login, logout, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
