// Chain configuration for multichain support
import { BASE_MAINNET_RPC, BASE_SEPOLIA_RPC } from './base-rpc';

export interface ChainConfig {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  blockExplorer?: string;
  contracts: {
    swapAddress: string;
    priceFeedAddress: string;
    afriStableAddress: string;
    savingAddress: string;
  };
}

// Base Sepolia Testnet Configuration
export const BASE_SEPOLIA_CONFIG: ChainConfig = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrl: BASE_SEPOLIA_RPC,
  blockExplorer: 'https://sepolia-explorer.base.org',
  contracts: {
    swapAddress: '0x2B2068a831e7C7B2Ac4D97Cd293F934d2625aB69',
    priceFeedAddress: '0x2Efddc5a4FEc6a4308c7206B0E0E9b3898520108',
    afriStableAddress: '0xc5737615ed39b6B089BEDdE11679e5e1f6B9E768', // Update if different
    savingAddress: '0xe85b044a579e8787afFfBF46691a01E7052cF6D0', // Update if different
  },
};

// Base Mainnet Configuration
export const BASE_MAINNET_CONFIG: ChainConfig = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrl: BASE_MAINNET_RPC,
  blockExplorer: 'https://basescan.org',
  contracts: {
    swapAddress: '0x0000000000000000000000000000000000000000',
    priceFeedAddress: '0x0000000000000000000000000000000000000000',
    afriStableAddress: '0x0000000000000000000000000000000000000000',
    savingAddress: '0x0000000000000000000000000000000000000000',
  },
};

// Supported chains (PayEcho currently uses Base Sepolia / Base)
export const SUPPORTED_CHAINS: ChainConfig[] = [BASE_SEPOLIA_CONFIG, BASE_MAINNET_CONFIG];

// Get chain config by ID
export const getChainConfig = (chainId: number): ChainConfig | undefined => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
};

// Get default chain (Apechain)
export const DEFAULT_CHAIN = BASE_SEPOLIA_CONFIG;

// Check if chain is supported
export const isChainSupported = (chainId: number): boolean => {
  return SUPPORTED_CHAINS.some(chain => chain.id === chainId);
};

