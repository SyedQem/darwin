import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Darwin — Campus Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fetch a single Google font weight, scoped to the glyphs we render, as a TTF
// (Google serves truetype when the request lacks a woff2-capable UA). Returns
// null on any failure so the card still renders with the default font.
async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const display = await loadGoogleFont(
    'Space Grotesk',
    700,
    'darwin.Your campus marketplace',
  );

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
          fontFamily: display ? 'Space Grotesk' : 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Warm brand glow — top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-120px',
            width: '620px',
            height: '620px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)',
          }}
        />
        {/* Fainter amber glow — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-140px',
            left: '-100px',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontSize: '42px',
              fontWeight: 700,
              color: '#f4f4f5',
              letterSpacing: '-0.03em',
            }}
          >
            darwin
          </span>
          <span style={{ fontSize: '42px', fontWeight: 700, color: '#f97316' }}>.</span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span
            style={{
              fontSize: '76px',
              fontWeight: 700,
              color: '#f4f4f5',
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              maxWidth: '760px',
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
              letterSpacing: '-0.01em',
              maxWidth: '640px',
              fontFamily: 'sans-serif',
            }}
          >
            Verified students buy, sell &amp; exchange — safely, on campus.
          </span>
        </div>

        {/* Domain */}
        <span
          style={{
            marginTop: '44px',
            fontSize: '22px',
            fontWeight: 500,
            color: '#71717a',
            letterSpacing: '0.02em',
            fontFamily: 'sans-serif',
          }}
        >
          darwinmarketplace.ca
        </span>

        {/* Bottom accent bar */}
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
    {
      ...size,
      fonts: display
        ? [{ name: 'Space Grotesk', data: display, weight: 700, style: 'normal' }]
        : undefined,
    },
  );
}
