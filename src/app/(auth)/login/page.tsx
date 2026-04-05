import { signIn, signUp } from "./actions";

export default function LoginPage() {
  return (
    <div className="surface-panel browse-hero-panel w-full max-w-md p-5 md:p-6">
      <div className="mb-8 space-y-3">
        <p className="section-label">Darwin</p>
        <h1 className="section-title-md max-w-none">Welcome back</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Sign in to buy, sell, and manage your listings.
        </p>
      </div>

      <form className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="vspr-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="vspr-input"
        />

        <button type="submit" formAction={signIn} className="pill-btn w-full">
          Sign in
        </button>

        <button
          type="submit"
          formAction={signUp}
          className="pill-btn pill-btn-outline w-full"
        >
          Create account
        </button>
      </form>
    </div>
  );
}
