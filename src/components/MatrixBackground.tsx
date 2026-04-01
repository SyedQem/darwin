'use client';
import { matrixChars } from '@/lib/data';

interface MatrixChar {
  id: number;
  char: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const seededRandom = (seed: number) => {
  const value = Math.sin(seed * 9999.91) * 43758.5453;
  return value - Math.floor(value);
};

const chars: MatrixChar[] = Array.from({ length: 60 }, (_, i) => {
  const r1 = seededRandom(i + 1);
  const r2 = seededRandom(i + 11);
  const r3 = seededRandom(i + 21);
  const r4 = seededRandom(i + 31);
  const r5 = seededRandom(i + 41);

  return {
      id: i,
      char: matrixChars[Math.floor(r1 * matrixChars.length)],
      left: r2 * 100,
      delay: r3 * 20,
      duration: 15 + r4 * 20,
      size: 10 + r5 * 8,
  };
});

export default function MatrixBackground() {

  return (
    <div className="matrix-bg" aria-hidden="true">
      <div className="matrix-glow matrix-glow--1" />
      <div className="matrix-glow matrix-glow--2" />
      {chars.map((c) => (
        <span
          key={c.id}
          className="matrix-char"
          style={{
            left: `${c.left}%`,
            fontSize: `${c.size}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
}
