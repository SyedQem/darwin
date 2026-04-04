'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, ChevronRight } from 'lucide-react';
import { categories, Category, Condition } from '@/lib/data';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';

export default function SellPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [condition, setCondition] = useState<Condition | ''>('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="container-vspr page-shell text-center">
          <motion.div
            className="surface-panel mx-auto max-w-2xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="text-6xl mb-6 text-[#4ade80]"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              ✓
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold">Listed.</h1>
            <p className="text-secondary mt-4 text-lg">
              Your item is now live on Darwin.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/browse" className="pill-btn pill-btn-sm">View Listings</Link>
              <button
                onClick={() => setSubmitted(false)}
                className="pill-btn pill-btn-outline pill-btn-sm"
              >
                List Another
              </button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">SELL</span>
          <h1 className="section-title-md max-w-3xl">
            List your item.
          </h1>
          <p className="page-hero-copy max-w-2xl">
            Fill in the details below and your listing will go live instantly.
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="surface-panel mt-12 max-w-3xl space-y-6 p-5 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Photo upload area */}
          <motion.div
            className="surface-inset flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 p-8 border hover:border-[rgba(255,255,255,0.24)] transition-colors duration-300"
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.04)' }}
            whileTap={{ scale: 0.99 }}
          >
            <Camera size={32} className="text-muted" />
            <p className="text-secondary text-sm">
              Click to upload photos
            </p>
            <p className="text-muted text-xs">
              PNG, JPG up to 10MB
            </p>
          </motion.div>

          {/* Title */}
          <div>
            <label className="section-label block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              className="vspr-input focus:ring-1 focus:ring-[rgba(126,174,248,0.5)] transition-shadow duration-200"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="section-label block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, usage, defects, etc."
              className="vspr-input resize-y focus:ring-1 focus:ring-[rgba(126,174,248,0.5)] transition-shadow duration-200"
              rows={4}
              required
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="section-label block mb-2">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="vspr-input focus:ring-1 focus:ring-[rgba(126,174,248,0.5)] transition-shadow duration-200"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="section-label block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="vspr-select focus:ring-1 focus:ring-[rgba(126,174,248,0.5)] transition-shadow duration-200"
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="section-label block mb-3">Condition</label>
            <div className="flex flex-wrap gap-3">
              {(['New', 'Like New', 'Good', 'Fair'] as Condition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`filter-chip transition-all duration-200 ${
                    condition === c
                      ? 'filter-chip-active scale-105 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                      : 'hover:scale-105'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button type="submit" className="pill-btn w-full md:w-auto overflow-hidden group relative">
              <span className="relative z-10 flex items-center justify-center w-full">
                Publish Listing
                <ChevronRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </motion.form>
      </div>
    </PageTransition>
  );
}
