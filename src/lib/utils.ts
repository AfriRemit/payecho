import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Format USDC amount (6 decimals) for display */
export function formatUSDC(raw: string | number): string {
  const n = typeof raw === 'string' ? parseFloat(raw) : raw;
  if (Number.isNaN(n)) return '0.00';
  return (n / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Format date for display */
export function formatDate(timestamp: number | Date): string {
  const d = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Convert BPS to percentage string */
export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}

/** Credit tier from score (0–1000) per Masterplan */
export type CreditTier = 'Seed' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export function tierFromScore(score: number): CreditTier {
  if (score >= 850) return 'Platinum';
  if (score >= 700) return 'Gold';
  if (score >= 500) return 'Silver';
  if (score >= 300) return 'Bronze';
  return 'Seed';
}
