import Link from 'next/link';
import { getSite } from '@/lib/site.mjs';
export function Footer() {
  const site = getSite();
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="RoPulse home"><img src="/brand/logos/ropulse-wordmark-light.svg" width="200" height="32" alt="ROPULSE" /></Link><p>A modern restaurant<br />ordering pulse.</p><span className="footer-note">From the first order to the closing report.</span></div>
      <div><h2>Explore</h2><Link href="/features">The platform</Link><Link href="/tour">Inside the app</Link><Link href="/restaurant">For restaurants</Link><Link href="/retail">For retail</Link><Link href="/pricing">Plans & packages</Link></div>
      <div><h2>Resources</h2><Link href="/resources">All resources</Link><Link href="/docs">User manual</Link><Link href="/get-started">Getting started</Link><Link href="/downloads">Downloads</Link><Link href="/release-notes">Release notes</Link></div>
      <div><h2>Let’s talk</h2><Link href="/demo">Book a demo</Link><Link href="/contact">Contact</Link><Link href="/support">Get support</Link>{site.supportEmail && <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {site.company || 'ROPULSE'} · Developed by Ebosoft Solutions, Pakistan</span><div><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/billing-refunds">Billing & refunds</Link></div></div>
  </div></footer>;
}
