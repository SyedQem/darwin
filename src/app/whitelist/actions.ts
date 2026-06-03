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

    const { data: spot } = await supabase
        .from("whitelist_spots")
        .select("sold,total")
        .eq("tier", tier)
        .single();

    if (!spot || spot.sold >= spot.total) {
        redirect("/whitelist?error=sold_out");
    }

    let checkoutUrl: string;
    try {
        checkoutUrl = await createCheckoutSession(tier);
    } catch (err) {
        console.error("[startCheckout]", err);
        redirect("/whitelist?error=checkout_failed");
    }

    redirect(checkoutUrl);
}
