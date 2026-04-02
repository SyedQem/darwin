'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Search } from 'lucide-react';
import { categories, categoryIcons, sampleListings } from '@/lib/data';
import ListingCard from '@/components/ListingCard';

export default function HomePage() {
  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="home-hero relative flex flex-col justify-center">
        <div className="container-vspr">
          <div className="home-hero-grid">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="section-label home-eyebrow">01 // CAMPUS MARKETPLACE</span>
              </motion.div>

              <motion.h1
                className="home-headline mt-8 font-bold"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Buy what you need.
                <br />
                <span className="text-primary">Sell what you don&apos;t.</span>
              </motion.h1>

              <motion.p
                className="home-subhead mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                A campus marketplace with clearer listings, safer meetups, and a cleaner feed designed to feel effortless on mobile and desktop.
              </motion.p>

              <motion.div
                className="home-cta-row mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link href="/browse" className="pill-btn ui-icon-label">
                  <Search size={16} />
                  <span>Browse Listings</span>
                </Link>
                <Link href="/sell" className="pill-btn pill-btn-outline home-secondary-btn">
                  Start Selling
                </Link>
              </motion.div>

              <motion.div
                className="home-proof-row mt-16"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.95 }}
              >
                {[
                  { label: 'Verified students', value: '12 campuses' },
                  { label: 'Fast-moving listings', value: '< 10 min avg.' },
                  { label: 'Mobile-ready flow', value: 'iOS + Android safe' },
                ].map((item) => (
                  <div key={item.label} className="home-proof">
                    <div className="home-proof-label">{item.label}</div>
                    <p className="home-proof-value">{item.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="home-showcase"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.5 }}
            >
              <div className="home-showcase-grid">
                <div className="media-frame min-h-[320px] sm:min-h-[520px]">
                  <Image
                    src={sampleListings[1].image}
                    alt={sampleListings[1].title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="media-overlay-lg">
                    <p className="section-label home-eyebrow">Featured listing</p>
                    <p className="home-card-title mt-2">{sampleListings[1].title}</p>
                    <div className="home-product-meta">
                      <span className="home-price-pill">${sampleListings[1].price}</span>
                      <span className="home-meta-text">{sampleListings[1].seller.campus}</span>
                      <span className="home-meta-text">{sampleListings[1].condition}</span>
                    </div>
                  </div>
                </div>

                <div className="home-showcase-stack">
                  {[sampleListings[0], sampleListings[2]].map((listing) => (
                    <div key={listing.id} className="home-showcase-card media-frame min-h-[190px]">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 22vw"
                        className="object-cover"
                      />
                      <div className="media-overlay">
                        <p className="home-card-title-sm">{listing.title}</p>
                        <div className="home-product-meta">
                          <span className="home-price-pill">${listing.price}</span>
                          <span className="home-meta-text">{listing.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="home-showcase-metric">
                    <p className="section-label home-eyebrow">Live right now</p>
                    <div className="home-showcase-metric-row mt-4">
                      <div>
                        <p className="text-4xl font-semibold tracking-[-0.06em]">184</p>
                        <p className="text-secondary mt-1 text-sm">
                          active listings near you
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-semibold tracking-[-0.06em]">4.9</p>
                        <p className="text-secondary mt-1 text-sm">
                          average seller rating
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="scroll-indicator mt-14 hidden sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span className="scroll-line" />
            Scroll to explore
            <ArrowDown size={12} />
          </motion.div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── CATEGORIES ── */}
      <section className="py-24 md:py-32">
        <div className="container-vspr">
          <span className="section-label">02 // CATEGORIES</span>
          <h2 className="section-title-md mt-4 max-w-3xl">
            What are you looking for?
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/browse?category=${encodeURIComponent(cat)}`}
                  className="vspr-card vspr-card-featured block h-full p-6 md:p-7"
                >
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-white">
                    {categoryIcons[cat]}
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <span className="max-w-[12rem] text-base font-medium leading-6">{cat}</span>
                    <ArrowRight size={16} className="text-muted" />
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
      <section className="py-24 md:py-32">
        <div className="container-vspr">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <span className="section-label">03 // FEATURED</span>
              <h2 className="section-title-md mt-4">
                Recently Listed
              </h2>
            </div>
            <Link href="/browse" className="pill-btn pill-btn-outline pill-btn-sm">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sampleListings.slice(0, 4).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── VISUAL SHOWCASE ── */}
      <section className="py-24 md:py-32">
        <div className="container-vspr">
          <div className="mb-12 flex flex-col gap-5 lg:max-w-3xl">
            <span className="section-label">04 // INSIDE THE FEED</span>
            <h2 className="section-title-md">
              Visual listings that still feel clean on a phone.
            </h2>
            <p className="section-copy max-w-2xl">
              Every tile is built to compress well on smaller screens: clear imagery, restrained labels, and enough breathing room that the feed still feels premium in a native app shell.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-panel p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[sampleListings[3], sampleListings[4]].map((listing) => (
                  <div key={listing.id} className="media-frame min-h-[220px] sm:min-h-[300px]">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      className="object-cover"
                    />
                    <div className="media-overlay">
                      <p className="text-lg font-semibold tracking-tight">{listing.title}</p>
                      <p className="text-muted mt-1 text-xs uppercase tracking-[0.18em]">
                        ${listing.price} • {listing.seller.campus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-4">
              <div className="media-frame min-h-[340px] sm:min-h-[420px]">
                <Image
                  src={sampleListings[6].image}
                  alt={sampleListings[6].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span className="category-badge">Most Shared</span>
                    <span className="section-label text-bright-muted">Academic</span>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{sampleListings[6].title}</p>
                    <p className="text-soft-white mt-3 max-w-sm text-sm leading-7">
                      Better visuals, calmer typography, and touch-friendly spacing carry directly into a mobile app without redesigning every surface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container-vspr"><div className="divider" /></div>

      {/* ── HOW IT WORKS ── */}
      <section className="relative py-24 md:py-32">
        <div className="container-vspr">
          <span className="section-label">05 // HOW IT WORKS</span>
          <h2 className="section-title-md mt-4 max-w-3xl">
            Three steps. Zero friction.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { num: '01', title: 'List', desc: 'Snap a photo, set a price, and publish your listing in seconds.' },
              { num: '02', title: 'Connect', desc: 'Chat with buyers and sellers directly. All within your campus.' },
              { num: '03', title: 'Exchange', desc: 'Meet on campus, complete the deal, and leave a review.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="vspr-card flex flex-col gap-5 p-7 md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="section-label text-muted">
                    Step {step.num}
                  </span>
                  <span className="text-number-fade text-3xl font-semibold tracking-[-0.08em]">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-secondary text-sm leading-7">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
