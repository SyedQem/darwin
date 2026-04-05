import { signIn, signUp } from "./actions";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/40">
          Darwin
        </p>
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-white/60">
          Sign in to buy, sell, and manage your listings.
        </p>
      </div>

      <form className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30"
        />

        <button
          type="submit"
          formAction={signIn}
          className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90"
        >
          Sign in
        </button>

        <button
          type="submit"
          formAction={signUp}
          className="w-full rounded-2xl border border-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/5"
        >
          Create account
        </button>
      </form>
    </div>
  );
}