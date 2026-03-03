/**
 * MerchantVault ABI — PayEcho per-merchant payment contract.
 * acceptPayment(uint256 amount, bytes32 ref) — receives USDC via transferFrom.
 */

export const MERCHANT_VAULT_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes32', name: 'ref', type: 'bytes32' },
    ],
    name: 'acceptPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdcToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
