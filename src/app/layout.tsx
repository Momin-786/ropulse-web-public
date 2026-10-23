import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PageMotion } from '@/components/page-motion';
import { getSite } from '@/lib/site.mjs';
import './globals.css';
import './product.css';
import './refinements.css';
import './motion-and-manuals.css';
import './hero-and-navigation.css';
import './visual-guides.css';
import './business-sectors.css';
const site = getSite();
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: 'ROPULSE — Every order. One pulse.', template: '%s | ROPULSE' },
  description: 'Explore RoPulse restaurant and retail workflows, prepare your first branch, and find practical help for your team.',
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: { type: 'website', siteName: 'ROPULSE', title: 'Every order. One pulse.', description: 'A modern restaurant ordering pulse.', images: ['/brand/social/ropulse-og-light.png'] },
  twitter: { card: 'summary_large_image', images: ['/brand/social/ropulse-og-light.png'] },
  icons: { icon: '/favicon.svg', apple: '/brand/icons/apple-touch-icon.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" tabIndex={-1}><PageMotion>{children}</PageMotion></main><Footer /></body></html>;
}
