'use client';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star } from 'lucide-react';
import { Listing, getConditionClass } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

const ease = [0.16, 1, 0.3, 1] as const;

interface Props {
  listing: Listing;
  index: number;
  variant?: 'default' | 'browse';
}

export default function ListingCard({ listing, index, variant = 'default' }: Props) {
  const conditionClass = getConditionClass(listing.condition);
  const isBrowse = variant === 'browse';

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
            {/* Bottom gradient overlay with category badge */}
            <div className="listing-image-meta">
              <span className="category-badge">{listing.category}</span>
            </div>
            {/* Save button */}
            <button
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
              onClick={(e) => { e.preventDefault(); }}
            >
              <Heart
                size={14}
                fill={listing.saved ? '#fff' : 'none'}
                color="#fff"
              />
            </button>
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
                <div className="card-seller-row">
                  <div className="card-seller-avatar">{listing.seller.name.charAt(0)}</div>
                  <div className="card-seller-info">
                    <span className="card-seller-name">{listing.seller.name.split(' ')[0]}</span>
                    <div className="card-seller-rating">
                      <Star size={10} fill="#facc15" color="#facc15" />
                      <span>{listing.seller.rating}</span>
                    </div>
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
