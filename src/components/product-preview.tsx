import Link from 'next/link';
export function ProductPreview() {
  return <figure className="product-preview">
    <div className="preview-heading"><span className="tiny-pulse" /> THE REAL ROPULSE REGISTER <span>01 / ORDER</span></div>
    <div className="preview-stage"><Link href="/tour" className="preview-screen" aria-label="Explore the real RoPulse Register screens"><img src="/images/product/desktop-light.png" width="1440" height="900" alt="RoPulse Register with a demo order, product categories, item photos and an item quantity panel" fetchPriority="high" /></Link></div>
    <div className="preview-bottom"><span>Built for the next order.</span><Link href="/tour">Take a closer look <span aria-hidden="true">↗</span></Link></div>
    <figcaption>Actual app interface · sample business and order data</figcaption>
  </figure>;
}
