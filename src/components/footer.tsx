import Link from 'next/link';
import { getPublicSettings, getPublicReleases, getPolicies } from '@/lib/editorial.mjs';
export async function Footer() {
  const [site, releases, policies] = await Promise.all([getPublicSettings(), getPublicReleases(), getPolicies()]);
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="RoPulse home"><img src="/brand/logos/ropulse-wordmark-light.svg" width="200" height="32" alt="ROPULSE" /></Link><p>{site.footerDescription}</p><span className="footer-note">From the first order to the closing report.</span></div>
      <div><h2>Explore</h2><Link href="/features">The platform</Link><Link href="/tour">Inside the app</Link><Link href="/restaurant">For restaurants</Link><Link href="/retail">For retail</Link><Link href="/demo">Discuss your setup</Link></div>
      <div><h2>Resources</h2><Link href="/resources">All resources</Link><Link href="/docs">User manual</Link><Link href="/get-started">Getting started</Link>{releases.length > 0 && <><Link href="/downloads">Downloads</Link><Link href="/release-notes">Release notes</Link></>}</div>
      <div><h2>Let’s talk</h2><Link href="/demo">Book a demo</Link><Link href="/contact">Contact</Link><Link href="/support">Get support</Link>{site.supportEmail && <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {site.company || 'ROPULSE'} · Developed by Ebosoft Solutions, Pakistan</span><div><Link href="/legal/privacy">Privacy</Link>{policies.terms.approved && <Link href="/legal/terms">Terms</Link>}{policies["billing-refunds"].approved && <Link href="/legal/billing-refunds">Billing & refunds</Link>}</div></div>
  </div></footer>;
}
