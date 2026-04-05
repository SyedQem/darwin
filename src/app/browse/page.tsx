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
      <div className="container-vspr page-shell">
        <motion.section
          className="surface-panel mt-2 overflow-hidden p-5 sm:mt-4 sm:p-6 md:p-8"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <header>
              <span className="section-label">Browse</span>
              <h1 className="section-title-md mt-4 max-w-3xl">
                Find what you need without digging through chaos.
              </h1>
              <p className="page-hero-copy mt-5 max-w-2xl">
                Clean search, stronger imagery, and touch-friendly filters so the catalog feels good now and ports cleanly into an iOS or Android shell later.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Fresh today', value: `${sampleListings.length} new drops`, icon: <Sparkles size={16} /> },
                  { label: 'Around campus', value: '12 verified hubs', icon: <Compass size={16} /> },
                  { label: 'Fast handoff', value: 'Meetups nearby', icon: <ArrowUpRight size={16} /> },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="info-tile"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  >
                    <div className="ui-icon-label-tight text-muted text-xs uppercase tracking-[0.18em]">
                      {item.icon}
                      {item.label}
                    </div>
                    <p className="mt-3 text-lg font-semibold tracking-tight">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </header>

            <div className="vspr-card flex flex-col h-full rounded-[26px]">
              <div className="relative w-full h-[220px] sm:h-[260px] bg-elevated border-b border-white/5">
                <Image
                  src={heroListing.image}
                  alt={heroListing.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <p className="section-label mb-3">Highlighted listing</p>
                <h2 className="text-2xl font-semibold tracking-tight leading-snug">{heroListing.title}</h2>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="price-tag text-2xl">${heroListing.price}</span>
                  <span className="text-secondary text-sm flex items-center gap-2">
                    <span className={`condition-dot ${heroListing.condition === 'New' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    {heroListing.seller.campus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="browse-content-stack mt-6 md:mt-7">
          {/* Search + Filters */}
          <motion.section
            className="browse-search-shell surface-panel p-4 sm:p-5 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div className="grid gap-5">
              <div className="relative">
                <Search size={18} className="text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by item, course, brand, or keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="vspr-input pl-12"
                />
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-wrap gap-2.5">
                  {['All', ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCat(cat as Category | 'All')}
                      className={`filter-chip ${
                        selectedCat === cat
                          ? 'filter-chip-active'
                          : ''
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <p className="text-muted text-xs uppercase tracking-[0.18em]">
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

          {/* Results */}
          {filtered.length > 0 ? (
            <section
              aria-label="Results"
              className="browse-results-grid grid grid-cols-1 auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-10"
            >
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </section>
          ) : (
            <motion.section
              aria-label="No results"
              className="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-secondary text-xl font-medium">
                No listings match your search.
              </p>
              <p className="text-muted mt-2 text-sm">
                Try different keywords or clear your filters.
              </p>
            </motion.section>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="container-vspr page-shell">
        <span className="section-label">BROWSE</span>
        <h1 className="section-title-md mt-4">Find what you need.</h1>
        <p className="text-muted mt-4 text-sm">Loading...</p>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
