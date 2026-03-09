import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { encodeFunctionData, parseUnits } from 'viem';
import { useAccount, useWalletClient, usePublicClient, useReadContract, useReadContracts } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import {
  Store,
  Wallet,
  ChevronDown,
  RefreshCw,
  Search,
  Coins,
  Package,
  Box,
  Layers,
  Archive,
  Bookmark,
  Hexagon,
  ExternalLink,
} from 'lucide-react';
import { apiGetJson, getApiBaseUrl } from '../../lib/api';
import { shortenAddress } from '../../lib/utils';
import type { CreditTier } from '../../lib/utils';
import { getMerchantStakingAddress, getContracts } from '../../lib/contracts';
import { MERCHANT_STAKING_ABI } from '../../lib/ABI/MerchantStaking_ABI';

const TIER_COLORS: Record<CreditTier, string> = {
  Seed: 'var(--text-secondary)',
  Bronze: '#cd7f32',
  Silver: '#c0c0c0',
  Gold: '#ffd700',
  Platinum: '#e5e4e2',
};

const TIER_ORDER: Record<string, number> = {
  Platinum: 4,
  Gold: 3,
  Silver: 2,
  Bronze: 1,
  Seed: 0,
};

/** Placeholder APY % by tier until on-chain yield is available. */
const TIER_APY: Record<string, number> = {
  Seed: 2,
  Bronze: 3.5,
  Silver: 5,
  Gold: 7,
  Platinum: 10,
};

function getTierApy(tier: string): number {
  return TIER_APY[tier] ?? TIER_APY.Seed;
}

/** Batch badge: Bronze, Silver, Gold for 1–3, then other colors for the rest. */
const BATCH_ICONS = [Package, Box, Layers, Archive, Bookmark, Hexagon] as const;
const BATCH_COLORS = [
  '#cd7f32', // 1 – Bronze
  '#c0c0c0', // 2 – Silver
  '#ffd700', // 3 – Gold
  '#e5e4e2', // 4 – Platinum
  '#3b82f6', // 5 – Blue
  '#14b8a6', // 6 – Teal
];

function getBatchStyle(batchIndex: number): { color: string; Icon: (typeof BATCH_ICONS)[number] } {
  const i = (batchIndex - 1) % BATCH_ICONS.length;
  return { color: BATCH_COLORS[i] ?? BATCH_COLORS[0], Icon: BATCH_ICONS[i] ?? BATCH_ICONS[0] };
}

interface MerchantForStaking {
  address: string;
  name: string;
  category: string;
  vaultAddress: string;
  registeredAt: string;
  score: number;
  tier: string;
  creditLimit: number;
  totalStaked?: number;
  website?: string;
  description?: string;
}

type TabId = 'overview' | 'merchants' | 'your-stakes';
type SortBy = 'tier' | 'score' | 'newest' | 'totalStaked';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Staking' },
  { id: 'merchants', label: 'Merchants to stake' },
  { id: 'your-stakes', label: 'Your stakes' },
];

const USDC_DECIMALS = 6;
const ERC20_APPROVE_ABI = [
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
] as const;

