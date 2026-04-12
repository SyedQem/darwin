"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Check,
    ChevronDown,
    Sparkles,
    Star,
} from "lucide-react";
import { TIERS, type TierKey } from "@/lib/whitelist";
import { startCheckout } from "./actions";

const ease = [0.16, 1, 0.3, 1] as const;

type SpotRow = { tier: string; sold: number; total: number };

type Props = {
    spots: Record<TierKey, SpotRow>;
};

const MEMBER_BENEFITS = [
    "1 boosted listing every month, forever",
    "Early access to marketplace features",
    "Founding-member status preserved in your profile",
];

const PRO_BENEFITS = [
    "3 boosted listings every month, forever",
    "Founding Pro badge on your profile",
    "Priority support during the pre-launch period",
    "Early access to every upcoming feature",
];

const STEPS = [
    {
        num: "01",
        title: "Claim your spot",
        desc: "Secure a Founding tier with a one-time payment before spots run out.",
    },
    {
        num: "02",
        title: "Get boosts monthly",
        desc: "Your monthly boost allowance resets automatically, forever. No subscription to manage.",
    },
    {
        num: "03",
        title: "Stand out always",
        desc: "Boosted listings rise to the top of browse and search, giving you an edge on every campus drop.",
    },
];

const BOTTOM_BULLETS = [
    "Secure Stripe checkout",
    "Instant activation",
    "Founding status never expires",
];

