import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, User, LogIn, LogOut, Mic, BadgeCheck, Menu } from 'lucide-react';

export function AccountDropdown() {
  const { isAuthenticated, address, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            login();
          }}
          className="flex items-center gap-2 rounded-full bg-accent-green px-4 py-2 font-medium text-white hover:bg-accent-green-hover transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-tertiary/50 px-4 py-2 text-sm font-medium text-primary hover:bg-white/5 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="font-mono text-secondary">
          {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Account'}
        </span>
        <Menu className="w-4 h-4 text-secondary shrink-0" aria-hidden />
        <ChevronDown className={`w-4 h-4 text-secondary transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[180px] rounded-lg border border-white/10 bg-secondary shadow-xl py-1 z-50"
          role="menu"
        >
          <Link
            to="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary hover:bg-white/5 transition-colors"
            role="menuitem"
          >
            <User className="w-4 h-4 text-secondary" />
            Profile
          </Link>
          <Link
            to="/dashboard/voice"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary hover:bg-white/5 transition-colors"
            role="menuitem"
          >
            <Mic className="w-4 h-4 text-secondary" />
            Voice
          </Link>
          <Link
            to="/dashboard/identity"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary hover:bg-white/5 transition-colors"
            role="menuitem"
          >
            <BadgeCheck className="w-4 h-4 text-secondary" />
            Identity
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary hover:bg-white/5 transition-colors text-left"
            role="menuitem"
          >
            <LogOut className="w-4 h-4 text-secondary" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
