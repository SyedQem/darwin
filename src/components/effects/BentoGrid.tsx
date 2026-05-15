'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as const;

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[200px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

type BentoCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
  span?: 'sm' | 'lg' | 'tall' | 'wide';
  background?: React.ReactNode;
};

const spanClasses: Record<NonNullable<BentoCardProps['span']>, string> = {
  sm: 'md:col-span-1 md:row-span-1',
  lg: 'md:col-span-2 md:row-span-2',
  tall: 'md:col-span-1 md:row-span-2',
  wide: 'md:col-span-2 md:row-span-1',
};

export function BentoCard({
  icon,
  title,
  description,
  className,
  delay = 0,
  span = 'sm',
  background,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.55, ease }}
      className={cn(
        'bento-card group relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 transition-all duration-300',
        'hover:border-[var(--border-hover)] hover:-translate-y-0.5',
        spanClasses[span],
        className,
      )}
    >
      {background}
      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="bento-card-icon mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated,#131316)] text-[var(--accent)] transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>
        <h3 className="text-[1.05rem] font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