export default function WhitelistClient({ spots }: Props) {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

    const totalSpots =
        TIERS.founding_member.maxSpots + TIERS.founding_pro.maxSpots;

    return (
        <div className="waitlist-page">
            {/* ── HERO ── */}
            <section ref={heroRef} className="waitlist-hero">
                <div className="waitlist-backdrop" aria-hidden="true">
                    <motion.div className="waitlist-orb" style={{ y: orbY }} />
                    <div className="waitlist-grid" />
                </div>

                <div className="container-vspr relative z-10">
                    <div className="waitlist-hero-inner">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease }}
                            className="waitlist-kicker"
                        >
                            <span
                                className="waitlist-kicker-dot"
                                aria-hidden="true"
                            />
                            Founding Access
                        </motion.div>

                        <motion.h1
                            className="waitlist-headline"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.25, ease }}
                        >
                            Pay once.
                            <br />
                            <span className="text-muted">Boost forever.</span>
                        </motion.h1>

                        <motion.p
                            className="waitlist-subhead"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.42, ease }}
                        >
                            A limited pre-launch tier for Darwin&apos;s earliest
                            members. One payment, monthly boosts, yours for
                            life — no subscription, no expiry.
                        </motion.p>

                        <motion.div
                            className="whitelist-trust-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.58, ease }}
                        >
                            <span className="whitelist-trust-item">
                                <span
                                    className="whitelist-trust-dot"
                                    aria-hidden="true"
                                />
                                {totalSpots} total spots
                            </span>
                            <span
                                className="whitelist-trust-sep"
                                aria-hidden="true"
                            >
                                ·
                            </span>
                            <span className="whitelist-trust-item">
                                One-time payment
                            </span>
                            <span
                                className="whitelist-trust-sep"
                                aria-hidden="true"
                            >
                                ·
                            </span>
                            <span className="whitelist-trust-item">
                                Secure Stripe checkout
                            </span>
                        </motion.div>

                        <motion.a
                            href="#tiers"
                            className="whitelist-scroll-hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9, ease }}
                            aria-label="Jump to tier selection"
                        >
                            Choose your tier
                            <ChevronDown
                                size={14}
                                className="whitelist-scroll-hint-chevron"
                            />
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* ── TIER CARDS ── */}
            <section id="tiers" className="waitlist-features-section">
                <div className="container-vspr">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.6, ease }}
                        className="waitlist-features-header"
                    >
                        <span className="section-label">Choose your tier</span>
                        <h2 className="section-title-md mt-4">
                            Two tiers.
                            <br />
                            <span className="text-muted">Limited spots.</span>
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <TierCard
                            tierKey="founding_member"
                            spot={spots.founding_member}
                            icon={<Sparkles size={18} />}
                            benefits={MEMBER_BENEFITS}
                            delay={0}
                        />
                        <TierCard
                            tierKey="founding_pro"
                            spot={spots.founding_pro}
                            icon={<Star size={18} />}
                            benefits={PRO_BENEFITS}
                            featured
                            delay={0.1}
                        />
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="waitlist-how-section">
                <div className="container-vspr">
                    <div className="divider" />

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.6, ease }}
                        className="waitlist-features-header"
                    >
                        <span className="section-label">How it works</span>
                        <h2 className="section-title-md mt-4">
                            Join once.
                            <br />
                            <span className="text-muted">Benefit forever.</span>
                        </h2>
                    </motion.div>

                    <div className="waitlist-steps-grid">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.num}
                                className="vspr-card waitlist-step-card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    delay: i * 0.1,
                                    duration: 0.5,
                                    ease,
                                }}
                            >
                                <div className="waitlist-step-num-row">
                                    <span className="section-label">
                                        Step {step.num}
                                    </span>
                                    <span className="text-number-fade waitlist-step-num-bg">
                                        {step.num}
                                    </span>
                                </div>
                                <h3 className="waitlist-step-title">
                                    {step.title}
                                </h3>
                                <p className="text-secondary waitlist-step-desc">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BOTTOM REASSURANCE ── */}
            <section className="waitlist-bottom-cta-section">
                <div className="container-vspr">
                    <motion.div
                        className="waitlist-bottom-cta-panel"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.8, ease }}
                    >
                        <div
                            className="waitlist-bottom-cta-glow"
                            aria-hidden="true"
                        />
                        <span className="section-label">Why founding</span>
                        <h2 className="section-title-md mt-4 max-w-2xl">
                            Early support.
                            <br />
                            <span className="text-muted">
                                Lasting reward.
                            </span>
                        </h2>
                        <p className="section-copy mt-5 max-w-2xl">
                            Founding tiers are Darwin&apos;s way of thanking
                            the people who showed up first. They&apos;re
                            one-time, limited, and permanent — no renewals, no
                            catches.
                        </p>

                        <ul className="whitelist-bottom-bullets">
                            {BOTTOM_BULLETS.map((b) => (
                                <li
                                    key={b}
                                    className="whitelist-bottom-bullet"
                                >
                                    <span className="whitelist-bottom-bullet-check">
                                        <Check size={12} strokeWidth={3} />
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            <div className="home-section-tail" aria-hidden="true" />
        </div>
    );
}

function TierCard({
    tierKey,
    spot,
    icon,
    benefits,
    featured = false,
    delay = 0,
}: {
    tierKey: TierKey;
    spot: SpotRow;
    icon: React.ReactNode;
    benefits: string[];
    featured?: boolean;
    delay?: number;
}) {
    const tier = TIERS[tierKey];
    const remaining = Math.max(0, spot.total - spot.sold);
    const soldOut = remaining === 0;
    const progressPct = Math.min(100, (spot.sold / spot.total) * 100);

    return (
        <motion.div
            className={`whitelist-card ${featured ? "whitelist-card--featured" : ""}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay, duration: 0.55, ease }}
        >
            <div className="flex items-center justify-between mb-5">
                <span className="whitelist-card-kicker">
                    {icon}
                    {tier.label}
                </span>
                {featured && (
                    <span className="whitelist-card-chip">Most Popular</span>
                )}
            </div>

            <div className="flex items-baseline gap-2 mb-6">
                <span className="price-tag text-5xl">${tier.price}</span>
                <span className="text-muted text-sm">one-time</span>
            </div>

            <ul className="space-y-3 mb-8">
                {benefits.map((b) => (
                    <li
                        key={b}
                        className="flex items-start gap-3 text-[15px] text-secondary leading-relaxed"
                    >
                        <Check
                            size={16}
                            className="mt-1 shrink-0 text-[color:var(--accent)]"
                        />
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span>
                        {remaining} of {spot.total} spots left
                    </span>
                    <span>{Math.round(progressPct)}% claimed</span>
                </div>
                <div
                    className="whitelist-progress"
                    role="progressbar"
                    aria-valuenow={spot.sold}
                    aria-valuemin={0}
                    aria-valuemax={spot.total}
                >
                    <div
                        className="whitelist-progress-fill"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {soldOut ? (
                <button
                    type="button"
                    disabled
                    className="pill-btn w-full min-h-12"
                    aria-disabled="true"
                >
                    Sold Out
                </button>
            ) : (
                <form action={startCheckout}>
                    <input type="hidden" name="tier" value={tierKey} />
                    <button
                        type="submit"
                        className={`w-full min-h-12 ${featured ? "pill-btn" : "pill-btn pill-btn-outline"}`}
                    >
                        Claim {tier.label}
                    </button>
                </form>
            )}
        </motion.div>
    );
}
