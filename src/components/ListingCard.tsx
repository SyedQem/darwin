'use client';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import { Listing, getConditionClass } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  listing: Listing;
  index: number;
}

export default function ListingCard({ listing, index }: Props) {
  const conditionClass = getConditionClass(listing.condition);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/listing/${listing.id}`} className="block h-full">
        <div className="vspr-card vspr-card-featured h-full flex flex-col">
          {/* Image */}
          <div className="listing-image-container">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
            <div className="listing-image-meta">
              <span className="category-badge">{listing.category}</span>
              <span className="listing-image-label">Campus Pick</span>
            </div>
            {/* Save button */}
            <button
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md"
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
          <div className="flex h-full flex-col gap-4 p-7 max-[420px]:p-6">
            {/* Category + Condition */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="ui-icon-label-tight text-secondary text-xs">
                <span className={`condition-dot ${conditionClass}`} />
                {listing.condition}
              </span>
            </div>

            {/* Title */}
            <h3
              className="min-h-[3.5rem] text-base font-medium leading-7 tracking-tight line-clamp-2 max-[420px]:line-clamp-3"
            >
              {listing.title}
            </h3>

            {/* Price + Location */}
            <div className="mt-auto flex flex-wrap items-start justify-between gap-x-4 gap-y-2.5 max-[360px]:flex-col max-[360px]:items-start">
              <span className="price-tag text-xl">${listing.price}</span>
              <span className="ui-icon-label-tight text-muted text-xs">
                <MapPin size={12} />
                {listing.seller.campus}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
