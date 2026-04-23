import { redirect } from "next/navigation";
import Link from "next/link";
import type Stripe from "stripe";
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { retrieveSession } from "@/lib/stripe";
import { TIERS, isTierKey } from "@/lib/whitelist";

// Always re-render: the page reflects a live Stripe session and must never
// be served from a static cache.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ session_id?: string }>;

function formatUSD(amountCents: number | null | undefined): string {
    if (amountCents == null) return "$0";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amountCents / 100);
}

function receiptUrlFrom(session: Stripe.Checkout.Session): string | null {
    const pi = session.payment_intent;
    if (!pi || typeof pi === "string") return null;
    const charge = pi.latest_charge;
    if (!charge || typeof charge === "string") return null;
    return charge.receipt_url ?? null;
}

export default async function WhitelistSuccessPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { session_id } = await searchParams;
    if (!session_id) redirect("/whitelist");

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/whitelist");

    let session: Stripe.Checkout.Session;
    try {
        session = await retrieveSession(session_id);
    } catch {
        redirect("/whitelist?error=checkout_failed");
    }

    const tierKey = session.metadata?.tier;
    const metadataUserId = session.metadata?.user_id;

    // Don't leak another user's session — and don't render a confirmation
    // for anything that hasn't actually been paid.
    if (
        session.payment_status !== "paid" ||
        metadataUserId !== user.id ||
        !isTierKey(tierKey)
    ) {
        redirect("/whitelist");
    }

    const tier = TIERS[tierKey];
    const amount = formatUSD(session.amount_total);
    const email = session.customer_details?.email ?? user.email ?? null;
    const receiptUrl = receiptUrlFrom(session);

    return (
        <div className="waitlist-page">
            <section className="waitlist-hero">
                <div className="waitlist-backdrop" aria-hidden="true">
                    <div className="waitlist-orb" />
                    <div className="waitlist-grid" />
                </div>

                <div className="container-vspr relative z-10">
                    <div className="whitelist-success-panel waitlist-founding-panel">
                        <div
                            className="waitlist-founding-grid"
                            aria-hidden="true"
                        />
                        <div
                            className="waitlist-founding-glow"
                            aria-hidden="true"
                        />
                        <div
                            className="waitlist-founding-ornament"
                            aria-hidden="true"
                        >
                            <div className="waitlist-founding-ornament-ring" />
                            <div className="waitlist-founding-ornament-ring waitlist-founding-ornament-ring--outer" />
                            <Sparkles
                                size={40}
                                className="waitlist-founding-ornament-icon"
                                strokeWidth={1.5}
                            />
                        </div>

                        <div className="waitlist-founding-content">
                            <span className="waitlist-kicker waitlist-founding-kicker">
                                <CheckCircle2
                                    size={14}
                                    className="whitelist-success-check"
                                />
                                Payment confirmed
                            </span>

                            <h1 className="waitlist-founding-title">
                                You&apos;re in.
                                <br />
                                <span className="text-muted">
                                    Welcome, founder.
                                </span>
                            </h1>

                            <p className="waitlist-founding-copy">
                                We charged {amount} and locked in your{" "}
                                {tier.label} spot
                                {email ? (
                                    <>
                                        . A receipt is on its way to{" "}
                                        <span className="whitelist-success-email">
                                            {email}
                                        </span>
                                        .
                                    </>
                                ) : (
                                    "."
                                )}
                            </p>

                            <div className="waitlist-founding-stats">
                                <div className="waitlist-founding-stat">
                                    <span className="waitlist-founding-stat-value">
                                        {tier.label}
                                    </span>
                                    <span className="waitlist-founding-stat-label">
                                        Your tier
                                    </span>
                                </div>
                                <span
                                    className="waitlist-founding-stat-sep"
                                    aria-hidden="true"
                                />
                                <div className="waitlist-founding-stat">
                                    <span className="waitlist-founding-stat-value">
                                        {amount}
                                    </span>
                                    <span className="waitlist-founding-stat-label">
                                        One-time
                                    </span>
                                </div>
                                <span
                                    className="waitlist-founding-stat-sep"
                                    aria-hidden="true"
                                />
                                <div className="waitlist-founding-stat">
                                    <span className="waitlist-founding-stat-value">
                                        {tier.boostsPerMonth}/mo
                                    </span>
                                    <span className="waitlist-founding-stat-label">
                                        Boosts, forever
                                    </span>
                                </div>
                            </div>

                            <ul className="whitelist-success-list">
                                <li>
                                    <Check
                                        size={16}
                                        className="whitelist-success-check"
                                    />
                                    <span>
                                        Boosted listings activate the moment
                                        Darwin goes live at your campus.
                                    </span>
                                </li>
                                <li>
                                    <Check
                                        size={16}
                                        className="whitelist-success-check"
                                    />
                                    <span>
                                        We&apos;ll email you the instant your
                                        campus opens.
                                    </span>
                                </li>
                                <li>
                                    <Check
                                        size={16}
                                        className="whitelist-success-check"
                                    />
                                    <span>
                                        No renewals, no subscription — this is
                                        yours forever.
                                    </span>
                                </li>
                            </ul>

                            <div className="whitelist-success-ctas">
                                <Link
                                    href="/waitlist"
                                    className="pill-btn whitelist-success-primary"
                                >
                                    Back to waitlist
                                    <ArrowRight size={15} />
                                </Link>
                                {receiptUrl && (
                                    <a
                                        href={receiptUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="pill-btn pill-btn-outline"
                                    >
                                        View Stripe receipt
                                        <ArrowUpRight size={15} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="home-section-tail" aria-hidden="true" />
        </div>
    );
}
