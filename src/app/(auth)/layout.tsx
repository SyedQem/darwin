import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="auth-shell text-white">
      <div className="auth-shell__backdrop" aria-hidden="true">
        <span className="auth-shell__orb" />
        <span className="auth-shell__grid" />
      </div>

      <div className="container-vspr auth-shell__container">
        <div className="auth-shell__layout">
          <section className="auth-shell__trust">
            <p className="section-label">Trusted marketplace</p>
            <h1 className="section-title-md mt-4">The New Way to Shop</h1>
            <p className="auth-shell__copy mt-5">
              Securely access your dashboard to manage listings, track saved
              items, and keep every conversation in one place.
            </p>

            <div className="auth-shell__stats mt-8">
              <div className="auth-shell__stat">
                <p className="auth-shell__stat-value">24/7</p>
                <p className="auth-shell__stat-label">Account protection</p>
              </div>
              <div className="auth-shell__stat">
                <p className="auth-shell__stat-value">99.9%</p>
                <p className="auth-shell__stat-label">Marketplace uptime</p>
              </div>
              <div className="auth-shell__stat">
                <p className="auth-shell__stat-value">One place</p>
                <p className="auth-shell__stat-label">Listings & activity</p>
              </div>
            </div>
          </section>

          <section className="auth-shell__panel surface-panel">{children}</section>
        </div>
      </div>
    </main>
  );
}
