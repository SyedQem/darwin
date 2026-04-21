'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';


const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.834l4.713 6.231 5.443-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
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
  { href: 'https://x.com/VesperWorks_', icon: <XIcon />, label: 'X' },
  { href: 'https://instagram.com/vesperworks_', icon: <InstagramIcon />, label: 'Instagram' },
];

export default function Footer() {
  const pathname = usePathname();
  const isWaitlist = pathname === '/waitlist' || pathname.startsWith('/whitelist');

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
                Built by Vesper Works
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
