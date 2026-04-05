'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Compass, Sparkles, ArrowUpRight } from 'lucide-react';
import { sampleListings, categories, Category } from '@/lib/data';
import ListingCard from '@/components/ListingCard';
import PageTransition from '@/components/PageTransition';

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') as Category | null;

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category | 'All'>(initialCat || 'All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  const filtered = useMemo(() => {
    let results = [...sampleListings];

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }

    if (selectedCat !== 'All') {
      results = results.filter((l) => l.category === selectedCat);
    }

    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }, [query, selectedCat, sortBy]);

  const heroListing = filtered[0] ?? sampleListings[1];

  return (
    <PageTransition>
      <div className="container-vspr pt-28 pb-12 sm:pt-32 md:pt-40 md:pb-20">
        
        {/* Search + Filters (Now higher than results & hero) */}
        <motion.section
          className="surface-panel mb-10 p-4 sm:p-6 md:p-8 relative z-20"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid gap-6">
            <div className="relative">
              <Search size={20} className="text-muted absolute left-5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by item, course, brand, or keyword"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="vspr-input pl-14 text-lg py-5 h-14"
              />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-2.5">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat as Category | 'All')}
                    className={`filter-chip ${
                      selectedCat === cat ? 'filter-chip-active' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-3 lg:mt-0">
                <p className="text-muted text-xs uppercase tracking-[0.18em] mr-2">
                  {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="vspr-select min-w-[200px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                </select>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Highlighted Section (Moved down) */}
        <motion.section
          className="surface-panel overflow-hidden p-5 sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
            <div className="flex flex-col justify-center">
              <span className="section-label">Browse</span>
              <h1 className="section-title-md mt-4 max-w-3xl leading-[1.05]">
                Find what you need without digging through chaos.
              </h1>
              <p className="page-hero-copy mt-5 max-w-2xl text-[1.05rem]">
                Clean search, stronger imagery, and touch-friendly filters so the catalog feels good now and ports cleanly into an iOS or Android shell later.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Fresh today', value: `${sampleListings.length} new drops`, icon: <Sparkles size={16} /> },
                  { label: 'Around campus', value: '12 verified hubs', icon: <Compass size={16} /> },
                  { label: 'Fast handoff', value: 'Meetups nearby', icon: <ArrowUpRight size={16} /> },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="info-tile pt-4 pb-5 px-5"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  >
                    <div className="ui-icon-label-tight text-muted text-[0.7rem] uppercase tracking-[0.15em] mb-3">
                      {item.icon}
                      {item.label}
                    </div>
                    <p className="text-lg font-bold tracking-tight text-white/95">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Highlighted Listing Card */}
            <div className="vspr-card flex flex-col h-full rounded-[26px]">
              <div className="relative w-full h-[220px] sm:h-[280px] bg-elevated border-b border-white/5">
                <Image
                  src={heroListing.image}
                  alt={heroListing.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7 md:p-8 flex-1 flex flex-col justify-center bg-card">
                <p className="section-label mb-3 text-[0.7rem]">Highlighted listing</p>
                <h2 className="text-[1.35rem] font-bold tracking-tight leading-[1.2]">{heroListing.title}</h2>
                <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/5">
                  <span className="price-tag text-[1.4rem]">${heroListing.price}</span>
                  <span className="text-secondary text-[0.85rem] flex items-center gap-2">
                    <span className={`condition-dot ${heroListing.condition === 'New' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    {heroListing.seller.campus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Results */}
        <div className="mt-16 md:mt-20">
          {filtered.length > 0 ? (
            <div className="browse-results-grid grid grid-cols-1 auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-10 xl:gap-12">
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} variant="browse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="empty-state py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-secondary text-[1.1rem] font-medium">
                No listings match your search.
              </p>
              <p className="text-muted mt-3 text-[0.9rem]">
                Try different keywords or clear your filters.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="container-vspr pt-28 pb-12 sm:pt-32 md:pt-40 md:pb-20">
        <span className="section-label">BROWSE</span>
        <h1 className="section-title-md mt-4">Find what you need.</h1>
        <p className="text-muted mt-4 text-sm">Loading...</p>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
