'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

type Props = {
  value: number;
  durationMs?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function NumberTicker({
  value,
  durationMs = 1400,
  decimals = 0,
  className = '',
  prefix = '',
  suffix = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px', amount: 0 });
  const [display, setDisplay] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const snap = () => {
      fired.current = true;
      setDisplay(value);
    };

    const tween = () => {
      fired.current = true;
      const start = performance.now();
      let raf = 0;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setDisplay(value * easeOutExpo(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    };

    if (reduced) {
      snap();
      return;
    }

    if (inView) return tween();

    // Fallback: if useInView never fires (zero-viewport or IO missing),
    // just snap to the value so the user always sees the correct number.
    const t = window.setTimeout(snap, 1200);
    return () => window.clearTimeout(t);
  }, [inView, value, durationMs]);

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
