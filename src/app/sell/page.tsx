import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createListing } from "./actions";
import { categories } from "@/lib/data";
import { PackagePlus } from "lucide-react";

export default async function SellPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <main className="sell-page-wrap">
      {/* Background visuals */}
      <div className="sell-bg-glow sell-bg-glow--purple" />
      <div className="sell-bg-glow sell-bg-glow--blue" />
      <div className="sell-bg-grid" />

      {/* Decorative streaks */}
      <div className="sell-streak sell-streak--left" />
      <div className="sell-streak sell-streak--right" />
      <div className="sell-streak sell-streak--left-thin" />
      <div className="sell-streak sell-streak--right-thin" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Header */}
        <div className="mb-10">
          <span className="section-label">SELL</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
            Create Listing
          </h1>
          <p className="text-secondary text-[15px] mt-2">
            Add an item to the Darwin marketplace.
          </p>
        </div>

        {/* Form card */}
        <div className="sell-form-card">
          <form action={createListing} className="space-y-7">
            {/* Title */}
            <div className="sell-field">
              <label htmlFor="title" className="sell-label">
                Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="e.g. Organic Chemistry Textbook (8th Ed)"
                required
                className="vspr-input"
              />
            </div>

            {/* Description */}
            <div className="sell-field">
              <label htmlFor="description" className="sell-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the condition, what's included, and any details buyers should know..."
                rows={4}
                className="vspr-input resize-none"
              />
            </div>

            {/* Price + Condition row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sell-field">
                <label htmlFor="price" className="sell-label">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">
                    $
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                    className="vspr-input pl-8 font-mono"
                  />
                </div>
              </div>

              <div className="sell-field">
                <label htmlFor="condition" className="sell-label">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  className="vspr-select"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select condition
                  </option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Category + Campus row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sell-field">
                <label htmlFor="category" className="sell-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="vspr-select"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sell-field">
                <label htmlFor="campus" className="sell-label">
                  Campus
                </label>
                <input
                  id="campus"
                  name="campus"
                  placeholder="e.g. Main Campus"
                  className="vspr-input"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Submit */}
            <button
              type="submit"
              className="pill-btn ui-icon-label w-full min-h-12 text-base"
            >
              <PackagePlus size={18} />
              <span>Publish Listing</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
