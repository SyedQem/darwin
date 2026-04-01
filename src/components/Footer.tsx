'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-vspr">
      <div className="container-vspr">
        {/* CTA */}
        <div className="py-16 md:py-24">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Have something to sell?
          </h2>
          <p className="text-3xl md:text-5xl font-bold leading-tight" style={{ color: 'var(--text-muted)' }}>
            List it now.
          </p>
          <div className="mt-8">
            <Link href="/sell" className="pill-btn">
              Start Listing
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 pb-4">
          <div>
            <p className="font-bold text-sm tracking-tight">
              darwin<span style={{ color: 'var(--text-muted)' }}>.</span>
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Campus marketplace for students.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="vesper-badge">
              <span className="vesper-dot" />
              Built by Vesper Labs
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {['Browse', 'Sell', 'Saved', 'About'].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', letterSpacing: '0.15em' }}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
