import type { Metadata } from 'next';
import { ProductTour } from '@/components/product-tour';
import { CTA, Eyebrow } from '@/components/marketing';
export const metadata: Metadata = { title: 'Inside the app', alternates: { canonical: '/tour' }, description: 'Explore real RoPulse Register screens: product catalog, table service, mobile layout and dark appearance.' };
export default function Tour() {
  return <><section className="container page-intro"><Eyebrow>Inside the app</Eyebrow><h1>See your next<br />working day.</h1><p className="lead">Real screens. Familiar tasks. A closer look at the RoPulse Register.</p></section><section className="container content-section"><ProductTour /><p className="availability-note">Captured from the actual app with demonstration data. Screen availability depends on your installed release, permissions and branch configuration. This preview does not demonstrate a live payment, connected printer or deployed backend.</p></section><CTA /></>;
}
