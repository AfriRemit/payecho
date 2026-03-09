import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetJson, apiPatchJson, apiPostJson } from '../../lib/api';

export interface UserProfileResponse {
  walletAddress: string;
  displayName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantProfileResponse {
  address: string;
  name: string;
  category: string;
  location?: string;
  phone?: string;
  email?: string;
  preferredLanguage?: string;
  vaultAddress: string;
  website?: string;
  description?: string;
  registeredAt: string;
}

export default function Profile() {
  const { getToken, address } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [merchant, setMerchant] = useState<MerchantProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState({
    displayName: '',
    email: '',
    phone: '',
  });
  const [merchantEdit, setMerchantEdit] = useState({ website: '', description: '' });

  useEffect(() => {
    let cancelled = false;
    setError(null);
    (async () => {
      const token = await getToken();
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const [userData, merchantData] = await Promise.all([
          apiGetJson<UserProfileResponse>('/api/profile', { token }),
          address
            ? apiGetJson<MerchantProfileResponse | { error: string }>(
                `/api/merchants/${encodeURIComponent(address)}`,
                { token },
              ).catch(() => null)
            : Promise.resolve(null),
        ]);
        if (!cancelled && userData?.walletAddress) {
          setProfile(userData);
          const m = merchantData && !('error' in merchantData) ? merchantData : null;
          setMerchant(m ?? null);
          setEdit({
            displayName: userData.displayName ?? (m?.name && m.name !== 'Unnamed' ? m.name : '') ?? '',
            email: userData.email ?? m?.email ?? '',
            phone: userData.phone ?? m?.phone ?? '',
          });
          setMerchantEdit({
            website: m?.website ?? '',
            description: m?.description ?? '',
          });
        } else if (!cancelled) {
          setProfile(null);
          setError('Profile response missing wallet address');
        }
      } catch (e) {
        if (!cancelled) {
          setProfile(null);
          const msg = e instanceof Error ? e.message : String(e);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, address]);

  const handleSaveMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant) return;
    const token = await getToken();
    if (!token) {
      toast.error('Please log in again.');
      return;
    }
    setSaving(true);
    try {
      await apiPostJson(`/api/merchants/register`, {
        name: merchant.name,
        category: merchant.category,
        vaultAddress: merchant.vaultAddress,
        website: merchantEdit.website.trim() || undefined,
        description: merchantEdit.description.trim() || undefined,
      }, { token });
      setMerchant((m) => m ? { ...m, website: merchantEdit.website.trim() || undefined, description: merchantEdit.description.trim() || undefined } : null);
      toast.success('Website and description updated. They will appear on Staking.');
    } catch {
      toast.error('Failed to update merchant info.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    if (!token) {
      toast.error('Please log in again.');
      return;
    }
    setSaving(true);
    try {
      const updated = await apiPatchJson<UserProfileResponse>('/api/profile', {
        displayName: edit.displayName || undefined,
        email: edit.email || undefined,
        phone: edit.phone || undefined,
      }, { token });
      setProfile(updated);
      toast.success('Profile updated.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Profile</h1>
        <div className="bg-secondary rounded-xl border border-white/10 p-8 flex items-center justify-center">
          <p className="text-secondary">Loading…</p>
        </div>
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Profile</h1>
        <div className="bg-secondary rounded-xl border border-white/10 p-8 text-center space-y-3">
          <p className="text-secondary">Could not load profile.</p>
          {error && (
            <p className="text-sm text-red-400/90 font-mono break-all">
              {error}
            </p>
          )}
          <p className="text-sm text-secondary/80">
            Make sure you’re logged in and that <strong>identity tokens</strong> are enabled in your Privy app (Dashboard → User management → Authentication → Advanced). See PRIVY_SETUP.md for steps.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Profile</h1>
        <p className="text-secondary text-sm mt-1">
          Your wallet address and account details.
        </p>
      </div>

      {/* User wallet address — the only on-chain identity we show */}
      <div className="bg-secondary rounded-xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-2">
          Your wallet address
        </h2>
        <p className="text-primary font-mono text-sm break-all">
          {profile.walletAddress}
        </p>
        <p className="text-xs text-secondary mt-2">
          Use this address to receive USDC payments. Customers pay to this wallet via the shared payment pool.
        </p>
      </div>

      {/* Merchant details (from registration) */}
      {merchant ? (
        <div className="bg-secondary rounded-xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
            Business profile
          </h2>
          <p className="text-lg font-semibold text-primary mb-3">
            {merchant.name && merchant.name.trim() ? merchant.name : 'Unnamed business'}
          </p>
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-secondary">Category</dt>
              <dd className="text-primary">{merchant.category}</dd>
            </div>
            {merchant.location && (
              <div>
                <dt className="text-secondary">Location</dt>
                <dd className="text-primary">{merchant.location}</dd>
              </div>
            )}
            {merchant.preferredLanguage && (
              <div>
                <dt className="text-secondary">Preferred language</dt>
                <dd className="text-primary">{merchant.preferredLanguage}</dd>
              </div>
            )}
            {merchant.website && (
              <div>
                <dt className="text-secondary">Website</dt>
                <dd className="text-primary">
                  <a href={merchant.website.startsWith('http') ? merchant.website : `https://${merchant.website}`} target="_blank" rel="noopener noreferrer" className="text-accent-green hover:underline break-all">
                    {merchant.website}
                  </a>
                </dd>
              </div>
            )}
            {merchant.description && (
              <div>
                <dt className="text-secondary">Description</dt>
                <dd className="text-primary whitespace-pre-wrap text-sm">{merchant.description}</dd>
              </div>
            )}
          </dl>
          <p className="text-xs text-secondary mt-3">
            These details were saved when you registered as a merchant.
          </p>

          {merchant.vaultAddress && (
            <form onSubmit={handleSaveMerchant} className="mt-6 pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-sm font-semibold text-primary">Public info (for Staking)</h3>
              <p className="text-xs text-secondary">
                Website and description appear on the Staking page so stakers can read about your business.
              </p>
              <div>
                <label htmlFor="profile-website" className="block text-sm font-medium text-primary mb-1">
                  Website
                </label>
                <input
                  id="profile-website"
                  type="url"
                  value={merchantEdit.website}
                  onChange={(e) => setMerchantEdit((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2 text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                />
              </div>
              <div>
                <label htmlFor="profile-description" className="block text-sm font-medium text-primary mb-1">
                  Description
                </label>
                <textarea
                  id="profile-description"
                  value={merchantEdit.description}
                  onChange={(e) => setMerchantEdit((p) => ({ ...p, description: e.target.value }))}
                  placeholder="A short description of your business for stakers..."
                  rows={4}
                  className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2 text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent-green px-4 py-2 text-sm font-medium text-white hover:bg-accent-green-hover disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save website & description'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-xl border border-white/10 p-6">
          <p className="text-secondary text-sm">
            No merchant profile yet. Complete <strong>Register</strong> (Step 2) to add your business details and get your payment QR.
          </p>
        </div>
      )}

      {/* Editable profile */}
      <form onSubmit={handleSave} className="bg-secondary rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-primary">Your details</h2>

        <div>
          <label htmlFor="profile-displayName" className="block text-sm font-medium text-primary mb-1.5">
            Display name
          </label>
          <input
            id="profile-displayName"
            type="text"
            value={edit.displayName}
            onChange={(e) => setEdit((p) => ({ ...p, displayName: e.target.value }))}
            placeholder="e.g. Ada"
            className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-primary mb-1.5">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={edit.email}
            onChange={(e) => setEdit((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-sm font-medium text-primary mb-1.5">
            Phone
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={edit.phone}
            onChange={(e) => setEdit((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+233..."
            className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent-green px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </motion.div>
  );
}
