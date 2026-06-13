import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SellWizard, { type InitialListingData } from "@/components/SellWizard";

const SCHOOL_CAMPUS: Record<string, string> = {
  carleton: "Carleton University",
  uottawa: "University of Ottawa",
  algonquin: "Algonquin College",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      "id, user_id, title, description, price, category, condition, campus, image_url, image_urls",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !listing || listing.user_id !== user.id) {
    redirect(`/listing/${id}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("school")
    .eq("id", user.id)
    .maybeSingle();

  const profileCampus = SCHOOL_CAMPUS[profile?.school ?? ""] ?? "";
  const imageUrls =
    Array.isArray(listing.image_urls) && listing.image_urls.length > 0
      ? listing.image_urls
      : listing.image_url
        ? [listing.image_url]
        : [];

  const initialData: InitialListingData = {
    title: listing.title,
    price: listing.price,
    imageUrls,
    condition: listing.condition ?? "",
    category: listing.category ?? "",
    description: listing.description ?? "",
    campus: listing.campus ?? profileCampus,
  };

  return (
    <>
      <div className="container-vspr pt-8">
        <Link
          href={`/listing/${id}`}
          className="text-muted inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to listing
        </Link>
      </div>
      <SellWizard
        mode="edit"
        listingId={id}
        initialCampus={profileCampus}
        initialData={initialData}
      />
    </>
  );
}
