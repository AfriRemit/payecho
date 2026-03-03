/**
 * Base JSON-RPC and WebSocket endpoints.
 * Alchemy + public fallback configuration per PayEcho Masterplan.
 */

export const BASE_MAINNET_RPC = 'https://mainnet.base.org';
export const BASE_MAINNET_WS = 'wss://base-mainnet.g.alchemy.com/v2/YOUR_KEY';
export const BASE_SEPOLIA_RPC = 'https://sepolia.base.org';
export const BASE_SEPOLIA_WS = 'wss://base-sepolia.g.alchemy.com/v2/YOUR_KEY';

export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export function getBaseRpcUrl(chainId: number): string {
  return chainId === BASE_MAINNET_CHAIN_ID ? BASE_MAINNET_RPC : BASE_SEPOLIA_RPC;
}

export function getBaseWsUrl(chainId: number): string {
  return chainId === BASE_MAINNET_CHAIN_ID ? BASE_MAINNET_WS : BASE_SEPOLIA_WS;
}
