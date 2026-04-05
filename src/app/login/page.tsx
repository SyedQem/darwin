import { signIn, signUp } from "./actions";

export default function LoginPage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h1 className="mb-2 text-2xl font-semibold text-white">Welcome back</h1>
                <p className="mb-6 text-sm text-white/60">
                    Sign in to buy, sell, and manage your listings.
                </p>

                <form className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                    />

                    <button
                        type="submit"
                        formAction={signIn}
                        className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black"
                    >
                        Sign in
                    </button>

                    <button
                        type="submit"
                        formAction={signUp}
                        className="w-full rounded-xl border border-white/10 px-4 py-3 font-medium text-white"
                    >
                        Create account
                    </button>
                </form>
            </div>
        </main>
    );
}