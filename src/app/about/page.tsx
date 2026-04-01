'use client';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container-vspr py-12 md:py-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">ABOUT</span>
        <h1 className="text-4xl md:text-7xl font-bold mt-4 leading-tight">
          Built for students.
          <br />
          <span style={{ color: 'var(--text-muted)' }}>By students.</span>
        </h1>
      </motion.div>

      <div className="divider my-16" />

      {/* Mission */}
      <section>
        <span className="section-label">01 // MISSION</span>
        <div className="max-w-3xl mt-6">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Darwin was created to solve a simple problem: campus marketplaces are fragmented
            across WhatsApp groups, Facebook posts, and bulletin boards. We built one unified
            platform where students can find, buy, and sell everything they need — fast,
            safe, and local.
          </p>
        </div>
      </section>

      <div className="divider my-16" />

      {/* Values */}
      <section>
        <span className="section-label">02 // VALUES</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-4">
          What drives us.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {[
            {
              icon: <Shield size={28} />,
              title: 'Trust & Safety',
              desc: 'Verified campus identities mean you know exactly who you&apos;re trading with.',
            },
            {
              icon: <Zap size={28} />,
              title: 'Speed',
              desc: 'List in seconds, find in minutes. No middlemen, no shipping delays.',
            },
            {
              icon: <Users size={28} />,
              title: 'Community',
              desc: 'Every transaction strengthens campus connections. Support your peers.',
            },
            {
              icon: <Globe size={28} />,
              title: 'Sustainability',
              desc: 'Extend the life of products. Reduce waste. Keep things circulating.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="vspr-card p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ color: 'var(--text-muted)' }} className="mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider my-16" />

      {/* Numbers */}
      <section>
        <span className="section-label">03 // BY THE NUMBERS</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {[
            { num: '2.4K+', label: 'Active Students' },
            { num: '8.1K', label: 'Items Listed' },
            { num: '94%', label: 'Deal Success Rate' },
            { num: '12', label: 'Campuses' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-bold">{stat.num}</p>
              <p className="text-xs mt-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
