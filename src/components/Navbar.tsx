'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, PlusCircle, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="navbar-vspr">
        <div className="container-vspr flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            darwin<span style={{ color: 'var(--text-muted)' }}>.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-sm text-gray-400 hover:text-white transition-colors tracking-wide uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
              Browse
            </Link>
            <Link href="/sell" className="text-sm text-gray-400 hover:text-white transition-colors tracking-wide uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
              Sell
            </Link>
            <Link href="/saved" className="text-gray-400 hover:text-white transition-colors">
              <Heart size={18} />
            </Link>
            <Link href="/sell" className="pill-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>
              <PlusCircle size={14} className="mr-2" />
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
            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/browse" onClick={() => setMobileOpen(false)}>Browse</Link>
            <Link href="/sell" onClick={() => setMobileOpen(false)}>Sell</Link>
            <Link href="/saved" onClick={() => setMobileOpen(false)}>Saved</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
