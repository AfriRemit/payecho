import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { WalletButton } from './web3/WalletButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 px-6 py-4 bg-secondary/95 backdrop-blur-sm border-b"
      style={{ borderColor: 'var(--bg-tertiary)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 focus:outline-none">
              <img src="/assets/Remifi logo.svg" alt="PayEcho Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-primary">PayEcho</h1>
            </Link>
            <nav className="flex items-center space-x-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-primary hover:text-accent-green transition-colors duration-200 ${isActive ? 'text-accent-green' : ''}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/pay"
                className={({ isActive }) =>
                  `text-primary hover:text-accent-green transition-colors duration-200 ${isActive ? 'text-accent-green' : ''}`
                }
              >
                Pay
              </NavLink>
            </nav>
          </div>

          <Link to="/" className="md:hidden flex items-center space-x-3 focus:outline-none">
            <img src="/assets/Remifi logo.svg" alt="PayEcho Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-primary">PayEcho</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <WalletButton />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary hover:text-accent-green transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mt-4 pt-4 border-t md:hidden"
              style={{ borderColor: 'var(--bg-tertiary)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <nav className="space-y-4">
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-left w-full text-primary hover:text-accent-green transition-colors duration-200 py-2 ${isActive ? 'text-accent-green' : ''}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/pay"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-left w-full text-primary hover:text-accent-green transition-colors duration-200 py-2 ${isActive ? 'text-accent-green' : ''}`
                    }
                  >
                    Pay
                  </NavLink>
                </nav>
                <div
                  className="flex items-center justify-between pt-4 border-t"
                  style={{ borderColor: 'var(--bg-tertiary)' }}
                >
                  <ThemeToggle />
                  <WalletButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
