import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Darwin — Campus Marketplace',
  description: 'Buy and sell within your campus community. Textbooks, electronics, furniture, and more.',
  metadataBase: new URL('https://darwinmarket.ca'),
  openGraph: {
    title: 'Darwin — Campus Marketplace',
    description: 'Buy and sell within your campus community. Textbooks, electronics, furniture, and more.',
    siteName: 'Darwin',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darwin — Campus Marketplace',
    description: 'Buy and sell within your campus community. Textbooks, electronics, furniture, and more.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <SmoothScroll />
        <Navbar />
        <main className="main-content relative z-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}