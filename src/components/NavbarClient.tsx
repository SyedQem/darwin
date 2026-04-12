'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ArrowRight } from 'lucide-react';

type NavbarClientProps = {
  isLoggedIn: boolean;
};

export default function NavbarClient({ isLoggedIn }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isWaitlist = pathname === '/waitlist';

  return (
    <>
      <motion.nav
        className="navbar-vspr"
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-vspr flex h-full items-center justify-between">
          <Link 
            href={isWaitlist ? '#' : '/'} 
            className="logo-wordmark"
            onClick={(e) => {
              if (isWaitlist) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            darwin<span className="logo-dot">.</span>
          </Link>

          {!isWaitlist && (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/browse" className="nav-link">
                  Browse
                </Link>

                <Link
                  href="/saved"
                  className="text-secondary transition-colors hover:text-white"
                  aria-label="Saved items"
                >
                  <Heart size={18} />
                </Link>

                <div className="ml-3 flex items-center gap-3">
                  <Link href="/sell" className="nav-sell-btn group">
                    <span className="flex w-full items-center justify-center gap-2.5 text-center">
                      <span>List Item</span>
                      <ArrowRight
                        size={15}
                        className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>

                  {isLoggedIn ? (
                    <form action="/signout" method="post">
                      <button type="submit" className="nav-auth-btn">
                        Log out
                      </button>
                    </form>
                  ) : (
                    <Link href="/login" className="nav-auth-btn">
                      Log in
                    </Link>
                  )}
                </div>
              </div>

              <button
                className="md:hidden text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
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
                    { href: '/sell', label: 'List Item' },
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
                    <form action="/signout" method="post">
                      <button
                        type="submit"
                        className="mobile-menu-link w-full cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left text-white/90 transition-all duration-200 hover:bg-white/[0.08]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>Log out</span>
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/login"
                      className="mobile-menu-link cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/90 transition-all duration-200 hover:bg-white/[0.08]"
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