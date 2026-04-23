import { Star } from 'lucide-react';
import type { TierKey } from '@/lib/whitelist';

type FoundingBadgeProps = {
  tier: TierKey | null | undefined;
};

/**
 * Small pill shown next to Founding Pro members' names.
 *
 * TODO: wire into the future profile page and listing-card seller row.
 * Intentionally not placed anywhere this pass — the app has no profile
 * surface yet. Renders null for non-Pro tiers.
 */
export default function FoundingBadge({ tier }: FoundingBadgeProps) {
  if (tier !== 'founding_pro') return null;

  return (
    <span className="founding-badge" aria-label="Founding Pro member">
      <Star size={11} fill="currentColor" />
      Founding Pro
    </span>
  );
}
