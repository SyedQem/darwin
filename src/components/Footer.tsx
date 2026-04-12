'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.26 3.4.96.1-.75.41-1.26.74-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.75.81 1.2 1.84 1.2 3.1 0 4.42-2.7 5.39-5.26 5.68.42.36.79 1.07.79 2.17v3.22c0 .31.21.67.8.56 4.56-1.52 7.85-5.83 7.85-10.9C23.5 5.74 18.27.5 12 .5z"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.834l4.713 6.231 5.443-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const socials = [
  { href: 'https://github.com', icon: <GithubIcon />, label: 'GitHub' },
  { href: 'https://x.com', icon: <XIcon />, label: 'X' },
  { href: 'https://instagram.com', icon: <InstagramIcon />, label: 'Instagram' },
];

export default function Footer() {
  const pathname = usePathname();
  const isWaitlist = pathname === '/waitlist';

  return (
    <footer className="footer-vspr">
      <div className="container-vspr">
        {/* CTA */}
        {!isWaitlist && (
          <div className="py-8 md:py-12">
            <motion.div
              className="footer-cta-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
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
                  <Link href="/sell" className="pill-btn group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Start Listing
                      <motion.span
                        className="inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        →
                      </motion.span>
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}

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
            {/* Social links */}
            <div className="footer-social-row mt-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex flex-wrap gap-4 md:justify-end">
              {!isWaitlist && ['Browse', 'Sell', 'Saved', 'About'].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="nav-link"
                >
                  {link}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="footer-back-to-top"
                aria-label="Back to top"
              >
                <ArrowUp size={12} />
                <span>Top</span>
              </button>
              <span className="vesper-badge">
                <span className="vesper-dot" />
                Built by Vesper Labs
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
