import Link from 'next/link';
import './printer-guide-feature.css';
export function PrinterGuideFeature() {
  return <Link href="/docs/hardware-and-printing" className="printer-guide-feature">
    <span className="printer-guide-thumbnail"><img src="/images/product/printer-receipt-setup.png" width="1440" height="1000" alt="" loading="lazy" /></span>
    <span className="printer-guide-feature-copy"><span className="small-label">Installation & daily service</span><strong>Printer and kitchen ticket setup</strong><span>Connect your printer, check receipts, route KOTs and bind the right device. Follow the illustrated setup and recovery guide.</span><span className="printer-guide-feature-action">Open the printer & KOT guide <span aria-hidden="true">↗</span></span></span>
  </Link>;
}
