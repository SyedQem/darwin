'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

type Props = {
  trigger: unknown;
  particleCount?: number;
};

export default function Confetti({ trigger, particleCount = 90 }: Props) {
  const last = useRef<unknown>(undefined);

  useEffect(() => {
    if (last.current === trigger) return;
    last.current = trigger;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const colors = ['#f97316', '#fbbf24', '#fcd34d', '#ffffff'];
    const defaults = {
      origin: { y: 0.6 },
      colors,
      ticks: 220,
      gravity: 0.9,
      scalar: 0.9,
      disableForReducedMotion: true,
    } as const;

    confetti({ ...defaults, particleCount, spread: 70, startVelocity: 38 });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: Math.round(particleCount * 0.6), spread: 110, startVelocity: 28, origin: { x: 0.2, y: 0.7 } });
      confetti({ ...defaults, particleCount: Math.round(particleCount * 0.6), spread: 110, startVelocity: 28, origin: { x: 0.8, y: 0.7 } });
    }, 180);
  }, [trigger, particleCount]);

  return null;
}
