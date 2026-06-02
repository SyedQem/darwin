'use client';

import { MotionConfig } from 'framer-motion';

/**
 * App-wide Framer Motion config. `reducedMotion="user"` makes every motion
 * component respect the OS "reduce motion" setting — transform/layout
 * animations are skipped — without touching each call site.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
