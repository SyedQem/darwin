import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingWizard from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Welcome to Darwin — Set Up Your Profile",
  description:
    "Set up your campus marketplace profile to start buying and selling.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <OnboardingWizard />;
}
