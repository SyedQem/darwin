'use client';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
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

          {/* Info */}
          <div className={`flex flex-1 flex-col gap-3 p-5 ${isBrowse ? 'browse-listing-info' : ''}`}>
            {/* Condition */}
            <div className="flex items-center gap-2">
              <span className={`condition-dot ${conditionClass}`} />
              <span className="text-xs text-muted">{listing.condition}</span>
              <span className="text-muted text-xs">·</span>
              <span className="text-xs text-muted">{listing.category}</span>
            </div>

            {/* Title */}
            <h3 className={`font-semibold leading-snug tracking-tight line-clamp-2 ${isBrowse ? 'text-base' : 'text-sm'}`}>
              {listing.title}
            </h3>

            {/* Price + Location */}
            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <span className="price-tag text-lg">${listing.price}</span>
              <span className="ui-icon-label-tight text-muted text-xs">
                <MapPin size={11} />
                {listing.seller.campus}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
