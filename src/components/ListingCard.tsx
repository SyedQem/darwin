'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star } from 'lucide-react';
import { Listing, getConditionClass } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ease = [0.16, 1, 0.3, 1] as const;

// Only DB listings have UUID-shaped ids — sample listings use '1'–'8'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Props {
  listing: Listing;
  index: number;
  variant?: 'default' | 'browse';
  /** Called after a successful save/unsave so parents can react (e.g. remove from saved list) */
  onSaveChange?: (listingId: string, saved: boolean) => void;
}

export default function ListingCard({ listing, index, variant = 'default', onSaveChange }: Props) {
  const router = useRouter();
  const conditionClass = getConditionClass(listing.condition);
  const isBrowse = variant === 'browse';
  const [saved, setSaved] = useState(listing.saved);
  const [pending, setPending] = useState(false);

  const isDbListing = UUID_RE.test(listing.id);
  const hasRating = typeof listing.seller.rating === 'number' && listing.seller.rating > 0;

  const handleSaveToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (pending) return;

      const next = !saved;

      // Optimistically update UI
      setSaved(next);

      // Only persist to DB for real listings (UUID ids)
      if (isDbListing) {
        setPending(true);
        try {
          const res = await fetch('/api/saved', {
            method: next ? 'POST' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId: listing.id }),
          });
          if (!res.ok) {
            // Revert on failure
            setSaved(saved);
            return;
          }
          onSaveChange?.(listing.id, next);
        } catch {
          // Revert on network error
          setSaved(saved);
        } finally {
          setPending(false);
        }
      }
    },
    [pending, saved, isDbListing, listing.id, onSaveChange]
  );

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease }}
    >
      <Link href={`/listing/${listing.id}`} className="block h-full">
        <div className={`vspr-card vspr-card-featured h-full flex flex-col ${isBrowse ? 'browse-listing-card' : ''}`}>
          {/* Image */}
          <div className={`listing-image-container ${isBrowse ? 'browse-listing-image-container' : ''}`}>
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
            {/* Hover overlay */}
            <div className="listing-card-hover-overlay">
              <span className="listing-card-hover-label">View Listing</span>
            </div>
            {/* Bottom gradient overlay with category badge */}
            <div className="listing-image-meta">
              <span className="category-badge">{listing.category}</span>
            </div>
            {/* Save button */}
            <motion.button
              className={`listing-save-btn ${saved ? 'listing-save-btn--saved' : ''}`}
              whileTap={{ scale: 0.75 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={handleSaveToggle}
              aria-label={saved ? 'Unsave listing' : 'Save listing'}
              disabled={pending}
            >
              <Heart
                size={14}
                fill={saved ? '#f97316' : 'none'}
                color={saved ? '#f97316' : '#fff'}
              />
            </motion.button>
          </div>

          <div className={`flex flex-1 flex-col gap-3 p-5 ${isBrowse ? 'browse-listing-info' : ''}`}>
            <div className={`flex items-center gap-2 ${isBrowse ? 'browse-listing-meta-row' : ''}`}>
              <span className={`condition-dot ${conditionClass}`} />
              <span className="text-xs text-muted">{listing.condition}</span>
            </div>

            <h3 className={`font-semibold leading-snug tracking-tight line-clamp-2 ${isBrowse ? 'browse-listing-title' : 'text-sm'}`}>
              {listing.title}
            </h3>

            <div className={`mt-auto flex items-end justify-between gap-3 pt-2 ${isBrowse ? 'browse-listing-footer' : ''}`}>
              <span className={`price-tag ${isBrowse ? 'browse-listing-price' : 'text-lg'}`}>${listing.price}</span>
              {isBrowse ? (
                <div
                  className="card-seller-row hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (listing.seller.id) {
                      router.push(`/profile/${listing.seller.id}`);
                    }
                  }}
                >
                  <div className="card-seller-avatar relative overflow-hidden flex items-center justify-center">
                    {listing.seller.avatar && listing.seller.avatar !== '/avatars/1.jpg' ? (
                      <Image
                        src={listing.seller.avatar}
                        alt={listing.seller.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    ) : (
                      listing.seller.name.charAt(0)
                    )}
                  </div>
                  <div className="card-seller-info">
                    <span className="card-seller-name">{listing.seller.name.split(' ')[0]}</span>
                    {hasRating && (
                      <div className="card-seller-rating">
                        <Star size={10} fill="#facc15" color="#facc15" />
                        <span>{listing.seller.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <span className="ui-icon-label-tight text-muted text-xs">
                  <MapPin size={11} />
                  {listing.seller.campus}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
