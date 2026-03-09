import { useState } from 'react';
import { Link } from 'react-router-dom';
import { encodeFunctionData } from 'viem';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { toast } from 'react-toastify';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { getBankVaultAddress } from '../../lib/contracts';
import { BANK_VAULT_ABI } from '../../lib/ABI/BankVault_ABI';

const USDC_DECIMALS = 6;
const GAS_WITHDRAW = 100_000n;

function parseUsdcToWei(amountStr: string): bigint | null {
  const num = parseFloat(amountStr);
  if (Number.isNaN(num) || num < 0) return null;
  return BigInt(Math.floor(num * 10 ** USDC_DECIMALS));
}

interface DepositWithdrawPanelProps {
  liquidUsdc: string;
  onWithdrawSuccess?: () => void;
}

export function DepositWithdrawPanel({ liquidUsdc, onWithdrawSuccess }: DepositWithdrawPanelProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  const { address: walletAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: baseSepolia.id });
  const publicClient = usePublicClient({ chainId: baseSepolia.id });

  const liquidNum = parseFloat(liquidUsdc) || 0;
  const withdrawWei = parseUsdcToWei(withdrawAmount);
  const canWithdraw =
    isConnected &&
    walletAddress &&
    walletClient?.account &&
    withdrawWei != null &&
    withdrawWei > 0n &&
    liquidNum >= (withdrawWei ? Number(withdrawWei) / 10 ** USDC_DECIMALS : 0);

  const handleWithdraw = async () => {
    if (!canWithdraw || !walletClient?.account || !withdrawWei) return;
    const vaultAddress = getBankVaultAddress() as `0x${string}`;
    setWithdrawing(true);
    try {
      if (publicClient) {
        await publicClient.simulateContract({
          account: walletClient.account,
          address: vaultAddress,
          abi: BANK_VAULT_ABI,
          functionName: 'withdraw',
          args: [withdrawWei],
        });
      }
      await walletClient.sendTransaction({
        account: walletClient.account,
        chain: baseSepolia,
        to: vaultAddress,
        data: encodeFunctionData({
          abi: BANK_VAULT_ABI,
          functionName: 'withdraw',
          args: [withdrawWei],
        }),
        gas: GAS_WITHDRAW,
      });
      toast.success('Withdraw submitted. USDC will arrive in your wallet shortly.');
      setWithdrawAmount('');
      onWithdrawSuccess?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/user rejected|rejected the request|denied/i.test(msg)) {
        toast.info('You declined the transaction.');
      } else if (/InsufficientLiquidBalance|insufficient/i.test(msg)) {
        toast.error('Insufficient liquid balance.');
      } else {
        toast.error(msg || 'Withdraw failed.');
      }
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-secondary/80 p-5 space-y-5">
      <h2 className="text-lg font-semibold text-primary">Deposit & withdraw</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-white/10 bg-tertiary/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownToLine className="w-4 h-4 text-accent-green" />
            <span className="text-sm font-medium text-primary">Deposit</span>
          </div>
          <p className="text-xs text-secondary mb-3">
            Add USDC to your balance by receiving payments. Share your QR code or pay link with customers.
          </p>
          <Link
            to="/dashboard/qr"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-green/20 text-accent-green px-3 py-2 text-sm font-medium hover:bg-accent-green/30 transition-colors"
          >
            Get QR & pay link
          </Link>
        </div>

        <div className="rounded-lg border border-white/10 bg-tertiary/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpFromLine className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Withdraw</span>
          </div>
          <p className="text-xs text-secondary mb-3">
            Send liquid USDC from your vault to your connected wallet.
          </p>
          {!isConnected ? (
            <p className="text-xs text-secondary/90">Connect the same wallet as your merchant account to withdraw.</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-tertiary px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent-green/50"
              />
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={!canWithdraw || withdrawing}
                className="rounded-lg bg-accent-green px-4 py-2 text-sm font-semibold text-white hover:bg-accent-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawing ? 'Withdrawing…' : 'Withdraw'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
