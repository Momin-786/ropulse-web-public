import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriberSession } from '@/lib/subscriber-session.mjs';

const sessionCookie = 'ropulse_subscriber_session';
const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' };

export async function GET(request: NextRequest) {
  const result = await checkSubscriberSession(request.cookies.get(sessionCookie)?.value);
  const response = NextResponse.json({ authenticated: result.authenticated,
    ...(result.status === 503 ? { message: 'Subscriber service is temporarily unavailable. Please try again.' } : {}) },
    { status: result.status, headers: { 'cache-control': 'no-store' } });
  if (result.clearCookie) response.cookies.set(sessionCookie, '', { ...cookieOptions, maxAge: 0 });
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ authenticated: false }, { headers: { 'cache-control': 'no-store' } });
  response.cookies.set(sessionCookie, '', { ...cookieOptions, maxAge: 0 });
  return response;
}
