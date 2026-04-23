import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { serviceClient } from "@/lib/supabase/service";
import { constructWebhookEvent, refundSession } from "@/lib/stripe";
import { isTierKey } from "@/lib/whitelist";

// Stripe SDK uses node:crypto — Edge runtime is not an option.
export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
    // Stripe signs the raw body — must read text() before JSON parsing.
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: Stripe.Event;
    try {
        event = constructWebhookEvent(rawBody, signature);
    } catch {
        return new Response("Invalid signature", { status: 401 });
    }

    // Only care about completed one-time Checkout payments for now.
    if (event.type !== "checkout.session.completed") {
        return new Response("Ignored", { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Stripe marks the session paid via `payment_status`; guard against
    // async captures that aren't settled yet.
    if (session.payment_status !== "paid") {
        return new Response("Not yet paid", { status: 200 });
    }

    const sessionId = session.id;
    const supabase = serviceClient();

    // Idempotency — Stripe retries on non-2xx and can duplicate events.
    // INSERT ON CONFLICT DO NOTHING: if we already handled this event,
    // the insert returns nothing and we exit early.
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

    // Validate signed metadata. Stripe signs the whole event, so
    // `session.metadata` is authoritative.
    const userId = session.metadata?.user_id;
    const tier = session.metadata?.tier;

    if (
        typeof userId !== "string" ||
        !UUID_RE.test(userId) ||
        !isTierKey(tier)
    ) {
        return new Response("Invalid metadata", { status: 400 });
    }

    // Atomic spot claim.
    const { data: claimed, error: rpcErr } = await supabase.rpc(
        "claim_whitelist_spot",
        { p_user_id: userId, p_tier: tier, p_order_id: sessionId },
    );

    if (rpcErr) {
        return new Response("Claim failed", { status: 500 });
    }

    if (claimed === false) {
        // Oversell race — tier sold out between checkout and payment.
        // Refund via the PaymentIntent attached to the session, then
        // 200 so Stripe stops retrying. TODO: wire alerting/logging.
        const paymentIntentId =
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;
        if (paymentIntentId) {
            try {
                await refundSession(paymentIntentId);
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
