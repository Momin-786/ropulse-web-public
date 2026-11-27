import { demoHref, salesEmail } from '@/lib/sales';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { getHomepage } from '@/lib/editorial.mjs';
export const metadata: Metadata = { alternates: { canonical: '/' } };
export default async function Home() {
  const content = await getHomepage();
  return <div className="professional-home">
    <section className="service-hero">
      <div className="container service-spread">
        <div className="service-intro">
          <p className="service-kicker">{content.eyebrow}</p>
          <h1>{content.title}</h1><p className="service-deck">{content.description}</p>
          <div className="home-actions"><a className="button" href={demoHref}>{content.primaryLabel}<Icon name="arrow" size={18} /></a>
            <Link href="/tour">{content.secondaryLabel} ↗</Link></div>
        </div>
        <Link className="kitchen-scene" href="/tour" aria-label="Explore the register product tour">
          <img className="order-photo" src="/images/business/burger.jpg" alt="" width="640" height="427" fetchPriority="high" />
          <div className="kitchen-slip" aria-hidden="true">
            <div className="slip-brand">ROPULSE</div>
            <div className="slip-meta"><span>KITCHEN TICKET</span><span>#042</span></div>
            <strong>1 × House burger</strong><span className="slip-note">Extra cheddar</span>
            <div className="slip-meta slip-bottom"><span>COUNTER</span><span>12:48</span></div>
          </div>
          <span className="scene-tour">Inside the register <Icon name="arrow" size={16} /></span>
        </Link>
      </div>
    </section>
    <section className="home-sectors container business-sectors" aria-labelledby="home-sectors-title"><div className="home-section-heading"><p className="home-eyebrow">Your business</p><div><h2 id="home-sectors-title">{content.sectorsTitle}</h2><p>{content.sectorsDescription}</p></div></div><div className="service-formats"><div className="format-photo" aria-hidden="true" /><ul>{content.sectors.map(sector =>
      <li key={sector.title}><Link href={sector.href}><div><h3>{sector.title}</h3><p>{sector.description}</p></div><Icon name="arrow" size={20} /></Link></li>
    )}</ul></div><Link href="/retail" className="home-retail-link"><span>Ropulse also supports retail businesses.</span><strong>Explore retail <Icon name="arrow" size={17} /></strong></Link></section>
    <section className="home-features" id="platform"><div className="container"><div className="home-section-heading"><p className="home-eyebrow">Register & Backoffice</p><div><h2>{content.featuresTitle}</h2><p>{content.featuresDescription}</p></div></div><div className="home-feature-grid">{content.features.map((feature) => <article className="home-feature" key={feature.title}><div className="home-feature-image"><img src={feature.image} alt={feature.alt} width="1440" height="1000" loading="lazy" /></div><div className="home-feature-copy"><h3>{feature.title}</h3><p>{feature.description}</p><Link href={feature.href} className="text-link">{feature.linkLabel}<Icon name="arrow" size={17} /></Link></div></article>)}</div><p className="home-caption">Real app screens with sample data. Available workflows depend on your release, permissions and branch setup.</p></div></section>
    <section className="home-manual container"><div className="home-manual-copy"><p className="home-eyebrow">User manual</p><h2>{content.manualTitle}</h2><p>{content.manualDescription}</p><nav className="home-manual-links" aria-label="Popular user guides"><Link href="/docs/getting-started">First-branch setup<Icon name="arrow" size={18} /></Link><Link href="/docs/register-and-checkout">Register & checkout<Icon name="arrow" size={18} /></Link><Link href="/docs/hardware-and-printing">Printers, receipts & KOT<Icon name="arrow" size={18} /></Link></nav><Link href="/docs" className="text-link">Browse all guides<Icon name="arrow" size={18} /></Link></div><figure className="home-manual-image"><img src={content.manualImage} alt={content.manualAlt} width="1440" height="1000" loading="lazy" /><figcaption><span className="home-manual-badge"><Icon name="book" size={18} /> Illustrated instructions</span><span>Setup, daily service and troubleshooting</span></figcaption></figure></section>
    <section className="home-faq container"><div><p className="home-eyebrow">Common questions</p><h2>{content.faqsTitle}</h2><Link href="/contact" className="text-link">Ask the team<Icon name="arrow" size={17} /></Link></div><div className="home-faq-list">{content.faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
    <section className="home-contact container"><div><p className="home-eyebrow">Let’s talk</p><h2>{content.ctaTitle}</h2><p>{content.ctaDescription}</p></div><div className="service-contact-actions"><a href={demoHref} className="button">Get a demo <Icon name="arrow" size={18} /></a><a href={demoHref}>{salesEmail}</a></div></section>
  </div>;
}
