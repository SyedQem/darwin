"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface OnboardingData {
  firstName: string;
  lastName: string;
  university: string;
  levelOfStudy: string;
  program: string;
  interests: string[];
}

export async function saveOnboardingProfile(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    first_name: data.firstName,
    last_name: data.lastName || null,
    full_name: fullName,
    school: data.university || null,
    level_of_study: data.levelOfStudy || null,
    program: data.program || null,
    interests: data.interests.length > 0 ? data.interests : null,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/browse");
}
