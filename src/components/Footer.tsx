'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="footer-vspr">
      <div className="container-vspr">
        {/* CTA */}
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
