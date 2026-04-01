'use client';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import { Listing, categoryIcons } from '@/lib/data';
import Link from 'next/link';

interface Props {
  listing: Listing;
  index: number;
}

export default function ListingCard({ listing, index }: Props) {
  const conditionClass = listing.condition === 'New'
    ? 'condition-new'
    : listing.condition === 'Like New'
      ? 'condition-like-new'
      : listing.condition === 'Good'
        ? 'condition-good'
        : 'condition-fair';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="vspr-card">
          {/* Image */}
          <div className="listing-image-container">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
            >
              {categoryIcons[listing.category]}
            </div>
            {/* Save button */}
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => { e.preventDefault(); }}
            >
              <Heart
                size={14}
                fill={listing.saved ? '#fff' : 'none'}
                color="#fff"
              />
            </button>
          </div>

          {/* Info */}
          <div className="p-5">
            {/* Category + Condition */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="category-badge">
                {listing.category}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className={`condition-dot ${conditionClass}`} />
                {listing.condition}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium leading-snug mb-2 line-clamp-2" style={{ minHeight: '2.5rem' }}>
              {listing.title}
            </h3>

            {/* Price + Location */}
            <div className="flex items-center justify-between mt-3">
              <span className="price-tag text-lg">${listing.price}</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={10} />
                {listing.seller.campus}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
