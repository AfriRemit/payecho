import { encodeFunctionData } from 'viem';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWalletClient,
  usePublicClient,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { toast } from 'react-toastify';
import { baseSepolia } from 'wagmi/chains';
import type { PayMode, PayPayload, PaymentMethod } from './types';
import { parseUSDC, formatUSDC } from '../../lib/payment';
import { getContracts, getBankVaultAddress } from '../../lib/contracts';
import { getApiBaseUrl } from '../../lib/api';
import { BANK_VAULT_ABI } from '../../lib/ABI/BankVault_ABI';
import { ERC20_ABI as ERC20_FULL_ABI } from '../../lib/ABI/ERC20_ABI';

const ERC20_APPROVE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const ZERO_REF: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
const TARGET_CHAIN_ID = baseSepolia.id;

/** Base Sepolia (and some wallets) cap per-tx gas at 25M. Use explicit limits so wallets don't substitute 131M. */
/** ERC20 approve is ~50–80k; use 100k to be safe and stay under chain limit. */
const GAS_APPROVE = 100_000n;
/** BankVault.acceptPayment + USDC transfer; 400k is plenty and under 25M. */
const GAS_ACCEPT_PAYMENT = 400_000n;

const BASE_SEPOLIA_RPC = 'https://sepolia.base.org';

function toUserMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/exceeds maximum per-transaction gas limit/i.test(msg))
    return 'Gas limit too high for this network. Try a different wallet or ensure you’re on Base Sepolia.';
  if (/user rejected|rejected the request|denied/i.test(msg)) return 'You declined the transaction.';
  if (/insufficient funds/i.test(msg)) return 'Not enough ETH for gas.';
  if (/NotMerchant|not registered/i.test(msg)) return 'This merchant is not registered on the vault. Ask them to register first.';
  if (/reverted for an unknown reason|execution reverted/i.test(msg))
    return 'Transaction reverted. The merchant may not be registered, or allowance may be too low—try again after approve confirms.';
  return msg || 'Transaction failed.';
}

/** Ensure the wallet has Base Sepolia with our RPC so "Requested resource not available" / RPC errors are avoided. */
async function ensureBaseSepoliaRpc(connector: { getProvider?: (args?: { chainId?: number }) => Promise<unknown> } | undefined): Promise<void> {
  const provider = connector?.getProvider
    ? await connector.getProvider({ chainId: TARGET_CHAIN_ID }).catch(() => null)
    : typeof window !== 'undefined' ? (window as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum : null;
  if (!provider || typeof (provider as { request?: unknown }).request !== 'function') return;
  const req = (provider as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }).request;
  try {
    await req({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x' + TARGET_CHAIN_ID.toString(16),
          chainName: 'Base Sepolia',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: [BASE_SEPOLIA_RPC],
          blockExplorerUrls: ['https://sepolia.basescan.org'],
        },
      ],
    });
  } catch {
    // User rejected or chain already added; continue anyway
  }
}

