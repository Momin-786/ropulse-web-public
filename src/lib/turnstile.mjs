// Server-only verification. Never import this module into a client component.
import { siteOrigin } from './site.mjs';

export function turnstileConfigured(env = process.env) {
  return Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() && env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstile(token, { env = process.env, fetcher = fetch } = {}) {
  if (!turnstileConfigured(env)) return { ok: false, status: 503, message: 'The security check is not available yet. Please contact the team by email.' };
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) return { ok: false, status: 400, message: 'Complete the security check and try again.' };
  try {
    const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
    });
    if (!response.ok) throw new Error('Verification unavailable');
    const result = await response.json();
    if (result.success !== true || result.hostname !== new URL(siteOrigin(env.SITE_URL)).hostname || result.action !== 'business_enquiry') {
      return { ok: false, status: 400, message: 'The security check expired or could not be verified. Complete a new check and try again.' };
    }
    return { ok: true, status: 200, message: '' };
  } catch {
    return { ok: false, status: 502, message: 'We could not complete the security check. Please try again or contact the team by email.' };
  }
}
