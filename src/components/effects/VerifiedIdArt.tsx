'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, GraduationCap } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function VerifiedIdArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[58%] items-center justify-center overflow-hidden md:flex"
    >
      {/* Accent glow */}
      <div className="absolute -top-10 right-2 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18)_0%,transparent_65%)] blur-2xl" />

      {/* Faux student-ID card */}
      <motion.div
        initial={{ opacity: 0, y: 18, rotate: -8 }}
        whileInView={{ opacity: 1, y: 0, rotate: -6 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: 0.15, duration: 0.7, ease }}
        className="relative w-[260px] -rotate-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.55)]"
      >
        {/* Verified badge */}
        <span className="absolute -right-3 -top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--bg-card)] text-[var(--accent)] shadow-lg">
          <BadgeCheck size={18} />
        </span>

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(249,115,22,0.35),rgba(251,191,36,0.18))] text-[var(--accent)]">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <span className="h-2.5 w-24 rounded-full bg-white/15" />
            <span className="h-2 w-16 rounded-full bg-white/8" />
          </div>
        </div>

        {/* Detail lines */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="h-2 w-full rounded-full bg-white/8" />
          <span className="h-2 w-3/4 rounded-full bg-white/8" />
        </div>

        {/* Campus chip */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Verified Student
        </div>
      </motion.div>
    </div>
  );
}
