import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PageMotion } from '@/components/page-motion';
import { getSite } from '@/lib/site.mjs';
import { getPublicSettings } from '@/lib/editorial.mjs';
import './globals.css';
import './product.css';
import './refinements.css';
import './motion-and-manuals.css';
import './hero-and-navigation.css';
import './visual-guides.css';
import './business-sectors.css';
import './professional.css';
export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const settings = await getPublicSettings();
  return {
  metadataBase: new URL(site.origin),
  title: { default: settings.seoTitle, template: '%s | ROPULSE' },
  description: settings.seoDescription,
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: { type: 'website', siteName: 'ROPULSE', title: 'Every order. One pulse.', description: 'A modern restaurant ordering pulse.', images: ['/brand/social/ropulse-og-light.png'] },
  twitter: { card: 'summary_large_image', images: ['/brand/social/ropulse-og-light.png'] },
  icons: { icon: '/favicon.svg', apple: '/brand/icons/apple-touch-icon.png' },
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Header navigation={settings.navigation} /><main id="main" tabIndex={-1}><PageMotion>{children}</PageMotion></main><Footer /></body></html>;
}
