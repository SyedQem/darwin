'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-vspr">
      <div className="container-vspr">
        {/* CTA */}
        <div className="py-8 md:py-12">
          <div className="footer-cta-panel">
            <div className="footer-grid">
              <div>
                <span className="section-label">START SELLING</span>
                <h2 className="section-title-md mt-4 max-w-2xl">
                  Ready to turn unused stuff into cash?
                </h2>
                <p className="text-secondary mt-5 max-w-xl text-base leading-8">
                  Publish a listing in minutes and keep every exchange inside the campus community.
                </p>
              </div>

              <div className="md:justify-self-end">
                <Link href="/sell" className="pill-btn">
                  Start Listing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-8 pt-6 pb-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-base font-bold tracking-tight">
              darwin<span className="logo-dot">.</span>
            </p>
            <p className="text-muted mt-2 max-w-sm text-sm leading-6">
              Campus marketplace for students.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex flex-wrap gap-4 md:justify-end">
              {['Browse', 'Sell', 'Saved', 'About'].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="nav-link"
                >
                  {link}
                </Link>
              ))}
            </div>

            <span className="vesper-badge">
              <span className="vesper-dot" />
              Built by Vesper Labs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
