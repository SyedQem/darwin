'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, Star, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { sampleListings, categoryIcons } from '@/lib/data';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = sampleListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="container-vspr py-24 text-center">
        <h1 className="text-4xl font-bold">Not found</h1>
        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>This listing doesn&apos;t exist.</p>
        <Link href="/browse" className="pill-btn mt-8 inline-flex">
          Back to Browse
        </Link>
      </div>
    );
  }

  const conditionClass = listing.condition === 'New'
    ? 'condition-new'
    : listing.condition === 'Like New'
      ? 'condition-like-new'
      : listing.condition === 'Good'
        ? 'condition-good'
        : 'condition-fair';

  return (
    <div className="container-vspr py-8 md:py-16">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back to listings
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div
          className="vspr-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="w-full flex items-center justify-center text-8xl"
            style={{ aspectRatio: '1', background: 'var(--bg-elevated)' }}
          >
            {categoryIcons[listing.category]}
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
            <span className="ui-icon-label-tight text-xs" style={{ color: 'var(--text-secondary)' }}>
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
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {listing.description}
            </p>
          </div>

          {/* Divider */}
          <div className="divider my-6" />

          {/* Seller */}
          <div>
            <span className="section-label block mb-3">Seller</span>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
              >
                {listing.seller.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{listing.seller.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Star size={12} fill="#facc15" color="#facc15" />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {listing.seller.rating}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="ui-icon-label-tight text-xs" style={{ color: 'var(--text-muted)' }}>
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
