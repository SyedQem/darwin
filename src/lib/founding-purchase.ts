import "server-only";
import { serviceClient } from "@/lib/supabase/service";
import type { TierKey } from "@/lib/whitelist";

export type FoundingPurchase = {
    email: string;
    secret_code: string;
    tier: TierKey;
    stripe_checkout_session_id: string;
    created_at: string;
};

export async function getPurchaseBySessionId(
    sessionId: string,
): Promise<FoundingPurchase | null> {
    const supabase = serviceClient();
    const { data, error } = await supabase
        .from("founding_purchases")
        .select(
            "email,secret_code,tier,stripe_checkout_session_id,created_at",
        )
        .eq("stripe_checkout_session_id", sessionId)
        .maybeSingle();

    if (error || !data) return null;
    return data as FoundingPurchase;
}
