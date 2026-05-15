'use client';

import { useRef, type CSSProperties } from 'react';

type Props = {
  radius?: number;
  color?: string;
  className?: string;
};

export default function CardSpotlight({
  radius = 260,
  color = 'var(--accent-glow)',
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--cs-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--cs-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--cs-opacity', '1');
  };

  const onMouseLeave = () => {
    ref.current?.style.setProperty('--cs-opacity', '0');
  };

  return (
    <span
      ref={ref}
      aria-hidden="true"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`card-spotlight ${className}`}
      style={
        {
          '--cs-radius': `${radius}px`,
          '--cs-color': color,
        } as CSSProperties
      }
    />
  );
}
