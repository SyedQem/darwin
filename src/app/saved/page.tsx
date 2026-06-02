'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { createClient } from '@/lib/supabase/client';
import { Listing } from '@/lib/data';

export default function SavedPage() {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setSavedListings([]);
          return;
        }

        const { data, error } = await supabase
          .from('saved_listings')
          .select(`
            listing_id,
            listing:listings (
              id,
              title,
              description,
              price,
              category,
              condition,
              campus,
              image_url,
              created_at,
              seller:profiles (
                id,
                first_name,
                full_name,
                avatar_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching saved listings:', error);
          return;
        }

        const mapped: Listing[] = (data ?? [])
          .map((row: any) => {
            const item = row.listing;
            if (!item) return null;
            const sellerMeta = item.seller || {};
            const sellerName = sellerMeta.full_name || sellerMeta.first_name || 'Student';
            return {
              id: item.id,
              title: item.title,
              price: item.price,
              category: (item.category as any) || 'Other',
              condition: (item.condition as any) || 'New',
              description: item.description || '',
              image: item.image_url || '/images/textbook.svg',
              seller: {
                id: sellerMeta.id || '',
                name: sellerName,
                avatar: sellerMeta.avatar_url || '/avatars/1.jpg',
                rating: 0,
                campus: item.campus || 'Main Campus',
              },
              createdAt: item.created_at,
              saved: true,
            };
          })
          .filter(Boolean) as Listing[];

        setSavedListings(mapped);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, []);

  // Remove an item from the local list when the user unsaves it from this page
  const handleSaveChange = useCallback(
    (listingId: string, isSaved: boolean) => {
      if (!isSaved) {
        setSavedListings((prev) => prev.filter((l) => l.id !== listingId));
      }
    },
    []
  );

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
          <h1 className="section-title-md max-w-3xl">Your saved items.</h1>
          <p className="page-hero-copy max-w-2xl">Items you&apos;ve bookmarked for later.</p>
        </motion.div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="vspr-card h-72 skeleton-shimmer" />
            ))}
          </div>
        ) : savedListings.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {savedListings.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                index={i}
                onSaveChange={handleSaveChange}
              />
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
            <p className="text-secondary mt-6 text-xl font-medium">Nothing saved yet.</p>
            <p className="text-muted mt-2 text-sm">Browse listings and tap the heart icon to save.</p>
            <Link href="/browse" className="pill-btn mt-8 inline-flex">
              Browse Listings
            </Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
