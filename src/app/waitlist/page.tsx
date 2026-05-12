'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShieldCheck, MapPin, Zap, ArrowRight, CheckCircle2, Users, Clock, Star, Sparkles } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const features = [
  {
    icon: <ShieldCheck size={22} />,
    label: 'Verified Students Only',
    desc: 'Sign up with your university email. Every buyer and seller is a real, verified student from your campus.',
  },
  {
    icon: <MapPin size={22} />,
    label: 'Campus-Only Listings',
    desc: 'Browse items from students at your school. No strangers, no shipping — just local, safe exchanges.',
  },
  {
    icon: <Zap size={22} />,
    label: 'Fast & Frictionless',
    desc: 'List in seconds, connect instantly. Darwin is built for students — not for navigating bloated interfaces.',
  },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const isInvalid = email.length > 0 && !EMAIL_REGEX.test(email);
  const hasError = status === 'error' || isInvalid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!EMAIL_REGEX.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.ok) {
        setStatus('success');
        return;
      }

      if (res.status === 409) {
        setStatus('already');
        return;
      }

      setErrorMsg(
        typeof data.error === 'string' && data.error
          ? data.error
          : 'Something went wrong. Please try again.',
      );
      setStatus('error');
    } catch {
      setErrorMsg('Network error. Check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <div className="waitlist-page">
      {/* ── HERO ── */}
      <section ref={heroRef} className="waitlist-hero">
        {/* Background orb + grid */}
        <div className="waitlist-backdrop" aria-hidden="true">
          <motion.div className="waitlist-orb" style={{ y: orbY }} />
          <div className="waitlist-grid" />
        </div>

        <div className="container-vspr relative z-10">
          <div className="waitlist-hero-inner -mt-10 sm:-mt-16">
            {/* Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="waitlist-kicker"
            >
              <span className="waitlist-kicker-dot" />
              Good things take time
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="waitlist-headline"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease }}
            >
              Your campus.
              <br />
              <span className="text-muted">Your marketplace.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="waitlist-subhead"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease }}
            >
              Darwin is a campus-only marketplace where verified students buy, sell, and exchange — safely and locally. Join the waitlist to get early access.
            </motion.p>

            {/* Email form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58, ease }}
              className="waitlist-form-wrap"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    className="waitlist-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <CheckCircle2 size={20} className="waitlist-success-icon" />
                    <div>
                      <p className="waitlist-success-title">You&apos;re on the list!</p>
                      <p className="waitlist-success-sub">We&apos;ll reach out when darwin opens at your campus.</p>
                    </div>
                  </motion.div>
                ) : status === 'already' ? (
                  <motion.div
                    key="already"
                    className="waitlist-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <CheckCircle2 size={20} className="waitlist-success-icon" />
                    <div>
                      <p className="waitlist-success-title">You&apos;re already on the list!</p>
                      <p className="waitlist-success-sub">We already have your email — we&apos;ll be in touch when darwin launches.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="waitlist-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    noValidate
                  >
                    <div className="waitlist-input-wrap">
                      <input
                        id="waitlist-email"
                        type="email"
                        placeholder="Email goes here"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        className={`waitlist-input${hasError ? ' waitlist-input-error' : ''}`}
                        autoComplete="email"
                        disabled={status === 'loading'}
                        aria-label="University email address"
                      />
                      <button
                        id="waitlist-submit"
                        type="submit"
                        className="pill-btn waitlist-submit-btn"
                        disabled={status === 'loading'}
                        aria-label="Join waitlist"
                      >
                        {status === 'loading' ? (
                          <span className="waitlist-spinner" aria-hidden="true" />
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                    {status === 'error' && (
                      <motion.p
                        className="waitlist-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                    <p className="waitlist-helper">
                      Use your preferred <span className="waitlist-helper-accent">email</span> for early access.
                    </p>
                    <motion.div
                      className="mt-20 text-left"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <button type="button" onClick={() => document.getElementById('founding-access')?.scrollIntoView({ behavior: 'smooth' })} className="text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors">
                        Want benefits with early access? <span className="text-white underline decoration-white/20 underline-offset-4">See Founding Tiers &rarr;</span>
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>


          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="waitlist-features-section">
        <div className="container-vspr">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease }}
            className="waitlist-features-header"
          >
            <span className="section-label">WHY DARWIN</span>
            <h2 className="section-title-md mt-4">
              A marketplace built<br /><span className="text-muted">for campus life.</span>
            </h2>
          </motion.div>

          <div className="waitlist-features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                className="waitlist-feature-card vspr-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.55, ease }}
              >
                <div className="waitlist-feature-icon-wrap">
                  {f.icon}
                </div>
                <h3 className="waitlist-feature-title">{f.label}</h3>
                <p className="waitlist-feature-desc text-secondary">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDING ACCESS (→ /whitelist) ── */}
      <section id="founding-access" className="waitlist-founding-section scroll-mt-24">
        <div className="container-vspr">
          <motion.div
            className="waitlist-founding-panel"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="waitlist-founding-grid" aria-hidden="true" />
            <div className="waitlist-founding-glow" aria-hidden="true" />
            <div className="waitlist-founding-ornament" aria-hidden="true">
              <div className="waitlist-founding-ornament-ring" />
              <div className="waitlist-founding-ornament-ring waitlist-founding-ornament-ring--outer" />
              <Sparkles size={40} className="waitlist-founding-ornament-icon" strokeWidth={1.5} />
            </div>

            <div className="waitlist-founding-content">
              <span className="waitlist-kicker waitlist-founding-kicker">
                <span className="waitlist-kicker-dot" aria-hidden="true" />
                Founding Access
              </span>
              <h2 className="waitlist-founding-title">
                Can&apos;t wait?
                <br />
                <span className="text-muted">Lock in forever.</span>
              </h2>
              <p className="waitlist-founding-copy">
                One payment, monthly boosted listings for life — limited to 225 pre-launch spots across two tiers.
              </p>

              <div className="waitlist-founding-stats">
                <div className="waitlist-founding-stat">
                  <span className="waitlist-founding-stat-value">From $9</span>
                  <span className="waitlist-founding-stat-label">One-time</span>
                </div>
                <span className="waitlist-founding-stat-sep" aria-hidden="true" />
                <div className="waitlist-founding-stat">
                  <span className="waitlist-founding-stat-value">225</span>
                  <span className="waitlist-founding-stat-label">Total spots</span>
                </div>
                <span className="waitlist-founding-stat-sep" aria-hidden="true" />
                <div className="waitlist-founding-stat">
                  <span className="waitlist-founding-stat-value">Forever</span>
                  <span className="waitlist-founding-stat-label">No renewals</span>
                </div>
              </div>
            </div>

            <Link href="/whitelist" className="pill-btn waitlist-founding-cta">
              View Founding Tiers
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="waitlist-how-section">
        <div className="container-vspr">
          <div className="divider" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease }}
            className="waitlist-features-header"
          >
            <span className="section-label">HOW IT WORKS</span>
            <h2 className="section-title-md mt-4">
              Three steps.<br /><span className="text-muted">Zero friction.</span>
            </h2>
          </motion.div>

          <div className="waitlist-steps-grid">
            {[
              { num: '01', title: 'Verify', desc: 'Sign up with your university email. Darwin confirms you\'re a real student at a supported campus.' },
              { num: '02', title: 'List or Browse', desc: 'Snap a photo and post your listing in seconds, or search what\'s available near you on campus.' },
              { num: '03', title: 'Exchange', desc: 'Agree on a campus meetup spot, complete the handoff, and leave a review. Simple and safe.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="vspr-card waitlist-step-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
              >
                <div className="waitlist-step-num-row">
                  <span className="section-label">Step {step.num}</span>
                  <span className="text-number-fade waitlist-step-num-bg">{step.num}</span>
                </div>
                <h3 className="waitlist-step-title">{step.title}</h3>
                <p className="text-secondary waitlist-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="waitlist-bottom-cta-section">
        <div className="container-vspr">
          <motion.div
            className="waitlist-bottom-cta-panel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="waitlist-bottom-cta-glow" aria-hidden="true" />
            <span className="section-label">EARLY ACCESS</span>
            <h2 className="section-title-md mt-4 max-w-2xl">
              Be the first on your campus.
            </h2>
            <p className="section-copy mt-5">
              Darwin is launching at select campuses first. Reserve your spot now and get notified the moment we go live at your school.
            </p>

            <div className="waitlist-bottom-form-wrap mt-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success-bottom"
                    className="waitlist-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <CheckCircle2 size={20} className="waitlist-success-icon" />
                    <div>
                      <p className="waitlist-success-title">You&apos;re on the list!</p>
                      <p className="waitlist-success-sub">We&apos;ll reach out when darwin opens at your campus.</p>
                    </div>
                  </motion.div>
                ) : status === 'already' ? (
                  <motion.div
                    key="already-bottom"
                    className="waitlist-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <CheckCircle2 size={20} className="waitlist-success-icon" />
                    <div>
                      <p className="waitlist-success-title">You&apos;re already on the list!</p>
                      <p className="waitlist-success-sub">We already have your email — we&apos;ll be in touch when darwin launches.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form-bottom"
                    onSubmit={handleSubmit}
                    className="waitlist-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    noValidate
                  >
                    <div className="waitlist-input-wrap">
                      <input
                        id="waitlist-email-bottom"
                        type="email"
                        placeholder="email goes here"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        className={`waitlist-input${hasError ? ' waitlist-input-error' : ''}`}
                        autoComplete="email"
                        disabled={status === 'loading'}
                        aria-label="University email address"
                      />
                      <button
                        id="waitlist-submit-bottom"
                        type="submit"
                        className="pill-btn waitlist-submit-btn"
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <span className="waitlist-spinner" aria-hidden="true" />
                        ) : (
                          <>
                            Get Early Access
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                    {status === 'error' && (
                      <motion.p
                        className="waitlist-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="home-section-tail" aria-hidden="true" />
    </div>
  );
}
