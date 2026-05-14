"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe";
import { isTierKey } from "@/lib/whitelist";

export async function startCheckout(formData: FormData): Promise<void> {
    const tier = formData.get("tier");
    if (!isTierKey(tier)) {
        redirect("/whitelist?error=invalid_tier");
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Not signed in — send to login carrying the chosen tier, so the flow
    // resumes straight into Stripe checkout once the user authenticates.
    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/whitelist?tier=${tier}`)}`);
    }

    // Defense-in-depth: block obviously sold-out tiers before hitting Lemon.
    // The authoritative cap check still happens atomically in the webhook's
    // RPC — this is just to avoid sending users to checkout when we already
    // know there are no spots.
    const { data: spot } = await supabase
        .from("whitelist_spots")
        .select("sold,total")
        .eq("tier", tier)
        .single();

    if (!spot || spot.sold >= spot.total) {
        redirect("/whitelist?error=sold_out");
    }

    // Create the hosted checkout. Keep redirect() outside try/catch —
    // it throws NEXT_REDIRECT as a control-flow exception and try/catch
    // would swallow it.
    let checkoutUrl: string;
    try {
        checkoutUrl = await createCheckoutSession(tier, user.id);
    } catch (err) {
        console.error("[startCheckout]", err);
        redirect("/whitelist?error=checkout_failed");
}

    redirect(checkoutUrl);
}
