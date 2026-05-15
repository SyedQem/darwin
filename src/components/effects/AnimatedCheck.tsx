'use client';

import { motion } from 'framer-motion';

type Props = {
  size?: number;
  className?: string;
  delay?: number;
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function AnimatedCheck({ size = 64, className = '', delay = 0 }: Props) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
      aria-hidden="true"
    >
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        stroke="var(--accent)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: delay + 0.05, ease }}
      />
      <motion.path
        d="M19 33 L28 42 L45 23"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.35, ease }}
      />
    </motion.svg>
  );
}
