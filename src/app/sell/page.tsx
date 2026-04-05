import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createListing } from "./actions";

export default async function SellPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-white">
      <h1 className="text-3xl font-semibold">Create Listing</h1>
      <p className="mt-2 text-white/60">Add an item to Darwin.</p>

      <form action={createListing} className="mt-8 space-y-4">
        <input
          name="title"
          placeholder="Title"
          required
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="min-h-32 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3"
        />
        <input
          name="category"
          placeholder="Category"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3"
        />
        <input
          name="campus"
          placeholder="Campus"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3"
        />

        <button className="rounded-xl bg-white px-5 py-3 font-medium text-black">
          Publish Listing
        </button>
      </form>
    </main>
  );
}