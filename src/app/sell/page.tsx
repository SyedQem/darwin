import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SellWizard from "@/components/SellWizard";
import SellFormFeedback from "@/components/SellFormFeedback";

const SCHOOL_CAMPUS: Record<string, string> = {
  carleton: "Carleton University",
  uottawa: "University of Ottawa",
  algonquin: "Algonquin College",
};

export default async function SellPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("school")
    .eq("id", data.user.id)
    .maybeSingle();

  const initialCampus = SCHOOL_CAMPUS[profile?.school ?? ""] ?? "";

  return (
    <>
      <Suspense>
        <SellFormFeedback />
      </Suspense>
      <SellWizard initialCampus={initialCampus} />
    </>
  );
}
