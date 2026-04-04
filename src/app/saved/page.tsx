'use client';
import { motion } from 'framer-motion';
import { sampleListings } from '@/lib/data';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function SavedPage() {
  const savedListings = sampleListings.filter((l) => l.saved);

  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">SAVED</span>
          <h1 className="section-title-md max-w-3xl">
            Your saved items.
          </h1>
          <p className="page-hero-copy max-w-2xl">
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
            className="empty-state mt-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Heart size={48} className="text-muted mx-auto" />
            <p className="text-secondary mt-6 text-xl font-medium">
              Nothing saved yet.
            </p>
            <p className="text-muted mt-2 text-sm">
              Browse listings and tap the heart icon to save.
            </p>
            <Link href="/browse" className="pill-btn mt-8 inline-flex">
              Browse Listings
            </Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
