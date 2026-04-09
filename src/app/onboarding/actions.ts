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
  email: string;
  password: string;
}

export async function createAccountAndProfile(data: OnboardingData) {
  const supabase = await createClient();

  // 1. Create the Supabase auth account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // 2. If email verification is required, there's no session yet
  if (!authData.session) {
    return {
      error:
        "Check your email to verify your account, then sign in to complete setup.",
      needsVerification: true,
    };
  }

  // 3. Session exists — save the profile
  const user = authData.user;
  if (user) {
    const fullName = [data.firstName, data.lastName]
      .filter(Boolean)
      .join(" ");

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      username: data.email.split("@")[0],
      first_name: data.firstName,
      last_name: data.lastName || null,
      full_name: fullName,
      school: data.university || null,
      level_of_study: data.levelOfStudy || null,
      program: data.program || null,
      interests: data.interests.length > 0 ? data.interests : null,
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  redirect("/browse");
}
