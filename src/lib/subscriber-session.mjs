/** Validate subscriber sessions with the authoritative backend, never cookie presence. */
export async function checkSubscriberSession(token, { baseUrl = process.env.SUBSCRIBER_API_BASE_URL, fetchImpl = fetch } = {}) {
  if (!token) return { authenticated: false, status: 200, clearCookie: false };
  if (!baseUrl) return { authenticated: false, status: 503, clearCookie: false };
  try {
    const response = await fetchImpl(new URL('subscriber/billing/invoices', `${baseUrl.replace(/\/$/, '')}/`), {
      headers: { accept: 'application/json', authorization: `Bearer ${token}` },
      cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    await response.body?.cancel();
    if (response.ok) return { authenticated: true, status: 200, clearCookie: false };
    if ([401, 403].includes(response.status)) return { authenticated: false, status: 200, clearCookie: true };
    return { authenticated: false, status: 503, clearCookie: false };
  } catch {
    return { authenticated: false, status: 503, clearCookie: false };
  }
}
