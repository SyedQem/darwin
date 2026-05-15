'use client';

type Props = {
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorVia?: string;
  colorTo?: string;
  className?: string;
};

export default function ShineBorder({
  duration = 8,
  borderWidth = 1.5,
  colorFrom = 'var(--accent)',
  colorVia = 'var(--accent-2)',
  colorTo = 'transparent',
  className = '',
}: Props) {
  return (
    <span
      aria-hidden="true"
      className={`shine-border ${className}`}
      style={
        {
          '--sb-duration': `${duration}s`,
          '--sb-width': `${borderWidth}px`,
          '--sb-from': colorFrom,
          '--sb-via': colorVia,
          '--sb-to': colorTo,
        } as React.CSSProperties
      }
    />
  );
}
