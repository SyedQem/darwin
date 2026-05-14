"use client";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "./actions";

function AuthActionButton({
  children,
  formAction,
}: {
  children: string;
  formAction: (formData: FormData) => void | Promise<void>;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={formAction}
      className="pill-btn w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Working\u2026" : children}
    </button>
  );
}

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const authMessage = useMemo(
    () => searchParams.get("error") ?? searchParams.get("message") ?? "",
    [searchParams],
  );

  const hasError = Boolean(searchParams.get("error"));
  const next = searchParams.get("next") ?? "";

  return (
    <div className="surface-panel browse-hero-panel w-full max-w-md p-5 md:p-6">
      <div className="mb-8 space-y-3">
        <p className="section-label">Darwin</p>
        <h1 className="section-title-md max-w-none">Welcome back</h1>
        <p className="text-sm text-secondary">
          Sign in to buy, sell, and manage your listings.
        </p>
      </div>

      <form className="space-y-4" noValidate>
        {next && <input type="hidden" name="next" value={next} />}
        <div className="auth-form-field">
          <label htmlFor="login-email" className="auth-form-label">
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="name@school.edu"
            autoComplete="email"
            required
            className="vspr-input auth-form-input"
          />
          <p className="auth-form-helper text-secondary">Use your campus or marketplace email.</p>
        </div>

        <div className="auth-form-field">
          <label htmlFor="login-password" className="auth-form-label">
            Password
          </label>
          <div className="auth-password-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="vspr-input auth-form-input auth-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="auth-form-helper text-muted">At least 8 characters with a mix of letters and numbers.</p>
        </div>

        <p
          className={`auth-status ${hasError ? "auth-status-error" : "auth-status-muted"}`}
          aria-live="polite"
          role="status"
        >
          {authMessage || "\u00A0"}
        </p>

        <AuthActionButton formAction={signIn}>
          Sign in
        </AuthActionButton>
      </form>

      <div className="auth-alt-action" aria-hidden="true" />
      <p className="auth-alt-copy text-secondary">
        New here?{" "}
        <Link
          href={next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding"}
          className="auth-alt-link"
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="surface-panel browse-hero-panel w-full max-w-md p-5 md:p-6">
          <div className="mb-8 space-y-3">
            <p className="section-label">Darwin</p>
            <h1 className="section-title-md max-w-none">Welcome back</h1>
            <p className="text-sm text-secondary">
              Sign in to buy, sell, and manage your listings.
            </p>
          </div>
          <p className="auth-status auth-status-muted" aria-live="polite" role="status">
            Loading...
          </p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
