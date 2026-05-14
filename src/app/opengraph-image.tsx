import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Darwin — Campus Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 100px',
          background: '#09090b',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow - purple */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
          }}
        />
        {/* Background glow - indigo */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#f4f4f5',
              letterSpacing: '-0.03em',
            }}
          >
            darwin
          </span>
          <span
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#f97316',
            }}
          >
            .
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#f4f4f5',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              maxWidth: '700px',
            }}
          >
            Your campus marketplace.
          </span>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: '#a1a1aa',
              lineHeight: 1.5,
              maxWidth: '600px',
            }}
          >
            Buy and sell textbooks, electronics, furniture, and more — built for students.
          </span>
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #fbbf24, #f97316, #fbbf24)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
