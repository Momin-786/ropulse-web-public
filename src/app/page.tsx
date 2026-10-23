import type { Metadata } from 'next';
import Link from 'next/link';
import { CTA, CapabilityGrid, Eyebrow } from '@/components/marketing';
import { Icon } from '@/components/icon';
import { ProductPreview } from '@/components/product-preview';
import { ServiceStrip } from '@/components/service-strip';
import { ProductGallery } from '@/components/product-gallery';
export const metadata: Metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return <>
    <section className="hero hero-product container">
      <div className="hero-copy"><Eyebrow>The rhythm behind your restaurant</Eyebrow><h1>Every order.<br /><span>One pulse.</span></h1><p className="hero-description">A busy counter. A full dining room.<br className="desktop-break" /> One clearer way to run the day.</p><p className="hero-detail">Bring ordering, service and business oversight into a connected workflow with RoPulse Register and Backoffice.</p><div className="hero-actions"><Link href="/demo" className="button">Book a demo <Icon name="arrow" size={19} /></Link><Link href="/tour" className="text-link">See the app <Icon name="arrow" size={18} /></Link></div><div className="hero-footnote"><span className="tiny-pulse" />Built around the people running your business.</div></div>
      <ProductPreview />
    </section>
    <ServiceStrip />
    <section className="section container" id="platform"><div className="section-heading"><div><Eyebrow>One connected working day</Eyebrow><h2>Less to juggle.<br />More room to focus.</h2></div><p>Give the counter a clear next step.<br />Give the manager the context behind it.<br />Keep the business moving together.</p></div><CapabilityGrid /><p className="availability-note">Workflows depend on the installed release, business configuration and supported devices. We’ll confirm the right setup for your branch.</p></section>
    <section className="story-section"><div className="container story-grid"><div><Eyebrow>From the first tap to the last report</Eyebrow><h2>A good day starts<br />with a clear flow.</h2><p>Taking an order, recording a payment and printing a receipt are different steps. RoPulse helps your team understand each one, and follow the original record when something needs attention.</p><Link href="/restaurant" className="text-link">See the restaurant workflow <Icon name="arrow" size={18} /></Link></div><ol className="flow-list">{[['Take the order', 'Products, options and service context.'], ['Keep service informed', 'Tables, preparation tickets and supported routing.'], ['Complete the sale', 'Tender, references and the original receipt.'], ['Understand the day', 'Shift reconciliation and branch reports.']].map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Icon name={['terminal', 'ticket', 'shield', 'chart'][i]} size={24} /></li>)}</ol></div></section>
    <section className="section container help-feature"><div className="manual-cover"><img src="/brand/logos/ropulse-wordmark-light.svg" alt="ROPULSE" width="175" height="28" /><span className="manual-edition">THE PRACTICAL GUIDE</span><h2>A confident<br />first day.<br /><span>And every<br />day after.</span></h2><div><Icon name="book" size={26} /><span>Setup · Service · Management</span></div></div><div className="help-copy"><Eyebrow>Help that follows the task</Eyebrow><h2>A manual your<br />whole team can use.</h2><p>From setting up your first branch to checking a payment reference, find practical instructions written around the job in front of you.</p><div className="role-links"><Link href="/get-started"><span>01</span><div><strong>For owners</strong><small>Prepare your business and first branch</small></div><Icon name="arrow" size={20} /></Link><Link href="/docs?role=service"><span>02</span><div><strong>For the service team</strong><small>Orders, checkout and receipts</small></div><Icon name="arrow" size={20} /></Link><Link href="/docs?role=manager"><span>03</span><div><strong>For managers</strong><small>Staff, closing and investigation</small></div><Icon name="arrow" size={20} /></Link></div><Link href="/docs" className="text-link">Open the user manual <Icon name="arrow" size={18} /></Link></div></section>
    <ProductGallery />
    <CTA />
  </>;
}
