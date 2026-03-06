import { createSiweMessage } from 'viem/siwe';

const TOKEN_KEY = 'payecho:jwt';
const ADDRESS_KEY = 'payecho:jwtAddress';

export function getStoredJwt(): { token: string; address: string } | null {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const address = window.localStorage.getItem(ADDRESS_KEY);
  if (!token || !address) return null;
  return { token, address };
}

export function clearStoredJwt() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADDRESS_KEY);
}

export function storeJwt(token: string, address: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(ADDRESS_KEY, address.toLowerCase());
}

export async function siweLogin(args: {
  address: `0x${string}`;
  chainId: number;
  signMessageAsync: (params: { message: string }) => Promise<`0x${string}`>;
  apiBaseUrl: string;
}): Promise<string> {
  const message = createSiweMessage({
    domain: window.location.host,
    address: args.address,
    statement: 'Sign in to PayEcho.',
    uri: window.location.origin,
    version: '1',
    chainId: args.chainId,
    nonce: crypto.randomUUID().replace(/-/g, ''),
    issuedAt: new Date(),
  });

  const signature = await args.signMessageAsync({ message });

  const res = await fetch(`${args.apiBaseUrl}/api/auth/siwe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature }),
  });
  const data = (await res.json().catch(() => ({}))) as { token?: string; error?: string };
  if (!data.token) {
    throw new Error(data.error || 'SIWE login failed');
  }
  storeJwt(data.token, args.address);
  return data.token;
}

