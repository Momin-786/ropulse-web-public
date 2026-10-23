'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) return;
    const nodes = [...document.querySelectorAll<HTMLElement>('.section-heading, .resource-card, .capability, .showcase-heading, .help-copy, .flow-list li')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    for (const [index, node] of nodes.entries()) {
      node.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 45}ms`);
      if (node.getBoundingClientRect().top >= window.innerHeight) node.classList.add('reveal-pending');
      observer.observe(node);
    }
    const revealFocused = (event: FocusEvent) => {
      if (event.target instanceof Element) event.target.closest('.reveal-pending')?.classList.remove('reveal-pending');
    };
    const stop = () => nodes.forEach(node => node.classList.remove('reveal-pending'));
    document.addEventListener('focusin', revealFocused);
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); stop(); document.removeEventListener('focusin', revealFocused); media.removeEventListener('change', stop); };
  }, [pathname]);
  return <div key={pathname} className="page-transition">{children}</div>;
}