export function usePayWithWallet() {
  const [searchParams] = useSearchParams();
  const [overrideAmount, setOverrideAmount] = useState('');
  const [manualMerchantAddress, setManualMerchantAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const { address: walletAddress, chain, connector } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|Mobi|BlackBerry|IEMobile/i.test(navigator.userAgent);
  const connectConnector = useMemo(() => {
    const wc = connectors.find((c) => c.id?.toLowerCase().includes('walletconnect') || c.id?.toLowerCase().includes('wallet_connect'));
    const injected = connectors.find((c) => c.id === 'injected');
    const coinbase = connectors.find((c) => c.id?.toLowerCase().includes('coinbase'));
    if (isMobile && wc) return wc;
    return injected ?? coinbase ?? wc ?? connectors[0];
  }, [connectors, isMobile]);

  const contracts = getContracts(chain?.id ?? baseSepolia.id);
  const needsSwitch = !!walletAddress && chain !== undefined && Number(chain.id) !== TARGET_CHAIN_ID;

  const { data: walletClient } = useWalletClient({ chainId: baseSepolia.id });
  const publicClient = usePublicClient({ chainId: baseSepolia.id });
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [payHash, setPayHash] = useState<`0x${string}` | undefined>();

  const { isSuccess: isApproveSuccess, isError: isApproveError, error: approveError } = useWaitForTransactionReceipt({
    hash: approveHash ?? ZERO_HASH,
    query: { enabled: !!approveHash },
  });
  const { isSuccess: isPaySuccess, isError: isPayError, error: payError } = useWaitForTransactionReceipt({
    hash: payHash ?? ZERO_HASH,
    query: { enabled: !!payHash },
  });
  const { data: usdcBalanceRaw } = useReadContract({
    address: contracts.usdcAddress as `0x${string}`,
    abi: ERC20_FULL_ABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
  });
  const usdcBalance = useMemo(
    () => (typeof usdcBalanceRaw === 'bigint' ? formatUSDC(usdcBalanceRaw) : null),
    [usdcBalanceRaw],
  );

  const pendingPayRef = useRef<{ vault: string; merchant: string; amountWei: bigint } | null>(null);
  const pendingPayAfterSwitchRef = useRef<{ vault: string; merchant: string; amountWei: bigint } | null>(null);
  const acceptPaymentSentRef = useRef(false);
  const walletMenuRef = useRef<HTMLDivElement>(null);
  const urlMerchantRef = useRef<string>('');

  const bankVaultAddress = getBankVaultAddress();

  const parsed = useMemo<PayPayload | null>(() => {
    const raw = searchParams.get('payload');
    if (raw) {
      try {
        const decoded = JSON.parse(decodeURIComponent(raw)) as PayPayload;
        if (decoded.proto !== 'payecho') return null;
        return { ...decoded, vault: bankVaultAddress };
      } catch {
        return null;
      }
    }
    return {
      proto: 'payecho',
      vault: bankVaultAddress,
      merchant: searchParams.get('merchant') ?? '',
      mode: (searchParams.get('mode') || 'open') as PayMode,
      amount: searchParams.get('amount') || null,
    };
  }, [searchParams, bankVaultAddress]);

  const mode: PayMode = parsed?.mode ?? 'open';
  const initialAmount = parsed?.amount ?? searchParams.get('amount') ?? '';
  const amount = mode === 'fixed' ? initialAmount : overrideAmount;
  const vault = bankVaultAddress;

  const urlMerchant = parsed?.merchant ?? searchParams.get('merchant') ?? '';
  useEffect(() => {
    if (urlMerchant !== urlMerchantRef.current) {
      urlMerchantRef.current = urlMerchant;
      setManualMerchantAddress(urlMerchant);
    }
  }, [urlMerchant]);
  const merchant = manualMerchantAddress;

  const isMerchantAddress = useMemo(() => /^0x[a-fA-F0-9]{40}$/.test((merchant || '').trim()), [merchant]);
  const { data: isMerchantRegistered } = useReadContract({
    address: vault && vault !== ZERO_ADDRESS ? (vault as `0x${string}`) : undefined,
    abi: BANK_VAULT_ABI,
    functionName: 'isMerchant',
    args: isMerchantAddress ? [(merchant.trim() as `0x${string}`)] : undefined,
  });

  const amountWeiForCheck = useMemo(() => parseUSDC(amount || '0'), [amount]);
  const hasInsufficientBalance = !!(
    walletAddress &&
    typeof usdcBalanceRaw === 'bigint' &&
    amountWeiForCheck > 0n &&
    usdcBalanceRaw < amountWeiForCheck
  );

  const runApproveAndPay = useCallback(
    async (vaultAddr: string, merchantAddr: string, amountWei: bigint) => {
      if (!walletClient?.account) {
        toast.error('Wallet not ready. Please try again.');
        return;
      }
      const c = getContracts(baseSepolia.id);
      pendingPayRef.current = { vault: vaultAddr, merchant: merchantAddr, amountWei };
      acceptPaymentSentRef.current = false;
      try {
        const data = encodeFunctionData({
          abi: ERC20_APPROVE_ABI,
          functionName: 'approve',
          args: [vaultAddr as `0x${string}`, amountWei],
        });
        const hash = await walletClient.sendTransaction({
          account: walletClient.account,
          chain: baseSepolia,
          to: c.usdcAddress as `0x${string}`,
          data,
          gas: GAS_APPROVE,
        });
        setApproveHash(hash);
      } catch (e) {
        toast.error(toUserMessage(e));
        pendingPayRef.current = null;
      }
    },
    [walletClient],
  );

  const handleRequestPay = useCallback(() => {
    if (!amount || paymentMethod !== 'wallet') return;
    if (!vault || vault === ZERO_ADDRESS) return;
    if (hasInsufficientBalance) {
      toast.error('Insufficient USDC balance');
      return;
    }
    setConfirmOpen(true);
  }, [amount, paymentMethod, vault, hasInsufficientBalance]);

  const handleConnectWallet = useCallback(() => {
    connect(
      { connector: connectConnector },
      {
        onError: (err) => {
          toast.error(err?.message ?? 'Connection failed');
        },
      },
    );
  }, [connect, connectConnector]);

  const handleConfirmPay = useCallback(async () => {
    setConfirmOpen(false);
    if (paymentMethod !== 'wallet' || !amount || !vault.trim()) {
      toast.success(`Payment of ${amount} USDC confirmed.`);
      setSuccessOpen(true);
      return;
    }
    const amountWei = parseUSDC(amount);
    if (amountWei === 0n) {
      toast.error('Invalid amount');
      return;
    }
    if (!walletAddress) {
      toast.error('Connect your wallet to pay');
      return;
    }
    if (!merchant.trim()) {
      toast.error('Merchant address required (scan QR or enter vault + merchant)');
      return;
    }
    if (isMerchantRegistered === false) {
      toast.error('This merchant is not registered on the vault. Ask them to register first.');
      return;
    }
    if (typeof usdcBalanceRaw === 'bigint' && amountWei > usdcBalanceRaw) {
      toast.error('Insufficient USDC balance');
      return;
    }
    const onCorrectChain = chain !== undefined && Number(chain.id) === TARGET_CHAIN_ID;
    if (!onCorrectChain) {
      pendingPayAfterSwitchRef.current = { vault, merchant, amountWei };
      switchChain({ chainId: TARGET_CHAIN_ID });
      toast.info(
        chain === undefined
          ? "Please switch to Base Sepolia in your wallet so we can complete the payment."
          : "Approve the network switch in your wallet, then we'll complete the payment.",
      );
      return;
    }
    runApproveAndPay(vault, merchant, amountWei);
  }, [
    paymentMethod,
    amount,
    vault,
    merchant,
    walletAddress,
    usdcBalanceRaw,
    isMerchantRegistered,
    chain,
    switchChain,
    runApproveAndPay,
  ]);

  useEffect(() => {
    const pending = pendingPayAfterSwitchRef.current;
    if (!pending || !walletAddress || !walletClient?.account) return;
    if (!chain || Number(chain.id) !== TARGET_CHAIN_ID) return;
    pendingPayAfterSwitchRef.current = null;
    // Only add/ensure Base Sepolia RPC when we've just switched; avoids extra popup when already on chain.
    ensureBaseSepoliaRpc(connector).then(() => {
      runApproveAndPay(pending.vault, pending.merchant, pending.amountWei);
    });
  }, [chain?.id, walletAddress, walletClient, connector, runApproveAndPay]);

  useEffect(() => {
    if (!approveHash || !isApproveSuccess || acceptPaymentSentRef.current) return;
    const pending = pendingPayRef.current;
    if (!pending || !walletClient?.account || !publicClient) return;
    acceptPaymentSentRef.current = true;
    const runAcceptPayment = async () => {
      try {
        await publicClient.simulateContract({
          account: walletClient.account,
          address: pending.vault as `0x${string}`,
          abi: BANK_VAULT_ABI,
          functionName: 'acceptPayment',
          args: [pending.merchant as `0x${string}`, pending.amountWei, ZERO_REF],
        });
      } catch (simErr) {
        toast.error(toUserMessage(simErr));
        acceptPaymentSentRef.current = false;
        return;
      }
      walletClient
        .sendTransaction({
          account: walletClient.account,
          chain: baseSepolia,
          to: pending.vault as `0x${string}`,
          data: encodeFunctionData({
            abi: BANK_VAULT_ABI,
            functionName: 'acceptPayment',
            args: [pending.merchant as `0x${string}`, pending.amountWei, ZERO_REF],
          }),
          gas: GAS_ACCEPT_PAYMENT,
        })
        .then(setPayHash)
        .catch((e) => {
          toast.error(toUserMessage(e));
          acceptPaymentSentRef.current = false;
        });
    };
    runAcceptPayment();
  }, [approveHash, isApproveSuccess, walletClient, publicClient]);

  useEffect(() => {
    if (!approveHash || !isApproveError) return;
    toast.error(toUserMessage(approveError ?? new Error('Approve transaction reverted')));
    pendingPayRef.current = null;
    setApproveHash(undefined);
  }, [approveHash, isApproveError, approveError]);

  useEffect(() => {
    if (!payHash || !isPayError) return;
    toast.error(toUserMessage(payError ?? new Error('Payment transaction reverted')));
    acceptPaymentSentRef.current = false;
    pendingPayRef.current = null;
    setApproveHash(undefined);
    setPayHash(undefined);
  }, [payHash, isPayError, payError]);

  useEffect(() => {
    if (!payHash || !isPaySuccess) return;
    toast.success(`Payment of ${amount} USDC confirmed.`);
    setSuccessOpen(true);
    pendingPayRef.current = null;
    acceptPaymentSentRef.current = false;
    setApproveHash(undefined);
    setPayHash(undefined);
    const speak = async () => {
      try {
        let volume = 1;
        let quietStart = '22:00', quietEnd = '07:00';
        try {
          const raw = localStorage.getItem('payecho_voice_settings');
          if (raw) {
            const s = JSON.parse(raw) as Record<string, unknown>;
            if (typeof s.volume === 'number') volume = s.volume / 100;
            if (typeof s.quietStart === 'string') quietStart = s.quietStart;
            if (typeof s.quietEnd === 'string') quietEnd = s.quietEnd;
          }
        } catch {
          /* ignore */
        }
        const now = new Date();
        const [sh, sm] = quietStart.split(':').map(Number);
        const [eh, em] = quietEnd.split(':').map(Number);
        const nowM = now.getHours() * 60 + now.getMinutes();
        const startM = sh * 60 + sm;
        const endM = eh * 60 + em;
        const inQuiet = startM <= endM ? nowM >= startM && nowM < endM : nowM >= startM || nowM < endM;
        if (inQuiet) return;
        const res = await fetch(`${getApiBaseUrl()}/api/voice/announce`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: 'payment_sent', amount: amount || '0' }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.volume = volume;
        audio.play().catch(() => {});
        audio.onended = () => URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    };
    speak();
  }, [payHash, isPaySuccess, amount]);

  useEffect(() => {
    if (!walletMenuOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(e.target as Node)) setWalletMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [walletMenuOpen]);

  useEffect(() => {
    if (!walletAddress || !chain || chain.id === TARGET_CHAIN_ID || isSwitchPending) return;
    switchChain({ chainId: TARGET_CHAIN_ID });
  }, [walletAddress, chain, isSwitchPending, switchChain]);

  return {
    parsed,
    mode,
    amount,
    vault,
    merchant,
    setOverrideAmount,
    setManualMerchantAddress,
    paymentMethod,
    setPaymentMethod,
    confirmOpen,
    setConfirmOpen,
    successOpen,
    setSuccessOpen,
    walletMenuOpen,
    setWalletMenuOpen,
    walletMenuRef,
    walletAddress,
    usdcBalance,
    hasInsufficientBalance,
    needsSwitch,
    isConnectPending,
    isSwitchPending,
    connectConnector,
    disconnect,
    ZERO_ADDRESS,
    handleRequestPay,
    handleConfirmPay,
    handleConnectWallet,
  };
}