export default function Staking() {
  const stakingAddress = getMerchantStakingAddress();
  const contracts = getContracts(baseSepolia.id);
  const { address: userAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: baseSepolia.id });
  const publicClient = usePublicClient({ chainId: baseSepolia.id });

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [merchants, setMerchants] = useState<MerchantForStaking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('tier');
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantForStaking | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeSubmitting, setStakeSubmitting] = useState(false);
  const [withdrawMerchant, setWithdrawMerchant] = useState<MerchantForStaking | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  const { data: totalStakedWei } = useReadContract({
    address: (stakingAddress as `0x${string}`) ?? undefined,
    abi: MERCHANT_STAKING_ABI,
    functionName: 'totalStaked',
  });

  const totalStakedOnMerchantCalls = useMemo(
    () =>
      stakingAddress && merchants.length > 0
        ? merchants.map((m) => ({
            address: stakingAddress as `0x${string}`,
            abi: MERCHANT_STAKING_ABI,
            functionName: 'totalStakedOnMerchant' as const,
            args: [m.address as `0x${string}`] as const,
          }))
        : [],
    [stakingAddress, merchants],
  );

  const { data: totalStakedOnMerchantResults } = useReadContracts({
    contracts: totalStakedOnMerchantCalls,
  });

  const yourBalanceCalls = useMemo(
    () =>
      stakingAddress && userAddress && merchants.length > 0
        ? merchants.map((m) => ({
            address: stakingAddress as `0x${string}`,
            abi: MERCHANT_STAKING_ABI,
            functionName: 'balanceOf' as const,
            args: [userAddress as `0x${string}`, m.address as `0x${string}`] as const,
          }))
        : [],
    [stakingAddress, userAddress, merchants],
  );

  const { data: yourBalanceResults } = useReadContracts({
    contracts: yourBalanceCalls,
  });

  const loadMerchants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await apiGetJson<MerchantForStaking[] | { data?: MerchantForStaking[]; merchants?: MerchantForStaking[] }>('/api/merchants/list');
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { data?: MerchantForStaking[] }).data)
          ? (raw as { data: MerchantForStaking[] }).data
          : Array.isArray((raw as { merchants?: MerchantForStaking[] }).merchants)
            ? (raw as { merchants: MerchantForStaking[] }).merchants
            : [];
      setMerchants(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load merchants');
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMerchants();
  }, [loadMerchants]);

  const chainTvl = totalStakedWei != null ? Number(totalStakedWei) / 10 ** USDC_DECIMALS : null;
  const merchantStakedFromChain = useMemo(() => {
    const map: Record<string, number> = {};
    if (totalStakedOnMerchantResults && merchants.length === totalStakedOnMerchantResults.length) {
      totalStakedOnMerchantResults.forEach((r, i) => {
        const addr = merchants[i]?.address;
        if (addr && r?.status === 'success' && r.result != null) map[addr] = Number(r.result) / 10 ** USDC_DECIMALS;
      });
    }
    return map;
  }, [merchants, totalStakedOnMerchantResults]);
  const yourStakeByMerchant = useMemo(() => {
    const map: Record<string, number> = {};
    if (yourBalanceResults && merchants.length === yourBalanceResults.length && userAddress) {
      yourBalanceResults.forEach((r, i) => {
        const addr = merchants[i]?.address;
        if (addr && r?.status === 'success' && r.result != null) map[addr] = Number(r.result) / 10 ** USDC_DECIMALS;
      });
    }
    return map;
  }, [merchants, yourBalanceResults, userAddress]);
  const yourStakesSum = useMemo(
    () => Object.values(yourStakeByMerchant).reduce((a, b) => a + b, 0),
    [yourStakeByMerchant],
  );
  const totalStakedTvl = chainTvl ?? merchants.reduce((sum, m) => sum + (m.totalStaked ?? merchantStakedFromChain[m.address] ?? 0), 0);
  const getMerchantTotalStaked = (m: MerchantForStaking) => merchantStakedFromChain[m.address] ?? m.totalStaked ?? 0;
  const getYourStake = (m: MerchantForStaking) => yourStakeByMerchant[m.address] ?? 0;

  const stakedMerchantList = useMemo(
    () => merchants.filter((m) => (yourStakeByMerchant[m.address] ?? 0) > 0),
    [merchants, yourStakeByMerchant],
  );

  const stakeMetaCalls = useMemo(
    () =>
      stakingAddress && userAddress && stakedMerchantList.length > 0
        ? stakedMerchantList.map((m) => ({
            address: stakingAddress as `0x${string}`,
            abi: MERCHANT_STAKING_ABI,
            functionName: 'stakeMeta' as const,
            args: [userAddress as `0x${string}`, m.address as `0x${string}`] as const,
          }))
        : [],
    [stakingAddress, userAddress, stakedMerchantList],
  );

  const { data: stakeMetaResults } = useReadContracts({
    contracts: stakeMetaCalls,
  });

  const unlockByMerchant = useMemo(() => {
    const map: Record<string, { unlockAt: number; lockId: number }> = {};
    if (stakeMetaResults && stakedMerchantList.length === stakeMetaResults.length) {
      stakeMetaResults.forEach((r, i) => {
        const addr = stakedMerchantList[i]?.address;
        if (addr && r?.status === 'success' && r.result != null) {
          const [unlockAt, lockId] = r.result as [bigint, number];
          map[addr] = { unlockAt: Number(unlockAt), lockId: Number(lockId) };
        }
      });
    }
    return map;
  }, [stakedMerchantList, stakeMetaResults]);

  const sortedMerchants = useMemo(() => {
    let list = [...merchants];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.address || '').toLowerCase().includes(q) ||
          (m.category || '').toLowerCase().includes(q),
      );
    }
    if (sortBy === 'tier') {
      list.sort((a, b) => (TIER_ORDER[b.tier] ?? 0) - (TIER_ORDER[a.tier] ?? 0));
    } else if (sortBy === 'score') {
      list.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'totalStaked') {
      list.sort((a, b) => getMerchantTotalStaked(b) - getMerchantTotalStaked(a));
    } else {
      list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
    }
    return list;
  }, [merchants, sortBy, search, merchantStakedFromChain]);

  const handleStakeClick = (m: MerchantForStaking) => {
    setSelectedMerchant(m);
    setStakeAmount('');
  };

  const handleStakeSubmit = async () => {
    if (!selectedMerchant) return;
    const amount = stakeAmount.trim();
    const num = parseFloat(amount);
    if (!amount || Number.isNaN(num) || num <= 0) {
      toast.error('Enter a valid USDC amount');
      return;
    }
    if (!stakingAddress) {
      toast.error('Staking contract not configured. Set VITE_MERCHANT_STAKING_ADDRESS after deploying.');
      return;
    }
    if (!walletClient?.account || !publicClient) {
      toast.error('Connect your wallet to stake.');
      return;
    }
    const amountWei = parseUnits(amount, USDC_DECIMALS);
    const stakingAddr = stakingAddress as `0x${string}`;
    const usdcAddr = contracts.usdcAddress as `0x${string}`;
    const merchantAddr = selectedMerchant.address as `0x${string}`;
    setStakeSubmitting(true);
    try {
      const approveData = encodeFunctionData({
        abi: ERC20_APPROVE_ABI,
        functionName: 'approve',
        args: [stakingAddr, amountWei],
      });
      await walletClient.sendTransaction({
        account: walletClient.account,
        chain: baseSepolia,
        to: usdcAddr,
        data: approveData,
        gas: 500000n,
      });
      const stakeData = encodeFunctionData({
        abi: MERCHANT_STAKING_ABI,
        functionName: 'stake',
        args: [merchantAddr, amountWei],
      });
      await walletClient.sendTransaction({
        account: walletClient.account,
        chain: baseSepolia,
        to: stakingAddr,
        data: stakeData,
        gas: 750000n,
      });
      toast.success(`Staked ${amount} USDC on ${selectedMerchant.name}.`);
      setSelectedMerchant(null);
      setStakeAmount('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/user rejected|rejected the request|denied/i.test(msg)) {
        toast.info('You declined the transaction.');
      } else {
        toast.error(msg || 'Stake failed');
      }
    } finally {
      setStakeSubmitting(false);
    }
  };

  const handleWithdrawClick = (m: MerchantForStaking) => {
    setWithdrawMerchant(m);
    setWithdrawAmount(String(getYourStake(m)));
  };

  const handleWithdrawSubmit = async () => {
    if (!withdrawMerchant) return;
    const amount = withdrawAmount.trim();
    const num = parseFloat(amount);
    if (!amount || Number.isNaN(num) || num <= 0) {
      toast.error('Enter a valid USDC amount to withdraw');
      return;
    }
    const maxStake = getYourStake(withdrawMerchant);
    if (num > maxStake) {
      toast.error(`You can withdraw at most $${maxStake.toLocaleString('en-US', { maximumFractionDigits: 2 })}`);
      return;
    }
    const meta = unlockByMerchant[withdrawMerchant.address];
    const nowSec = Math.floor(Date.now() / 1000);
    if (meta && meta.unlockAt > 0 && nowSec < meta.unlockAt) {
      toast.error('This stake is locked. Withdraw is available after the unlock date.');
      return;
    }
    if (!stakingAddress || !walletClient?.account) {
      toast.error('Connect your wallet to withdraw.');
      return;
    }
    const amountWei = parseUnits(amount, USDC_DECIMALS);
    const stakingAddr = stakingAddress as `0x${string}`;
    const merchantAddr = withdrawMerchant.address as `0x${string}`;
    setWithdrawSubmitting(true);
    try {
      const withdrawData = encodeFunctionData({
        abi: MERCHANT_STAKING_ABI,
        functionName: 'withdraw',
        args: [merchantAddr, amountWei],
      });
      await walletClient.sendTransaction({
        account: walletClient.account,
        chain: baseSepolia,
        to: stakingAddr,
        data: withdrawData,
        gas: 750000n,
      });
      toast.success(`Withdrew ${amount} USDC from ${withdrawMerchant.name || 'merchant'}.`);
      setWithdrawMerchant(null);
      setWithdrawAmount('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/user rejected|rejected the request|denied/i.test(msg)) {
        toast.info('You declined the transaction.');
      } else {
        toast.error(msg || 'Withdraw failed');
      }
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats bar – Uniswap-style key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="rounded-xl border border-white/10 bg-secondary/80 p-4">
          <p className="text-xs font-medium text-secondary uppercase tracking-wider">Total merchants</p>
          <p className="text-xl font-bold text-primary mt-0.5 tabular-nums">{loading ? '—' : merchants.length}</p>
          <p className="text-xs text-secondary mt-1">registered on-chain</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-secondary/80 p-4">
          <p className="text-xs font-medium text-secondary uppercase tracking-wider">Total staked (TVL)</p>
          <p className="text-xl font-bold text-primary mt-0.5 tabular-nums">
            {loading ? '—' : totalStakedTvl > 0 ? `$${totalStakedTvl.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$0'}
          </p>
          <p className="text-xs text-secondary mt-1">across all merchants</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-secondary/80 p-4">
          <p className="text-xs font-medium text-secondary uppercase tracking-wider">Your stakes</p>
          <p className="text-xl font-bold text-primary mt-0.5 tabular-nums">
            {!stakingAddress ? '—' : !isConnected ? '—' : `$${yourStakesSum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
          </p>
          <p className="text-xs text-secondary mt-1">{!stakingAddress ? 'deploy staking contract' : !isConnected ? 'connect wallet to stake' : 'across merchants'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-secondary/80 p-4">
          <p className="text-xs font-medium text-secondary uppercase tracking-wider">APY range</p>
          <p className="text-xl font-bold text-accent-green mt-0.5">2% – 10%</p>
          <p className="text-xs text-secondary mt-1">by tier (Seed → Platinum)</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-secondary/80 p-4 flex flex-col justify-center">
          <button
            type="button"
            onClick={() => loadMerchants()}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-tertiary/50 px-3 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs – Uniswap-style horizontal tabs */}
      <div className="border-b border-white/10 mb-4">
        <nav className="flex gap-6" role="tablist">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === id ? 'text-accent-green' : 'text-secondary hover:text-primary'
              }`}
            >
              {label}
              {activeTab === id && (
                <motion.span
                  layoutId="staking-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green"
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400 mb-4">
          {error}
        </div>
      )}

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.section
            key="overview"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border border-white/10 bg-secondary/50 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-accent-green" />
              <h2 className="text-lg font-semibold text-primary">Stake USDC on merchants</h2>
            </div>

            {/* Merchant list – read about each */}
            {loading ? (
              <div className="py-12 text-center">
                <RefreshCw className="w-8 h-8 text-secondary mx-auto animate-spin mb-3" />
                <p className="text-secondary text-sm">Loading merchants…</p>
              </div>
            ) : merchants.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-white/10 bg-tertiary/30">
                <Store className="w-12 h-12 text-secondary/70 mx-auto mb-3" />
                <p className="text-primary font-medium">No merchants yet</p>
                <p className="text-secondary text-sm mt-1">Registered merchants will appear here. Check back later or go to the Merchants to stake tab.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-secondary">
                  {merchants.length} merchant{merchants.length !== 1 ? 's' : ''} — tap one to read more and stake
                </p>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedMerchants.slice(0, 24).map((m, i) => {
                    const { color, Icon } = getBatchStyle(i + 1);
                    const hasWebsite = m.website && m.website.trim().length > 0;
                    const hasDescription = m.description && m.description.trim().length > 0;
                    const displayUrl = hasWebsite
                      ? (m.website!.startsWith('http') ? m.website : `https://${m.website!.replace(/^https?:\/\//, '')}`)
                      : null;
                    return (
                      <li key={m.address}>
                        <div
                          className="rounded-xl border border-white/10 bg-tertiary/30 p-4 h-full flex flex-col hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span
                              className="inline-flex items-center justify-center w-10 h-10 rounded-full border shrink-0"
                              style={{
                                backgroundColor: `${color}20`,
                                color,
                                borderColor: `${color}50`,
                              }}
                              title={`Batch ${i + 1}`}
                            >
                              <Icon className="w-5 h-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-primary truncate">{m.name || 'Unnamed merchant'}</h3>
                              <p className="text-xs text-secondary mt-0.5">{m.category}</p>
                              {displayUrl && (
                                <a
                                  href={displayUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1.5 text-xs text-accent-green hover:underline truncate max-w-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{displayUrl.replace(/^https?:\/\//, '')}</span>
                                </a>
                              )}
                            </div>
                          </div>
                          {hasDescription && (
                            <div className="text-sm text-secondary mb-2 flex-1 min-h-0 overflow-y-auto max-h-28 rounded-lg bg-black/20 px-2.5 py-2 border border-white/5">
                              <p className="whitespace-pre-wrap break-words">{m.description!.trim()}</p>
                            </div>
                          )}
                          <p className="text-xs text-secondary mb-2">
                            Identity tier <span className="font-medium text-primary">{m.tier}</span>, score {m.score}/1000.
                            {getMerchantTotalStaked(m) > 0 && (
                              <> ${getMerchantTotalStaked(m).toLocaleString('en-US', { maximumFractionDigits: 0 })} total staked.</>
                            )}{' '}
                            Earn up to <span className="text-accent-green font-medium">{getTierApy(m.tier)}%</span> APY.
                          </p>
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                            <span
                              className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold border"
                              style={{
                                backgroundColor: `${TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed}18`,
                                color: TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed,
                                borderColor: `${TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed}40`,
                              }}
                            >
                              {m.tier}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMerchant(m);
                                setStakeAmount('');
                              }}
                              className="rounded-lg bg-accent-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-green-hover transition-colors"
                            >
                              Stake
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {sortedMerchants.length > 24 && (
                  <p className="text-sm text-secondary text-center pt-2">
                    Showing 24 of {sortedMerchants.length}. Switch to <button type="button" onClick={() => setActiveTab('merchants')} className="text-accent-green hover:underline font-medium">Merchants to stake</button> to see all and search.
                  </p>
                )}
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'merchants' && (
          <motion.section
            key="merchants"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border border-white/10 bg-secondary/50 overflow-hidden"
          >
            {/* Table toolbar – Uniswap-style */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-white/10">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-tertiary pl-9 pr-4 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent-green/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-tertiary px-3 py-2 text-sm text-primary hover:bg-white/5"
                  >
                    Sort: {sortBy === 'tier' ? 'Tier' : sortBy === 'score' ? 'Score' : sortBy === 'totalStaked' ? 'Total staked' : 'Newest'}
                    <ChevronDown className={`w-4 h-4 ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} aria-hidden />
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-lg border border-white/10 bg-secondary shadow-xl py-1"
                        >
                          {(['tier', 'score', 'totalStaked', 'newest'] as const).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setSortBy(key);
                                setSortOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                sortBy === key ? 'text-accent-green bg-accent-green/10' : 'text-primary hover:bg-white/5'
                              }`}
                            >
                              {key === 'tier' ? 'Tier' : key === 'score' ? 'Score' : key === 'totalStaked' ? 'Total staked' : 'Newest'}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-xs text-secondary hidden sm:inline">{sortedMerchants.length} merchants</span>
              </div>
            </div>

            {/* Table – Uniswap-style data table */}
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-secondary mx-auto animate-spin mb-3" />
                <p className="text-secondary text-sm">Loading merchants from database…</p>
              </div>
            ) : sortedMerchants.length === 0 ? (
              <div className="p-12 text-center">
                <Store className="w-12 h-12 text-secondary/70 mx-auto mb-3" />
                <p className="text-primary font-medium">No merchants found</p>
                <p className="text-secondary text-sm mt-1">
                  {merchants.length === 0
                    ? 'Merchants appear here after they register on-chain and are stored in the database.'
                    : 'Try a different search or sort.'}
                </p>
                {merchants.length === 0 && !loading && (
                  <p className="text-xs text-secondary mt-3 max-w-md mx-auto">
                    To verify the backend: open{' '}
                    <a
                      href={`${getApiBaseUrl()}/api/merchants/list`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-green hover:underline break-all"
                    >
                      {getApiBaseUrl()}/api/merchants/list
                    </a>{' '}
                    in a new tab. If you see a JSON array of merchants, the DB has data and the frontend will show them after refresh.
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-secondary font-medium">
                      <th className="py-3 px-4 w-10">#</th>
                      <th className="py-3 px-4">Merchant</th>
                      <th className="py-3 px-4">Batch</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4 text-right">Score</th>
                      <th className="py-3 px-4 text-right">APY</th>
                      <th className="py-3 px-4 text-right">Total staked</th>
                      <th className="py-3 px-4 text-right">Your stake</th>
                      <th className="py-3 px-4 w-28"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMerchants.map((m, i) => (
                      <tr
                        key={m.address}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-secondary tabular-nums">{i + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-primary border border-white/10"
                              style={{
                                backgroundColor: `${TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed}20`,
                              }}
                            >
                              {(m.name || 'M').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-primary truncate">{m.name || 'Unnamed'}</p>
                              <p className="text-xs text-secondary font-mono">{shortenAddress(m.address, 6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {(() => {
                            const batchNum = i + 1;
                            const { color, Icon } = getBatchStyle(batchNum);
                            return (
                              <span
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full border shrink-0"
                                style={{
                                  backgroundColor: `${color}20`,
                                  color,
                                  borderColor: `${color}50`,
                                }}
                                title={`Batch ${batchNum}`}
                              >
                                <Icon className="w-4 h-4" />
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold border"
                            style={{
                              backgroundColor: `${TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed}18`,
                              color: TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed,
                              borderColor: `${TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed}40`,
                            }}
                          >
                            {m.tier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-primary">{m.score}/1000</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-accent-green font-medium tabular-nums">{getTierApy(m.tier)}%</span>
                        </td>
                        <td className="py-3 px-4 text-right text-secondary tabular-nums">
                          ${getMerchantTotalStaked(m).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right text-secondary tabular-nums">
                          {stakingAddress && isConnected ? `$${getYourStake(m).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleStakeClick(m)}
                            className="rounded-lg bg-accent-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-green-hover transition-colors"
                          >
                            Stake
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-4 py-2 text-xs text-secondary border-t border-white/5">
                  APY is tier-based (Seed 2% → Platinum 10%) until on-chain yield is live. Total staked and your stake read from the staking contract when VITE_MERCHANT_STAKING_ADDRESS is set.
                </p>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'your-stakes' && (
          <motion.section
            key="your-stakes"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border border-white/10 bg-secondary/50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <p className="text-sm text-secondary">Your active stakes on merchants.</p>
              <p className="text-xs text-secondary">
                Total:&nbsp;
                <span className="font-semibold text-primary">
                  {stakingAddress && isConnected
                    ? `$${yourStakesSum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
                    : '—'}
                </span>
              </p>
            </div>
            {!stakingAddress || !isConnected ? (
              <div className="p-12 text-center">
                <Wallet className="w-12 h-12 text-secondary/60 mx-auto mb-3" />
                <p className="text-primary font-medium">Connect wallet to see your stakes</p>
                <p className="text-secondary text-sm mt-1">
                  Connect a wallet on Base Sepolia and stake on a merchant to see positions here.
                </p>
              </div>
            ) : loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-secondary mx-auto animate-spin mb-3" />
                <p className="text-secondary text-sm">Loading your stakes…</p>
              </div>
            ) : (
              (() => {
                const stakedMerchants = sortedMerchants.filter((m) => getYourStake(m) > 0);
                if (stakedMerchants.length === 0) {
                  return (
                    <div className="p-12 text-center">
                      <Wallet className="w-12 h-12 text-secondary/60 mx-auto mb-3" />
                      <p className="text-primary font-medium">No active stakes</p>
                      <p className="text-secondary text-sm mt-1">
                        Stake on a merchant in the Merchants to stake tab to start earning yields.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="p-4 space-y-3">
                    {stakedMerchants.map((m) => {
                      const meta = unlockByMerchant[m.address];
                      const unlockAt = meta?.unlockAt ?? 0;
                      const nowSec = Math.floor(Date.now() / 1000);
                      const isLocked = unlockAt > 0 && nowSec < unlockAt;
                      const unlockDate = unlockAt > 0 ? new Date(unlockAt * 1000) : null;
                      const canWithdraw = !isLocked;
                      return (
                        <div
                          key={m.address}
                          className="rounded-xl border border-white/10 bg-tertiary/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-primary border border-white/10"
                              style={{
                                backgroundColor: `${TIER_COLORS[m.tier as CreditTier] ?? TIER_COLORS.Seed}20`,
                              }}
                            >
                              {(m.name || 'M').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-primary truncate">{m.name || 'Unnamed merchant'}</p>
                              <p className="text-xs text-secondary font-mono">{shortenAddress(m.address, 6)}</p>
                              <p className="text-xs text-secondary mt-0.5">
                                Tier{' '}
                                <span className="font-semibold text-primary">
                                  {m.tier}
                                </span>{' '}
                                • Score {m.score}/1000
                              </p>
                              <p className="text-xs mt-1">
                                {unlockAt === 0 ? (
                                  <span className="text-accent-green">Withdraw anytime</span>
                                ) : isLocked && unlockDate ? (
                                  <span className="text-amber-500">
                                    Unlocks {unlockDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                  </span>
                                ) : (
                                  <span className="text-accent-green">Unlocked — withdraw available</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2 text-sm">
                            <p className="text-secondary">
                              Total staked:{' '}
                              <span className="font-semibold text-primary tabular-nums">
                                ${getMerchantTotalStaked(m).toLocaleString('en-US', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </p>
                            <p className="text-secondary">
                              Your stake:{' '}
                              <span className="font-semibold text-accent-green tabular-nums">
                                ${getYourStake(m).toLocaleString('en-US', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </p>
                            <button
                              type="button"
                              onClick={() => handleWithdrawClick(m)}
                              disabled={!canWithdraw}
                              className="rounded-lg bg-accent-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Withdraw
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Stake modal */}
      <AnimatePresence>
        {selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMerchant(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stake-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-secondary rounded-2xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10">
                <h2 id="stake-modal-title" className="text-lg font-semibold text-primary">
                  Stake on {selectedMerchant.name || 'Unnamed'}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {(() => {
                    const batchNum = sortedMerchants.findIndex((x) => x.address === selectedMerchant.address) + 1;
                    const { color, Icon } = getBatchStyle(batchNum);
                    return (
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full border shrink-0"
                        style={{
                          backgroundColor: `${color}20`,
                          color,
                          borderColor: `${color}50`,
                        }}
                        title={`Batch ${batchNum}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                    );
                  })()}
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold border"
                    style={{
                      backgroundColor: `${TIER_COLORS[selectedMerchant.tier as CreditTier] ?? TIER_COLORS.Seed}18`,
                      color: TIER_COLORS[selectedMerchant.tier as CreditTier] ?? TIER_COLORS.Seed,
                      borderColor: `${TIER_COLORS[selectedMerchant.tier as CreditTier] ?? TIER_COLORS.Seed}40`,
                    }}
                  >
                    {selectedMerchant.tier}
                  </span>
                  <span className="text-xs text-secondary">Score {selectedMerchant.score}/1000</span>
                  <span className="text-xs text-accent-green font-medium">APY {getTierApy(selectedMerchant.tier)}%</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-tertiary/50 px-2.5 py-1.5">
                    <p className="text-secondary">Total staked</p>
                    <p className="font-medium text-primary tabular-nums">
                      ${getMerchantTotalStaked(selectedMerchant).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-tertiary/50 px-2.5 py-1.5">
                    <p className="text-secondary">Est. yield (1y)</p>
                    <p className="font-medium text-accent-green tabular-nums">
                      {stakeAmount && !Number.isNaN(parseFloat(stakeAmount))
                        ? `$${((parseFloat(stakeAmount) * getTierApy(selectedMerchant.tier)) / 100).toFixed(2)}`
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-primary">Amount (USDC)</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-tertiary px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent-green/50"
                  />
                </label>
                <div className="flex items-center justify-between text-xs text-secondary rounded-lg bg-tertiary/50 px-3 py-2">
                  <span>APY {getTierApy(selectedMerchant.tier)}%</span>
                  <span className="text-accent-green font-medium tabular-nums">
                    {stakeAmount && !Number.isNaN(parseFloat(stakeAmount)) && parseFloat(stakeAmount) > 0
                      ? `Est. 1y: $${((parseFloat(stakeAmount) * getTierApy(selectedMerchant.tier)) / 100).toFixed(2)}`
                      : 'Est. 1y: —'}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMerchant(null)}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStakeSubmit}
                    disabled={stakeSubmitting}
                    className="flex-1 rounded-lg bg-accent-green py-2 text-sm font-semibold text-white hover:bg-accent-green-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {stakeSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Wallet className="w-4 h-4" /> Stake</>}
                  </button>
                </div>
                <p className="text-[10px] text-secondary text-center">
                  {stakingAddress ? 'Two txs: approve USDC then stake. APY is tier-based until on-chain yield is live.' : 'Set VITE_MERCHANT_STAKING_ADDRESS after deploying the staking contract.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw modal */}
      <AnimatePresence>
        {withdrawMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setWithdrawMerchant(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-secondary rounded-2xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10">
                <h2 id="withdraw-modal-title" className="text-lg font-semibold text-primary">
                  Withdraw from {withdrawMerchant.name || 'Unnamed'}
                </h2>
                <p className="text-sm text-secondary mt-1">
                  Your stake: ${getYourStake(withdrawMerchant).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USDC
                </p>
                {(() => {
                  const meta = unlockByMerchant[withdrawMerchant.address];
                  const unlockAt = meta?.unlockAt ?? 0;
                  const nowSec = Math.floor(Date.now() / 1000);
                  const isLocked = unlockAt > 0 && nowSec < unlockAt;
                  const unlockDate = unlockAt > 0 ? new Date(unlockAt * 1000) : null;
                  return unlockAt > 0 ? (
                    <p className="text-xs mt-2">
                      {isLocked && unlockDate ? (
                        <span className="text-amber-500">Unlocks {unlockDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      ) : (
                        <span className="text-accent-green">Unlocked — you can withdraw.</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-xs text-accent-green mt-2">Flexible stake — withdraw anytime.</p>
                  );
                })()}
              </div>
              <div className="p-4 space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-primary">Amount to withdraw (USDC)</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-tertiary px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent-green/50"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(String(getYourStake(withdrawMerchant)))}
                  className="text-xs text-accent-green hover:underline"
                >
                  Max
                </button>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setWithdrawMerchant(null)}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleWithdrawSubmit}
                    disabled={withdrawSubmitting}
                    className="flex-1 rounded-lg bg-accent-green py-2 text-sm font-semibold text-white hover:bg-accent-green-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {withdrawSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Withdraw</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
