"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Only allow single-slash internal paths — no protocol-relative or absolute
// URLs — to prevent open-redirect via `?next=`.
function safeNext(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export async function signIn(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    const suffix = next ? `&next=${encodeURIComponent(next)}` : "";
    redirect(`/login?error=Email%20and%20password%20are%20required.${suffix}`);
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const suffix = next ? `&next=${encodeURIComponent(next)}` : "";
    redirect(`/login?error=${encodeURIComponent(error.message)}${suffix}`);
  }

  // Ensure user has a profile record (in case email verification skipped it)
  if (signInData?.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", signInData.user.id)
      .maybeSingle();

    if (!profile) {
      const metadata = signInData.user.user_metadata || {};
      const first_name = metadata.first_name || email.split("@")[0] || "User";
      const fullName = [metadata.first_name, metadata.last_name]
        .filter(Boolean)
        .join(" ") || first_name;

      await supabase.from("profiles").insert({
        id: signInData.user.id,
        username: email.split("@")[0] || `user_${signInData.user.id.substring(0, 8)}`,
        first_name,
        last_name: metadata.last_name || null,
        full_name: fullName,
        school: metadata.school || null,
        level_of_study: metadata.level_of_study || null,
        program: metadata.program || null,
        interests: metadata.interests || null,
      });
    }
  }

  redirect(next ?? "/browse");
}
