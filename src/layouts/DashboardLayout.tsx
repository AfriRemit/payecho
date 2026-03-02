import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_LINKS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/transactions', label: 'Transactions', end: false },
  { to: '/dashboard/savings', label: 'Savings', end: false },
  { to: '/dashboard/lending', label: 'Lending', end: false },
  { to: '/dashboard/identity', label: 'Identity', end: false },
  { to: '/dashboard/voice', label: 'Voice', end: false },
  { to: '/dashboard/analytics', label: 'Analytics', end: false },
];

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 lg:pt-28 lg:pb-6 lg:border-r border-white/10 bg-secondary/80 backdrop-blur-sm">
        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {SIDEBAR_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-tertiary text-accent-green border border-white/10'
                    : 'text-secondary hover:text-primary hover:bg-tertiary/50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pt-4 border-t border-white/10">
          <p className="text-xs text-secondary">Base · USDC</p>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 px-4 py-2 bg-secondary/95 border-b border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-primary text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-secondary border-r border-white/10 pt-28 pb-6 lg:hidden"
            >
              <nav className="px-3 pt-4 space-y-0.5">
                {SIDEBAR_LINKS.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-tertiary text-accent-green border border-white/10'
                          : 'text-secondary hover:text-primary hover:bg-tertiary/50'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:pl-56 pt-20 lg:pt-20 min-h-screen">
        <div className="px-4 sm:px-6 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
