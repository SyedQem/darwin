"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login");
}

export async function signIn(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user;
  if (user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      username: email.split("@")[0],
      full_name: null,
      school: null,
    });

    if (profileError) {
      throw new Error(profileError.message);
    }
  }

  redirect("/browse");
}