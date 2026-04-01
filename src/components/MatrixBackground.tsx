'use client';
import { useEffect, useState } from 'react';
import { matrixChars } from '@/lib/data';

interface MatrixChar {
  id: number;
  char: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function MatrixBackground() {
  const [chars, setChars] = useState<MatrixChar[]>([]);

  useEffect(() => {
    const generated: MatrixChar[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      size: 10 + Math.random() * 8,
    }));
    setChars(generated);
  }, []);

  return (
    <div className="matrix-bg" aria-hidden="true">
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
