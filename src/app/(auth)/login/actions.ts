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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const suffix = next ? `&next=${encodeURIComponent(next)}` : "";
    redirect(`/login?error=${encodeURIComponent(error.message)}${suffix}`);
  }

  redirect(next ?? "/browse");
}
