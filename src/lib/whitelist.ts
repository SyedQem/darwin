/**
 * Pre-launch premium whitelist tiers.
 *
 * Single source of truth for tier metadata, consumed by:
 *   - /whitelist pricing page
 *   - startCheckout server action
 *   - Lemon Squeezy webhook validator
 */

type TierSpec = {
  label: string;
  price: number;
  boostsPerMonth: number;
  maxSpots: number;
  /** Env var holding the Stripe Price id for this tier's product. */
  priceEnv: string;
};

export const TIERS = {
  founding_member: {
    label: "Founding Member",
    price: 9,
    boostsPerMonth: 1,
    maxSpots: 150,
    priceEnv: "STRIPE_PRICE_ID_FOUNDING_MEMBER",
  },
  founding_pro: {
    label: "Founding Pro",
    price: 29,
    boostsPerMonth: 3,
    maxSpots: 75,
    priceEnv: "STRIPE_PRICE_ID_FOUNDING_PRO",
  },
} as const satisfies Record<string, TierSpec>;

export type TierKey = keyof typeof TIERS;

export function isTierKey(value: unknown): value is TierKey {
  return typeof value === "string" && value in TIERS;
}
