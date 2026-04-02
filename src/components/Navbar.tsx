'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PlusCircle, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="navbar-vspr">
        <div className="container-vspr flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="logo-wordmark">
            darwin<span className="logo-dot">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="nav-link">
              Browse
            </Link>
            <Link href="/sell" className="nav-link">
              Sell
            </Link>
            <Link href="/saved" className="text-secondary transition-colors hover:text-white">
              <Heart size={18} />
            </Link>
            <Link href="/sell" className="pill-btn pill-btn-sm">
              <PlusCircle size={14} />
              List Item
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
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
