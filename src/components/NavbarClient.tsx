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
                  <Link
                    href="/sell"
                    className="group inline-flex h-[50px] min-w-[158px] cursor-pointer items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] px-7 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] hover:text-white"
                  >
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
                      <button
                        type="submit"
                        className="inline-flex h-[50px] min-w-[118px] cursor-pointer items-center justify-center rounded-full border border-white/8 bg-transparent px-6 text-center text-[14px] font-medium tracking-[-0.01em] text-white/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.04] hover:text-white"
                      >
                        <span className="flex w-full items-center justify-center text-center">
                          Log out
                        </span>
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex h-[50px] min-w-[108px] cursor-pointer items-center justify-center rounded-full border border-white/8 bg-transparent px-6 text-center text-[14px] font-medium tracking-[-0.01em] text-white/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.04] hover:text-white"
                    >
                      <span className="flex w-full items-center justify-center text-center">
                        Log in
                      </span>
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