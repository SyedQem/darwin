import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import MotionProvider from '@/components/MotionProvider';
import { Analytics } from '@vercel/analytics/next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Darwin — Campus Marketplace',
  description: 'The marketplace for verified college students. Buy, sell, and trade safely with real students on your campus.',
  metadataBase: new URL('https://darwinmarketplace.ca'),
  openGraph: {
    title: 'Darwin — Campus Marketplace',
    description: 'The marketplace for verified college students. Buy, sell, and trade safely with real students on your campus.',
    siteName: 'Darwin',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darwin — Campus Marketplace',
    description: 'The marketplace for verified college students. Buy, sell, and trade safely with real students on your campus.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <SmoothScroll />
        <MotionProvider>
          <Navbar />
          <main className="main-content relative z-10">{children}</main>
          <Footer />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}