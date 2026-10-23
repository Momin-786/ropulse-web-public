'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icon';

const links = [['/features', 'Platform'], ['/restaurant', 'Restaurants'], ['/retail', 'Retail'], ['/pricing', 'Plans'], ['/resources', 'Resources']];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  return <header className="site-header" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); button.current?.focus(); } }}>
    <div className="container header-inner">
      <Link href="/" aria-label="RoPulse home" className="brand"><img src="/brand/logos/ropulse-wordmark-dark.svg" width="177" height="29" alt="ROPULSE" /></Link>
      <button ref={button} type="button" className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      <nav id="main-navigation" aria-label="Main navigation" className={open ? 'main-nav is-open' : 'main-nav'}>
        {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href || (href === '/resources' && ['/docs', '/tour', '/downloads', '/release-notes', '/get-started', '/support'].some(route => pathname === route || pathname.startsWith(`${route}/`))) ? 'page' : undefined}>{label}</Link>)}
        <div className="mobile-nav-actions"><Link href="/login">Sign in</Link><Link href="/demo" className="button button-small">Book a demo <Icon name="arrow" size={17} /></Link></div>
      </nav>
      <div className="header-actions"><Link href="/login" className="sign-in">Sign in</Link><Link href="/demo" className="button button-small">Book a demo <Icon name="arrow" size={17} /></Link></div>
    </div>
  </header>;
}
