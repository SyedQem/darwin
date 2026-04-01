'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { sampleListings, categories, Category } from '@/lib/data';
import ListingCard from '@/components/ListingCard';

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

  return (
    <div className="container-vspr py-12 md:py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">BROWSE</span>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">
          Find what you need.
        </h1>
      </motion.div>

      {/* Search + Filters */}
      <div className="mt-10 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search listings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="vspr-input pl-12"
          />
        </div>

        {/* Category pills + Sort */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat as Category | 'All')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all border ${
                  selectedCat === cat
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600'
                }`}
                style={{ fontSize: '0.65rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="vspr-select"
            style={{ maxWidth: '200px' }}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>
              No listings match your search.
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Try different keywords or clear your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="container-vspr py-12 md:py-20">
        <span className="section-label">BROWSE</span>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">Find what you need.</h1>
        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
