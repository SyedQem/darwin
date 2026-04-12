import { createClient } from "@/lib/supabase/server";
import { TIERS, type TierKey, isTierKey } from "@/lib/whitelist";

export type BoostStatus = {
    canBoost: boolean;
    remaining: number;
    tier: TierKey | null;
};

/**
 * Read-only check of a user's boost quota.
 *
 * Returns whether the user currently has a boost available this period.
 * Does NOT mutate — the monthly reset and actual decrement live in a
 * future `consumeBoost` RPC invoked by the boost action. Keeping this
 * read-only means it's cheap to call on every render.
 *
 * TODO: wire `consumeBoost(userId)` RPC when the boosted-listing UI lands.
 */
export async function canBoost(userId: string): Promise<BoostStatus> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("whitelist_tier, boosts_used_this_month, boost_reset_at")
        .eq("id", userId)
        .single();

    if (error || !data || !isTierKey(data.whitelist_tier)) {
        return { canBoost: false, remaining: 0, tier: null };
    }

    const tier = data.whitelist_tier;
    const quota = TIERS[tier].boostsPerMonth;

    // If the reset date has passed, the next use will be treated as a
    // fresh period. Surface the full quota as remaining.
    const resetAt = data.boost_reset_at ? new Date(data.boost_reset_at) : null;
    const periodExpired = !resetAt || resetAt.getTime() <= Date.now();
    const used = periodExpired ? 0 : (data.boosts_used_this_month ?? 0);

    const remaining = Math.max(0, quota - used);
    return { canBoost: remaining > 0, remaining, tier };
}
