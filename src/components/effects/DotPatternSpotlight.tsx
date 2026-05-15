'use client';

import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
};

export default function DotPatternSpotlight({ className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      if (!pending || !ref.current) return;
      ref.current.style.setProperty('--dps-x', `${pending.x}px`);
      ref.current.style.setProperty('--dps-y', `${pending.y}px`);
      pending = null;
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pending = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className={`dot-pattern-spotlight ${className}`} />;
}
