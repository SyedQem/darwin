'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, Star, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { sampleListings, getConditionClass } from '@/lib/data';
import Image from 'next/image';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = sampleListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="container-vspr page-shell text-center">
        <h1 className="text-4xl font-bold">Not found</h1>
        <p className="text-secondary mt-4">This listing doesn&apos;t exist.</p>
        <Link href="/browse" className="pill-btn mt-8 inline-flex">
          Back to Browse
        </Link>
      </div>
    );
  }

  const conditionClass = getConditionClass(listing.condition);

  return (
    <div className="container-vspr page-shell">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/browse"
          className="text-secondary mb-8 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to listings
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          className="vspr-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="media-frame aspect-square rounded-none border-0">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="media-overlay-lg flex items-end justify-between gap-4 px-6 py-6">
              <span className="category-badge">{listing.category}</span>
              <span className="listing-image-label">Ready for pickup</span>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          {/* Category + Condition */}
          <div className="flex items-center gap-3 mb-4">
            <span className="category-badge">{listing.category}</span>
            <span className="ui-icon-label-tight text-secondary text-xs">
              <span className={`condition-dot ${conditionClass}`} />
              {listing.condition}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {listing.title}
          </h1>

          {/* Price */}
          <div className="price-tag text-4xl mt-4">
            ${listing.price}
          </div>

          {/* Divider */}
          <div className="divider my-6" />

          {/* Description */}
          <div>
            <span className="section-label block mb-2">Description</span>
            <p className="text-secondary text-sm leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Divider */}
          <div className="divider my-6" />

          {/* Seller */}
          <div>
            <span className="section-label block mb-3">Seller</span>
            <div className="flex items-center gap-4">
              <div className="detail-avatar">
                {listing.seller.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{listing.seller.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Star size={12} fill="#facc15" color="#facc15" />
                  <span className="text-secondary text-xs">
                    {listing.seller.rating}
                  </span>
                  <span className="text-muted text-xs">•</span>
                  <span className="ui-icon-label-tight text-muted text-xs">
                    <MapPin size={12} />
                    {listing.seller.campus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button className="pill-btn ui-icon-label flex-1 min-h-10">
              <MessageCircle size={16} />
              <span>Message Seller</span>
            </button>
            <button className="pill-btn pill-btn-outline ui-icon-label min-h-10">
              <Heart size={16} />
              <span>Save</span>
            </button>
            <button className="pill-btn pill-btn-outline ui-icon-label min-h-10">
              <Share2 size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
