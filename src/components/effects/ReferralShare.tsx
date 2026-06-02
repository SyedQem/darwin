'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Check, Share2, Gift } from 'lucide-react';

const GOAL = 5;

type Props = {
  referralCode: string;
  referralCount: number;
  rewardUnlocked: boolean;
  /** Headline shown above the share block (varies by success vs. already-joined). */
  title: string;
  subtitle: string;
};

export default function ReferralShare({
  referralCode,
  referralCount,
  rewardUnlocked,
  title,
  subtitle,
}: Props) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Browser-only values resolved once on mount (avoids SSR/hydration mismatch).
    /* eslint-disable react-hooks/set-state-in-effect */
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://darwinmarketplace.ca';
    setUrl(`${origin}/waitlist?ref=${referralCode}`);
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [referralCode]);

  const remaining = Math.max(0, GOAL - referralCount);
  const pct = Math.min(100, Math.round((Math.min(referralCount, GOAL) / GOAL) * 100));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — link is still visible to copy manually */
    }
  };

  const share = async () => {
    try {
      await navigator.share({
        title: 'Join me on Darwin',
        text: 'Darwin is a campus-only marketplace for students. Join the waitlist with my link:',
        url,
      });
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <div className="referral-share">
      <div className="referral-share-head">
        <CheckCircle2 size={20} className="waitlist-success-icon" />
        <div>
          <p className="waitlist-success-title">{title}</p>
          <p className="waitlist-success-sub">{subtitle}</p>
        </div>
      </div>

      <div className="referral-share-divider" aria-hidden="true" />

      {rewardUnlocked ? (
        <p className="referral-share-goal referral-share-goal--done">
          <Gift size={15} />
          Priority access unlocked — you&apos;re at the front of the line.
        </p>
      ) : (
        <p className="referral-share-goal">
          <Gift size={15} />
          Invite <strong>{remaining}</strong> more {remaining === 1 ? 'friend' : 'friends'} to unlock{' '}
          <strong>priority early access</strong>.
        </p>
      )}

      {/* Progress */}
      <div className="referral-progress" role="progressbar" aria-valuenow={Math.min(referralCount, GOAL)} aria-valuemin={0} aria-valuemax={GOAL}>
        <div className="referral-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <p className="referral-progress-label">
        {Math.min(referralCount, GOAL)} / {GOAL} invited
      </p>

      {/* Link + actions */}
      <div className="referral-link-row">
        <input className="referral-link-input" value={url} readOnly aria-label="Your referral link" onFocus={(e) => e.currentTarget.select()} />
        <button type="button" className="pill-btn referral-copy-btn" onClick={copy} aria-label="Copy referral link">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {canShare && (
        <button type="button" className="referral-share-native" onClick={share}>
          <Share2 size={14} />
          Share your link
        </button>
      )}
    </div>
  );
}
