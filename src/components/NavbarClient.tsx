'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ArrowRight } from 'lucide-react';

type NavbarClientProps = {
  isLoggedIn: boolean;
};

export default function NavbarClient({ isLoggedIn }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="navbar-vspr"
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-vspr flex h-full items-center justify-between">
          <Link href="/" className="logo-wordmark">
            darwin<span className="logo-dot">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="nav-link">Browse</Link>
            <Link href="/sell" className="nav-link">Sell</Link>
            <Link href="/saved" className="text-secondary transition-colors hover:text-white">
              <Heart size={18} />
            </Link>

            <Link
              href="/sell"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
            >
              List Item
            </Link>

            {isLoggedIn ? (
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
                >
                  Log out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
              >
                Log in
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-panel">
              <div className="mobile-menu-sheet">
                <div className="flex items-center justify-between">
                  <Link href="/" className="logo-wordmark" onClick={() => setMobileOpen(false)}>
                    darwin<span className="logo-dot">.</span>
                  </Link>
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mobile-menu-links">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/browse', label: 'Browse' },
                    { href: '/sell', label: 'Sell' },
                    { href: '/saved', label: 'Saved' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="mobile-menu-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={18} />
                    </Link>
                  ))}

                  {isLoggedIn ? (
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="mobile-menu-link w-full text-left"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>Log out</span>
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/login"
                      className="mobile-menu-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>Log in</span>
                      <ArrowRight size={18} />
                    </Link>
                  )}
                </div>

                <div className="mobile-menu-meta">Campus marketplace</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}