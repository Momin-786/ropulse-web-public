'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type TurnstileAPI = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileAPI } }

export function Turnstile({ siteKey, resetKey, onToken }: { siteKey: string; resetKey: number; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    let active = true;
    let id: string;
    try {
      id = api.render(container.current, {
        sitekey: siteKey, action: 'business_enquiry', theme: 'light', size: 'compact',
        'response-field': false,
        callback: (token: string) => { if (active) { setFailed(false); onToken(token); } },
        'expired-callback': () => { if (active) onToken(''); },
        'timeout-callback': () => { if (active) { onToken(''); setFailed(true); } },
        'error-callback': () => { if (active) { onToken(''); setFailed(true); } },
      });
    } catch { setFailed(true); onToken(''); return; }
    return () => { active = false; api.remove(id); };
  }, [ready, siteKey, resetKey, onToken]);
  return <div className="form-full">
    <Script id="cloudflare-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => { setFailed(true); onToken(''); }} />
    <p className="form-note" id="enquiry-security-label">Security check</p>
    <div ref={container} role="group" aria-labelledby="enquiry-security-label" />
    {failed && <p className="field-error" role="alert">The security check could not load or complete. Refresh this page to try again, or email the team.</p>}
  </div>;
}
