import Link from 'next/link';
const sectors = [
  { label: 'Cafés', words: ['café'], detail: 'From the first coffee', kicker: 'A daily ritual', footer: 'Good coffee. Good company.', href: '/restaurant' },
  { label: 'Quick service', words: ['order', 'up'], detail: 'Keep the queue moving', kicker: 'Ready for the rush', footer: 'Every order. Keep it moving.', href: '/restaurant' },
  { label: 'Dine-in', words: ['at your', 'table'], detail: 'Every table in view', kicker: 'Service with a rhythm', footer: 'From welcome to the last table.', href: '/restaurant' },
  { label: 'Multiple branches', words: ['one', 'pulse'], detail: 'A connected operation', kicker: 'Many places. One pulse.', footer: 'Your branches. Working together.', href: '/features' },
];
export function ServiceStrip() {
  return <section className="service-audience business-sectors" aria-labelledby="service-audience-title">
    <div className="container">
      <div className="sectors-heading"><div><span className="small-label">Built around your business</span><h2 id="service-audience-title">Made for the way<br /> you serve.</h2></div><p>From the first coffee to the last table.<br />Find your rhythm with RoPulse.</p></div>
      <ul className="business-sector-grid">{sectors.map((sector, index) => <li key={sector.label}>
        <Link href={sector.href} className="sector-card">
          <div className="sector-art" aria-hidden="true">
            <div className="sector-brandline"><span>0{index + 1} / ROPULSE</span><img src="/brand/logos/ropulse-rp-monogram-white.svg" width="204" height="124" alt="" /></div>
            <span className="sector-kicker">{sector.kicker}</span>
            <span className="sector-lettering">{sector.words.map((word, wordIndex) => <span key={word}>{word}{wordIndex === sector.words.length - 1 && <b>.</b>}</span>)}</span>
            <span className="sector-signoff">{sector.footer}</span>
          </div>
          <div className="sector-caption"><div><h3>{sector.label}</h3><p>{sector.detail}</p></div><span className="sector-arrow" aria-hidden="true">↗</span></div>
        </Link>
      </li>)}</ul>
      <Link href="/retail" className="retail-service-link sectors-retail"><img src="/brand/logos/ropulse-wordmark-dark.svg" alt="RoPulse" width="145" height="24" /><span className="sectors-retail-copy"><small>More than restaurants</small><strong>Running a retail business?</strong></span><span className="sectors-retail-action">Explore RoPulse for retail <span aria-hidden="true">↗</span></span></Link>
    </div>
  </section>;
}
