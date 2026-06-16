"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const EMAIL_ALREADY_REGISTERED = "Email already registered";

/** Approved domains keyed by school ID */
const SCHOOL_EMAIL_DOMAINS: Record<string, string> = {
  carleton: "cmail.carleton.ca",
  uottawa: "uottawa.ca",
  algonquin: "algonquinlive.com",
};

/** Human-readable school names for error messages */
const SCHOOL_NAMES: Record<string, string> = {
  carleton: "Carleton University",
  uottawa: "University of Ottawa",
  algonquin: "Algonquin College",
};

/**
 * Returns true when the email's domain exactly matches the required domain
 * for the given school ID.
 */
function emailMatchesSchool(email: string, schoolId: string): boolean {
  const domain = SCHOOL_EMAIL_DOMAINS[schoolId];
  if (!domain) return false;
  return email.trim().toLowerCase().endsWith("@" + domain);
}

// Only allow single-slash internal paths — no protocol-relative or absolute
// URLs — to prevent open-redirect via `?next=`.
function safeNext(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

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
  purchaseEmail?: string;
  magicCode?: string;
  next?: string;
}

export async function createAccountAndProfile(data: OnboardingData) {
  const supabase = await createClient();

  // ── Institution / email domain guard ─────────────────────────────────────
  const requiredDomain = SCHOOL_EMAIL_DOMAINS[data.university];
  if (!requiredDomain) {
    return { error: "Please select a valid institution." };
  }
  if (!emailMatchesSchool(data.email, data.university)) {
    const schoolName = SCHOOL_NAMES[data.university] ?? data.university;
    return {
      error: `The email address does not match the selected institution. ${schoolName} requires a @${requiredDomain} email address.`,
    };
  }
  // ─────────────────────────────────────────────────────────────────────────

  if (data.magicCode && data.purchaseEmail) {
    const { data: isValid, error: rpcError } = await supabase.rpc("redeem_magic_code", {
      p_email: data.purchaseEmail,
      p_code: data.magicCode,
    });

    if (rpcError || !isValid) {
      return { error: "Invalid or already used magic code" };
    }
  }

  const fullName = [data.firstName, data.lastName]
    .filter(Boolean)
    .join(" ");

  // 1. Create the Supabase auth account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName || null,
        full_name: fullName,
        school: data.university || null,
        level_of_study: data.levelOfStudy || null,
        program: data.program || null,
        interests: data.interests.length > 0 ? data.interests : null,
      },
    },
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

  redirect(safeNext(data.next) ?? "/browse");
}
