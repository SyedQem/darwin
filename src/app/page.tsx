'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Search, Star, MapPin } from 'lucide-react';
import { categories, categoryIcons, sampleListings } from '@/lib/data';
import ListingCard from '@/components/ListingCard';
import Reviews from '@/components/Reviews';
import AnimatedSection from '@/components/AnimatedSection';

/* ── Shared easing ── */
const ease = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  /* Phone listings data */
  const phoneListings = sampleListings.slice(0, 5);

  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section ref={heroRef} className="home-hero relative flex flex-col justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity }}>
          <div className="container-vspr">
            <div className="home-hero-grid">
              {/* Left — Copy */}
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease }}
                >
                  <span className="section-label">CAMPUS MARKETPLACE</span>
                </motion.div>

                <motion.h1
                  className="home-headline mt-6 font-bold"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35, ease }}
                >
                  Buy what
                  <br />you need.
                  <br />
                  <span className="text-muted">Sell what you don&apos;t.</span>
                </motion.h1>

                <motion.p
                  className="home-subhead mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55, ease }}
                >
                  A campus marketplace with clearer listings, safer meetups, and a cleaner feed — built for students.
                </motion.p>

                <motion.div
                  className="home-cta-row mt-10"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7, ease }}
                >
                  <Link href="/browse" className="pill-btn ui-icon-label">
                    <Search size={16} />
                    <span>Browse Listings</span>
                  </Link>
                  <Link href="/sell" className="pill-btn pill-btn-outline">
                    Start Selling
                  </Link>
                </motion.div>

                <motion.div
                  className="home-proof-row mt-14"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.85, ease }}
                >
                  {[
                    { label: 'Verified Students', value: '12 campuses' },
                    { label: 'Avg. Sale Time', value: '< 10 minutes' },
                    { label: 'Student Rating', value: '4.9 / 5.0' },
                  ].map((item) => (
                    <div key={item.label} className="home-proof">
                      <div className="home-proof-label">{item.label}</div>
                      <p className="home-proof-value">{item.value}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Phone Mockup */}
              <motion.div
                className="flex justify-center"
                style={{ y: phoneY }}
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease }}
              >
                <div className="phone-mockup">
                  <div className="phone-notch" />
                  <div className="phone-screen">
                    <div className="phone-screen-header">
                      <p>darwin.</p>
                      <h3>Trending Near You</h3>
                    </div>
                    {phoneListings.map((listing) => (
                      <div key={listing.id} className="phone-product-card">
                        <div className="phone-product-thumb">
                          <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="phone-product-info">
                          <p className="phone-product-title">{listing.title}</p>
                          <p className="phone-product-meta">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={10} /> {listing.seller.campus}
                            </span>
                          </p>
                          <p className="phone-product-price">${listing.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="scroll-indicator mt-12 hidden sm:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              <span className="scroll-line" />
              Scroll to explore
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown size={12} />
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-24 md:py-32">
        <Reviews />
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── CATEGORIES ── */}
      <section className="py-20 md:py-28">
        <div className="container-vspr">
          <AnimatedSection>
            <span className="section-label">CATEGORIES</span>
            <h2 className="section-title-md mt-4 max-w-3xl">
              What are you looking for?
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05, duration: 0.5, ease }}
              >
                <Link
                  href={`/browse?category=${encodeURIComponent(cat)}`}
                  className="vspr-card vspr-card-featured home-category-card group block h-full p-6 md:p-7"
                >
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:text-white">
                    {categoryIcons[cat]}
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-base font-medium leading-tight">{cat}</span>
                    <ArrowRight size={14} className="text-muted transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── FEATURED LISTINGS ── */}
      <section className="py-20 md:py-28">
        <div className="container-vspr">
          <AnimatedSection>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="section-label">FEATURED</span>
                <h2 className="section-title-md mt-4">Recently Listed</h2>
              </div>
              <Link href="/browse" className="pill-btn pill-btn-outline pill-btn-sm">
                View All
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sampleListings.slice(0, 4).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28">
        <div className="container-vspr">
          <AnimatedSection>
            <span className="section-label">HOW IT WORKS</span>
            <h2 className="section-title-md mt-4 max-w-3xl">
              Three steps. Zero friction.
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { num: '01', title: 'List', desc: 'Snap a photo, set a price, and publish your listing in seconds.' },
              { num: '02', title: 'Connect', desc: 'Chat with buyers and sellers directly. All within your campus.' },
              { num: '03', title: 'Exchange', desc: 'Meet on campus, complete the deal, and leave a review.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                className="vspr-card flex flex-col gap-5 p-6 md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="section-label">Step {step.num}</span>
                  <span className="text-number-fade text-3xl font-bold tracking-[-0.06em]">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-secondary text-sm leading-7">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
