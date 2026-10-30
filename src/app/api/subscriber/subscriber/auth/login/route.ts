import { NextResponse } from 'next/server';

const sessionCookie = 'ropulse_subscriber_session';

export async function POST(request: Request) {
  const baseUrl = process.env.SUBSCRIBER_API_BASE_URL;
  if (!baseUrl) return NextResponse.json({ code: 'SUBSCRIBER_API_UNAVAILABLE', message: 'Subscriber service is not configured.' }, { status: 503 });

  const response = await fetch(new URL('subscriber/auth/login', `${baseUrl.replace(/\/$/, '')}/`), {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: await request.arrayBuffer(),
    cache: 'no-store',
  }).catch(() => null);
  if (!response) return NextResponse.json({ code: 'SUBSCRIBER_API_UNAVAILABLE', message: 'Subscriber service is temporarily unavailable.' }, { status: 503 });

  const body = await response.json().catch(() => null) as { accessToken?: string } | { code?: string; message?: string } | null;
  if (!response.ok || !body || !('accessToken' in body)) return NextResponse.json(body ?? { code: 'SUBSCRIBER_AUTH_FAILED', message: 'Sign in could not be completed.' }, { status: response.status });

  const result = NextResponse.json({ authenticated: true });
  result.cookies.set(sessionCookie, body.accessToken!, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return result;
}
