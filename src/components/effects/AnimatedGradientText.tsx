'use client';

type Props = {
  children: React.ReactNode;
  className?: string;
  durationMs?: number;
};

export default function AnimatedGradientText({
  children,
  className = '',
  durationMs = 6000,
}: Props) {
  return (
    <span
      className={`gradient-text ${className}`}
      style={{ ['--gt-duration' as string]: `${durationMs}ms` }}
    >
      {children}
    </span>
  );
}
