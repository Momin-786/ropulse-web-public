import { NextRequest, NextResponse } from 'next/server';

const sessionCookie = 'ropulse_subscriber_session';

export function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: Boolean(request.cookies.get(sessionCookie)?.value) });
}

export function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(sessionCookie, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  return response;
}
