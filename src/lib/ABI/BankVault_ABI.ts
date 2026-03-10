/**
 * BankVault ABI — single payment pool. acceptPayment(merchant, amount, ref) credits the merchant.
 * withdraw(amount) sends liquid USDC from vault to msg.sender (merchant).
 */
export const BANK_VAULT_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'merchant', type: 'address' }],
    name: 'registerMerchant',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'merchant', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes32', name: 'ref', type: 'bytes32' },
    ],
    name: 'acceptPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'merchant', type: 'address' }],
    name: 'getLiquidBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isMerchant',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'rateBps', type: 'uint256' }],
    name: 'enableAutoSavings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Custom errors (needed for viem/wagmi to decode revert reasons)
  { inputs: [], name: 'InsufficientLiquidBalance', type: 'error' },
  { inputs: [], name: 'MerchantAlreadyRegistered', type: 'error' },
  { inputs: [], name: 'NotAdmin', type: 'error' },
  { inputs: [], name: 'NotMerchant', type: 'error' },
  { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'token', type: 'address' }], name: 'SafeERC20FailedOperation', type: 'error' },
  { inputs: [], name: 'SavingsRateTooHigh', type: 'error' },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroPayment', type: 'error' },
] as const;
