import { useAuth } from '../../contexts/AuthContext';

export function WalletButton() {
  const { isAuthenticated, address, login, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={login}
        className="rounded-full bg-accent-green px-6 py-2 font-medium text-white hover:bg-accent-green-hover transition-colors"
      >
        Log in / Sign up
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-secondary font-mono">
        {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—'}
      </span>
      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
