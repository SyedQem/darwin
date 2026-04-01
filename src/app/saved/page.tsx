'use client';
import { motion } from 'framer-motion';
import { sampleListings } from '@/lib/data';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function SavedPage() {
  const savedListings = sampleListings.filter((l) => l.saved);

  return (
    <div className="container-vspr py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">SAVED</span>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">
          Your saved items.
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Items you&apos;ve bookmarked for later.
        </p>
      </motion.div>

      {savedListings.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {savedListings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          className="py-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Heart size={48} style={{ color: 'var(--text-muted)', margin: '0 auto' }} />
          <p className="text-xl font-medium mt-6" style={{ color: 'var(--text-secondary)' }}>
            Nothing saved yet.
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Browse listings and tap the heart icon to save.
          </p>
          <Link href="/browse" className="pill-btn mt-8 inline-flex">
            Browse Listings
          </Link>
        </motion.div>
      )}
    </div>
  );
}
