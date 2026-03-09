/**
 * MerchantStaking ABI — per-merchant USDC staking.
 * stake(merchant, amount), withdraw(merchant, amount).
 * totalStakedOnMerchant(merchant), balanceOf(staker, merchant), totalStaked().
 */
export const MERCHANT_STAKING_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'merchant', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'merchant', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'merchant', type: 'address' }],
    name: 'totalStakedOnMerchant',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'staker', type: 'address' },
      { internalType: 'address', name: 'merchant', type: 'address' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStaked',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDC_TOKEN',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'staker', type: 'address' },
      { internalType: 'address', name: 'merchant', type: 'address' },
    ],
    name: 'stakeMeta',
    outputs: [
      { internalType: 'uint256', name: 'unlockAt', type: 'uint256' },
      { internalType: 'uint8', name: 'lockId', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
