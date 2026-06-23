import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { serviceClient } from "@/lib/supabase/service";
import { constructWebhookEvent, refundSession } from "@/lib/stripe";
import { isTierKey } from "@/lib/whitelist";

// Stripe SDK uses node:crypto — Edge runtime is not an option.
export const runtime = "nodejs";

function emailFromSession(session: Stripe.Checkout.Session): string | null {
    const raw =
        session.customer_details?.email ??
        session.customer_email ??
        null;
    if (typeof raw !== "string") return null;
    const trimmed = raw.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : null;
}

function stripeCustomerId(session: Stripe.Checkout.Session): string | null {
    const c = session.customer;
    if (typeof c === "string") return c;
    if (c && typeof c === "object" && "id" in c) return c.id;
    return null;
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
    const pi = session.payment_intent;
    if (typeof pi === "string") return pi;
    if (pi && typeof pi === "object" && "id" in pi) return pi.id;
    return null;
}

export async function POST(request: Request) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not configured");
        return new Response("Server misconfigured", { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: Stripe.Event;
    try {
        event = constructWebhookEvent(rawBody, signature);
    } catch {
        return new Response("Invalid signature", { status: 401 });
    }

    if (event.type !== "checkout.session.completed") {
        return new Response("Ignored", { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
        return new Response("Not yet paid", { status: 200 });
    }

    const sessionId = session.id;
    const supabase = serviceClient();

    const { data: eventRow, error: eventErr } = await supabase
        .from("webhook_events")
        .insert({ event_id: event.id, provider: "stripe" })
        .select("event_id")
        .maybeSingle();

    if (eventErr && eventErr.code !== "23505") {
        return new Response("Database error", { status: 500 });
    }
    if (!eventRow) {
        return new Response("Already processed", { status: 200 });
    }

    const tier = session.metadata?.tier;
    if (!isTierKey(tier)) {
        return new Response("Invalid metadata", { status: 400 });
    }

    const email = emailFromSession(session);
    if (!email) {
        return new Response("Missing email", { status: 400 });
    }

    const { data: rows, error: rpcErr } = await supabase.rpc(
        "claim_founding_spot_guest",
        {
            p_email: email,
            p_tier: tier,
            p_order_id: sessionId,
            p_stripe_customer_id: stripeCustomerId(session),
            p_stripe_payment_intent_id: paymentIntentId(session),
        },
    );

    if (rpcErr) {
        console.error("[stripe webhook] claim_founding_spot_guest", rpcErr);
        // Roll back the idempotency row so Stripe retries will re-attempt
        // processing instead of being permanently blocked.
        await supabase
            .from("webhook_events")
            .delete()
            .eq("event_id", event.id);
        return new Response("Claim failed", { status: 500 });
    }

    const result = Array.isArray(rows) ? rows[0] : rows;
    const claimed =
        result &&
        typeof result === "object" &&
        "claimed" in result &&
        result.claimed === true;

    if (!claimed) {
        const piId = paymentIntentId(session);
        if (piId) {
            try {
                await refundSession(piId);
            } catch (err) {
                console.error(
                    "Oversell refund failed for session",
                    sessionId,
                    err,
                );
            }
        }
        return new Response("Refunded — sold out", { status: 200 });
    }

    revalidatePath("/whitelist");
    return new Response("OK", { status: 200 });
}
