'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, Search, ArrowRight } from 'lucide-react';
import { categories, categoryIcons, sampleListings } from '@/lib/data';
import ListingCard from '@/components/ListingCard';

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center relative py-24 md:py-28">
        <div className="container-vspr">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="section-label">01 // CAMPUS MARKETPLACE</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mt-6 leading-none tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Buy. Sell.
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Evolve.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl max-w-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            The student marketplace that adapts. Find what you need, sell what you don&apos;t — all within your campus ecosystem.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/browse" className="pill-btn ui-icon-label min-h-10">
              <Search size={16} />
              <span>Browse Listings</span>
            </Link>
            <Link href="/sell" className="pill-btn pill-btn-outline">
              Start Selling
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="scroll-indicator absolute bottom-8 left-6 md:left-12 hidden sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span className="scroll-line" />
            Scroll to explore
            <ArrowDown size={12} />
          </motion.div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── CATEGORIES ── */}
      <section className="py-24 md:py-32">
        <div className="container-vspr">
          <span className="section-label">02 // CATEGORIES</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4">
            What are you looking for?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/browse?category=${encodeURIComponent(cat)}`}
                  className="vspr-card p-6 flex flex-col items-start gap-3 hover:border-gray-700 transition-all block"
                >
                  <div className="mb-2" style={{ color: 'var(--text-primary)' }}>
                    {categoryIcons[cat]}
                  </div>
                  <span className="text-sm font-medium">{cat}</span>
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── FEATURED LISTINGS ── */}
      <section className="py-24 md:py-32">
        <div className="container-vspr">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="section-label">03 // FEATURED</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-4">
                Recently Listed
              </h2>
            </div>
            <Link href="/browse" className="pill-btn pill-btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sampleListings.slice(0, 4).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 md:py-32">
        <div className="container-vspr">
          <span className="section-label">04 // HOW IT WORKS</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4">
            Three steps. Zero friction.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {[
              { num: '01', title: 'List', desc: 'Snap a photo, set a price, and publish your listing in seconds.' },
              { num: '02', title: 'Connect', desc: 'Chat with buyers and sellers directly. All within your campus.' },
              { num: '03', title: 'Exchange', desc: 'Meet on campus, complete the deal, and leave a review.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <span className="section-label text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>
                  {step.num}
                </span>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
