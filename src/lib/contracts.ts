/**
 * PayEcho contract addresses and configuration.
 * Per Masterplan: Base Sepolia for MVP, Base Mainnet for Phase 2.
 *
 * Address clarification:
 * - USDC_* are the ERC-20 token contracts (approve is called on these).
 * - BankVault (payment pool) is from env VITE_BANK_VAULT_ADDRESS; it is the spender in USDC approve and the contract for acceptPayment().
 */

import { BASE_MAINNET_CHAIN_ID } from './base-rpc';

export const USDC_BASE_MAINNET = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
/** Base Sepolia USDC (ERC-20). approve(spender, amount) is called on this contract; spender is the BankVault. */
export const USDC_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export interface PayEchoContracts {
  factoryAddress: string;
  registryAddress: string;
  creditOracleAddress: string;
  lendingPoolAddress: string;
  savingsVaultAddress: string;
  merchantNftAddress: string;
  usdcAddress: string;
}

const BASE_SEPOLIA_CONTRACTS: PayEchoContracts = {
  factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
  registryAddress: import.meta.env.VITE_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  creditOracleAddress: import.meta.env.VITE_CREDIT_ORACLE_ADDRESS || '0x0000000000000000000000000000000000000000',
  lendingPoolAddress: import.meta.env.VITE_LENDING_POOL_ADDRESS || '0x0000000000000000000000000000000000000000',
  savingsVaultAddress: import.meta.env.VITE_SAVINGS_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
  merchantNftAddress: import.meta.env.VITE_MERCHANT_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
  usdcAddress: USDC_BASE_SEPOLIA,
};

const BASE_MAINNET_CONTRACTS: PayEchoContracts = {
  ...BASE_SEPOLIA_CONTRACTS,
  usdcAddress: USDC_BASE_MAINNET,
};

export function getContracts(chainId: number): PayEchoContracts {
  return chainId === BASE_MAINNET_CHAIN_ID ? BASE_MAINNET_CONTRACTS : BASE_SEPOLIA_CONTRACTS;
}

export function getMerchantVaultAddress(_chainId?: number): string {
  return getBankVaultAddress();
}

/** Base Sepolia BankVault (payment pool). Same for all merchants; env can override. */
const BASE_SEPOLIA_BANK_VAULT = '0xA68e6db707e2a0D31Fee642Ec23530996767A235';

/** Single BankVault (payment pool) address. Env override; otherwise hardcoded Base Sepolia. Same for all merchants. */
export function getBankVaultAddress(): string {
  return import.meta.env.VITE_BANK_VAULT_ADDRESS || import.meta.env.VITE_MERCHANT_VAULT_ADDRESS || BASE_SEPOLIA_BANK_VAULT;
}

/** MerchantStaking contract (per-merchant USDC staking). Set VITE_MERCHANT_STAKING_ADDRESS after deploying. */
export function getMerchantStakingAddress(): string | null {
  return import.meta.env.VITE_MERCHANT_STAKING_ADDRESS || null;
}
