'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, DollarSign, Tag, ChevronRight } from 'lucide-react';
import { categories, Category } from '@/lib/data';

type Condition = 'New' | 'Like New' | 'Good' | 'Fair';

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
      <div className="container-vspr py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl md:text-5xl font-bold">Listed.</h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Your item is now live on Darwin.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a href="/browse" className="pill-btn" style={{ fontSize: '0.75rem', padding: '0.75rem 2rem' }}>View Listings</a>
            <button
              onClick={() => setSubmitted(false)}
              className="pill-btn pill-btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.75rem 2rem' }}
            >
              List Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-vspr py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">SELL</span>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">
          List your item.
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Fill in the details below and your listing will go live instantly.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-12 max-w-2xl space-y-6">
        {/* Photo upload area */}
        <motion.div
          className="vspr-card p-8 flex flex-col items-center justify-center gap-3 cursor-pointer"
          style={{ minHeight: '200px' }}
          whileHover={{ borderColor: 'var(--border-hover)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Camera size={32} style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Click to upload photos
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            PNG, JPG up to 10MB
          </p>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="section-label block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            className="vspr-input"
            required
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="section-label block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe condition, usage, defects, etc."
            className="vspr-input"
            rows={4}
            required
            style={{ resize: 'vertical' }}
          />
        </motion.div>

        {/* Price + Category row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div>
            <label className="section-label block mb-2">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="vspr-input"
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
              className="vspr-select"
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Condition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="section-label block mb-3">Condition</label>
          <div className="flex flex-wrap gap-3">
            {(['New', 'Like New', 'Good', 'Fair'] as Condition[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest border transition-all ${
                  condition === c
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600'
                }`}
                style={{ fontSize: '0.65rem' }}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <button type="submit" className="pill-btn w-full md:w-auto">
            Publish Listing
            <ChevronRight size={16} className="ml-2" />
          </button>
        </motion.div>
      </form>
    </div>
  );
}
