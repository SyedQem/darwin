'use client';

import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  durationSec?: number;
  fade?: boolean;
};

export default function Marquee({
  children,
  className,
  pauseOnHover = true,
  reverse = false,
  durationSec = 30,
  fade = true,
}: Props) {
  return (
    <div
      className={cn(
        'marquee-root group',
        fade && 'marquee-fade',
        className,
      )}
      style={
        {
          ['--marquee-duration' as string]: `${durationSec}s`,
          ['--marquee-direction' as string]: reverse ? 'reverse' : 'normal',
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'marquee-track',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        aria-hidden="false"
      >
        {children}
      </div>
      <div
        className={cn(
          'marquee-track',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
