import "server-only";
import Stripe from "stripe";
import { TIERS, type TierKey } from "@/lib/whitelist";

let cachedClient: Stripe | null = null;

function stripe(): Stripe {
    if (cachedClient) return cachedClient;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    cachedClient = new Stripe(key);
    return cachedClient;
}

/**
 * Create a Stripe Checkout Session for a given tier + user.
 * Encodes user_id and tier in session metadata — Stripe echoes this
 * back in the webhook on `session.metadata`, which is what we trust.
 */
export async function createCheckoutSession(
    tier: TierKey,
    userId: string,
): Promise<string> {
    const priceId = process.env[TIERS[tier].priceEnv];
    if (!priceId) throw new Error(`${TIERS[tier].priceEnv} is not set`);

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe().checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/whitelist/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/whitelist?error=cancelled`,
        metadata: { user_id: userId, tier },
        // Stripe ties the PaymentIntent to this session so we can refund
        // later via session.payment_intent without extra lookups.
        payment_intent_data: {
            metadata: { user_id: userId, tier },
        },
    });

    if (!session.url) {
        throw new Error("Stripe did not return a checkout URL");
    }
    return session.url;
}

/**
 * Retrieve a Checkout Session with the PaymentIntent + latest Charge
 * expanded so the success page can read the Stripe-hosted receipt URL
 * without a second API round-trip.
 */
export async function retrieveSession(
    sessionId: string,
): Promise<Stripe.Checkout.Session> {
    return stripe().checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent.latest_charge"],
    });
}

/**
 * Verify a Stripe webhook signature. Throws on invalid signature.
 * Stripe SDK handles HMAC + timestamp tolerance internally.
 */
export function constructWebhookEvent(
    rawBody: string,
    signatureHeader: string | null,
): Stripe.Event {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    if (!signatureHeader) throw new Error("Missing stripe-signature header");
    return stripe().webhooks.constructEvent(rawBody, signatureHeader, secret);
}

/**
 * Issue a full refund against the PaymentIntent attached to a Checkout
 * Session. Called when a paid webhook arrives but the tier sold out
 * between checkout and payment settling.
 */
export async function refundSession(paymentIntentId: string): Promise<void> {
    await stripe().refunds.create({ payment_intent: paymentIntentId });
}
