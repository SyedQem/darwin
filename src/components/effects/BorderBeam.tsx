'use client';

type Props = {
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  className?: string;
};

export default function BorderBeam({
  duration = 6,
  delay = 0,
  colorFrom = 'var(--accent)',
  colorTo = 'var(--accent-2)',
  borderWidth = 1.5,
  className = '',
}: Props) {
  return (
    <span
      aria-hidden="true"
      className={`border-beam ${className}`}
      style={
        {
          '--bb-duration': `${duration}s`,
          '--bb-delay': `${delay}s`,
          '--bb-from': colorFrom,
          '--bb-to': colorTo,
          '--bb-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
    />
  );
}
