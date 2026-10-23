'use client';
import { useState } from 'react';
const screens = [
  { id: 'register', label: 'The Register', file: 'desktop-light.png', width: 1440, height: 900, title: 'A place for every item.', text: 'Browse categories, search the catalog and see the order beside the products. The selected item has its own quantity and adjustment controls.', alt: 'Desktop Register showing a sample burger and fries order with product photos and categories' },
  { id: 'tables', label: 'Table service', file: 'floor-1440.png', width: 1440, height: 900, title: 'See the room before the next move.', text: 'The floor view presents tables and their service context. Your floor, table names and available actions depend on your branch configuration and permissions.', alt: 'RoPulse floor view showing four demo tables with their service states' },
  { id: 'mobile', label: 'A smaller screen', file: 'mobile-light.png', width: 390, height: 844, title: 'The same order, a different layout.', text: 'The Register adapts its catalog and order controls to the available space. Confirm your intended device and peripherals during setup.', alt: 'RoPulse Register at phone width with sample products and compact order controls' },
  { id: 'dark', label: 'After hours', file: 'desktop-dark.png', width: 1440, height: 900, title: 'Another way to see the shift.', text: 'A dark appearance keeps the same Register workflow and product context. These are real app renders using the same sample order.', alt: 'Desktop Register in dark appearance with the same demo order and product catalog' },
];
export function ProductTour() {
  const [selected, setSelected] = useState(0);
  const screen = screens[selected];
  return <div className="product-tour">
    <div className="tour-controls" role="group" aria-label="Choose an app screen">{screens.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} aria-controls="tour-screen" onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}</button>)}</div>
    <div id="tour-screen" className="tour-panel"><div className="tour-description" aria-live="polite"><span className="small-label">Inside RoPulse / 0{selected + 1}</span><h2>{screen.title}</h2><p>{screen.text}</p><a href={`/images/product/${screen.file}`} target="_blank" rel="noopener noreferrer" className="text-link">Open full-size image <span className="sr-only">in a new tab</span><span aria-hidden="true">↗</span></a></div>
      <figure className={`tour-image ${screen.id === 'mobile' ? 'tour-phone' : ''}`}><img key={screen.file} src={`/images/product/${screen.file}`} width={screen.width} height={screen.height} alt={screen.alt} /><figcaption>Actual app interface. All names, products and orders shown are sample data.</figcaption></figure>
    </div>
  </div>;
}
