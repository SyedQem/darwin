"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // If user has an active session (email verification disabled), go straight
  // to onboarding. Otherwise prompt them to verify their email first.
  if (data.session) {
    redirect("/onboarding");
  }

  redirect("/login?message=Check%20your%20email%20to%20finish%20signing%20up.");
}

export async function signIn(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const user = data.user;
  if (user) {
    // Check whether the user has completed onboarding (first_name set)
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      // First-time sign-in — create a minimal profile row then onboard
      await supabase.from("profiles").insert({
        id: user.id,
        username: email.split("@")[0],
      });
      redirect("/onboarding");
    }

    if (!profile.first_name) {
      redirect("/onboarding");
    }
  }

  redirect("/browse");
}
