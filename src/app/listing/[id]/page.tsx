'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Star,
  MessageCircle,
  Share2,
  Shield,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { sampleListings, getConditionClass } from '@/lib/data';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';

const ease = [0.16, 1, 0.3, 1] as const;

function stagger(i: number, base = 0.15) {
  return { duration: 0.6, delay: base + i * 0.08, ease };
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const listing = sampleListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <PageTransition>
        <div className="container-vspr page-shell text-center">
          <h1 className="text-4xl font-bold">Not found</h1>
          <p className="text-secondary mt-4">
            This listing doesn&apos;t exist.
          </p>
          <Link href="/browse" className="pill-btn mt-8 inline-flex">
            Back to Browse
          </Link>
        </div>
      </PageTransition>
    );
  }

  const conditionClass = getConditionClass(listing.condition);

  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
        >
          <Link
            href="/browse"
            className="text-muted mb-10 inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> Back to listings
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ─── Image column ─── */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(0, 0.1)}
          >
            <div className="listing-detail-image-wrap">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="relative w-full h-full"
              >
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Overlay badges */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-7 py-6 pointer-events-none bg-gradient-to-t from-black/50 to-transparent">
                <span className="category-badge">{listing.category}</span>
                <span className="listing-image-label">Ready for pickup</span>
              </div>
            </div>
          </motion.div>

          {/* ─── Details column ─── */}
          <div className="lg:col-span-5 flex flex-col gap-0">
            {/* Condition pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(1)}
              className="flex items-center gap-3 mb-5"
            >
              <span className="listing-detail-condition">
                <span className={`condition-dot ${conditionClass}`} />
                {listing.condition}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(2)}
              className="text-3xl md:text-[2.5rem] font-bold leading-[1.1] tracking-tight"
            >
              {listing.title}
            </motion.h1>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(3)}
              className="price-tag text-4xl md:text-5xl mt-5"
            >
              ${listing.price}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={stagger(4)}
              className="divider my-7"
            />

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(5)}
            >
              <span className="section-label block mb-3">Description</span>
              <p className="text-secondary text-[15px] leading-relaxed max-w-prose">
                {listing.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={stagger(6)}
              className="divider my-7"
            />

            {/* Seller card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(7)}
              className="listing-detail-seller"
            >
              <div className="flex items-center gap-4">
                <div className="detail-avatar">
                  {listing.seller.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px]">
                    {listing.seller.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-sm">
                      <Star size={13} fill="#facc15" color="#facc15" />
                      <span className="text-white/80">
                        {listing.seller.rating}
                      </span>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="flex items-center gap-1 text-muted text-sm">
                      <MapPin size={13} />
                      {listing.seller.campus}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(8)}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <button className="pill-btn ui-icon-label flex-1 min-h-12">
                <MessageCircle size={17} />
                <span>Message Seller</span>
              </button>
              <button className="pill-btn pill-btn-outline ui-icon-label min-h-12 transition-colors hover:bg-white/5 hover:border-white/30">
                <Heart size={17} />
                <span>Save</span>
              </button>
              <button className="pill-btn pill-btn-outline ui-icon-label min-h-12 transition-colors hover:bg-white/5 hover:border-white/30">
                <Share2 size={17} />
              </button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={stagger(9)}
              className="mt-8 flex items-center gap-6 text-muted text-xs"
            >
              <span className="flex items-center gap-1.5">
                <Shield size={13} />
                Verified seller
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                Listed{' '}
                {new Date(listing.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
