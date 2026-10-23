import Link from 'next/link';
import { Eyebrow } from './marketing';
import { Icon } from './icon';
const screens = {
  dashboard: { image: 'dashboard', label: 'The business view', title: 'See the day taking shape.', text: 'Sales, orders and trends share one view. Confirm the branch and period before you compare.', guide: 'shifts-and-reports', action: 'Understand the reports' },
  products: { image: 'products', label: 'The catalog', title: 'Make the menu recognizable.', text: 'Organize categories, products and choices before your team begins taking orders.', guide: 'products-and-layouts', action: 'Prepare your catalog' },
  customers: { image: 'customers', label: 'Customer context', title: 'Put the right record in view.', text: 'Find the customer and compare history and identifying details before acting.', guide: 'customers-and-loyalty', action: 'Explore customer records' },
  stock: { image: 'stock', label: 'Stock at the branch', title: 'Give every count context.', text: 'Read the quantity on hand, then record a difference or set a counted total deliberately.', guide: 'stock-and-recipes', action: 'Follow the stock guide' },
  staff: { image: 'staff', label: 'Your team', title: 'Prepare people to serve.', text: 'Review staff status and roles, and use the invitation workflow for new team members.', guide: 'business-and-staff', action: 'Prepare staff access' },
  payments: { image: 'payments', label: 'Before the first sale', title: 'Set up accepted methods.', text: 'Check the branch, base currency and enabled methods. Provider processing needs its own verification.', guide: 'prices-and-payment-setup', action: 'Review payment setup' },
};
type ScreenKey = keyof typeof screens;
export function ProductGallery({ area = 'business' }: { area?: 'business' | 'retail' | 'setup' }) {
  const keys: ScreenKey[] = area === 'retail' ? ['stock', 'products', 'customers'] : area === 'setup' ? ['products', 'staff', 'payments'] : ['dashboard', 'products', 'customers'];
  return <section className="section container product-gallery">
    <div className="product-gallery-heading"><div><Eyebrow>Inside RoPulse Backoffice</Eyebrow><h2>{area === 'retail' ? 'The store, beyond the counter.' : area === 'setup' ? 'See what you’re preparing.' : 'The detail behind a smoother day.'}</h2></div><p>Real app screens, with sample data. Explore the workspace, then follow the illustrated guide.</p></div>
    <div className="product-gallery-grid">{keys.map(key => {
      const item = screens[key];
      return <figure className="product-gallery-card" key={key}>
        <a className="gallery-image-link" href={`/images/product/backoffice-${item.image}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${key} screenshot in a new tab`}><img src={`/images/product/backoffice-${item.image}.png`} width="1440" height="1000" loading="lazy" alt={`Actual RoPulse Backoffice ${key} screen with demonstration records`} /></a>
        <figcaption><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p><Link href={`/docs/${item.guide}`} className="text-link">{item.action} <Icon name="arrow" size={17} /></Link></figcaption>
      </figure>;
    })}</div>
    <p className="product-gallery-note">Demonstration interface · availability depends on your installed release, permissions and branch configuration. Open a screen to see the complete image.</p>
  </section>;
}
