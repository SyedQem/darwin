import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt =
  'Darwin — Buy and sell with people you can trust. A marketplace built for verified college students.';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public/images/logo.jpg'),
    'base64',
  );
  const logoSrc = `data:image/jpeg;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          gap: 36,
        }}
      >
        <img src={logoSrc} width={240} height={240} alt="Darwin logo" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#ffffff',
          }}
        >
          darwin<span style={{ color: '#f97316' }}>.</span>
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: 760,
            textAlign: 'center',
            fontSize: 32,
            lineHeight: 1.35,
            color: 'rgba(255,255,255,0.62)',
          }}
        >
          The marketplace for verified college students.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
