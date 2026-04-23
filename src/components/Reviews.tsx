'use client';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

const ease = [0.16, 1, 0.3, 1] as const;

const reviews = [
  {
    name: 'Sarah',
    school: 'McMaster',
    text: 'Sold my textbooks in 2 hours. Way easier than Facebook.',
    stars: 5,
  },
  {
    name: 'Ahmed',
    school: 'UofT',
    text: 'Finally something built for students. Clean and actually useful.',
    stars: 5,
  },
  {
    name: 'Maya',
    school: 'Waterloo',
    text: 'Feels safe and fast. I use it every week now.',
    stars: 5,
  },
];

export default function Reviews() {
  return (
    <div className="container-vspr">
      <AnimatedSection>
        <div className="max-w-3xl">
          <span className="section-label">TRUSTED BY STUDENTS</span>
          <h2 className="section-title-md mt-4">
            4.9 / 5 from 1,200+ exchanges
          </h2>
          <p className="section-copy mt-5">
            Trust is what makes students use the marketplace every week.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5, ease }}
            className="home-review-card px-10 py-10 md:px-14 md:py-14 transition-all duration-200 hover:border-[rgba(255,255,255,0.14)]"
          >
            <div className="accent-text text-lg tracking-wider">★★★★★</div>
            <p className="mt-5 text-lg leading-relaxed text-white/90 font-light">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="mt-auto flex items-center gap-3 pt-8 text-base">
              <span className="font-medium text-white">{review.name}</span>
              <span className="text-muted">·</span>
              <span className="text-white/50">{review.school}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
