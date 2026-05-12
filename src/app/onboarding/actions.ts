"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const EMAIL_ALREADY_REGISTERED = "Email already registered";

function isDuplicateSignupError(err: {
  message?: string;
  code?: string;
  status?: number;
}): boolean {
  const code = err.code ?? "";
  if (
    code === "email_exists" ||
    code === "user_already_exists" ||
    code === "identity_already_exists"
  ) {
    return true;
  }
  const msg = (err.message ?? "").toLowerCase();
  return (
    msg.includes("user already registered") ||
    msg.includes("already registered") ||
    msg.includes("email address is already") ||
    msg.includes("email already") ||
    msg.includes("user already exists")
  );
}

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
    if (isDuplicateSignupError(authError)) {
      return { error: EMAIL_ALREADY_REGISTERED };
    }
    return { error: authError.message };
  }

  // Duplicate signup while "Confirm email" is on: GoTrue returns a stub user
  // with no identities and no session (see signUp() remarks in @supabase/auth-js).
  const stubDuplicateUser =
    !authData.session &&
    authData.user &&
    Array.isArray(authData.user.identities) &&
    authData.user.identities.length === 0;
  if (stubDuplicateUser) {
    return { error: EMAIL_ALREADY_REGISTERED };
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
