import { NextRequest, NextResponse } from 'next/server';

const allowedRoots = new Set(['subscriber', 'subscriber-accounts']);

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (!path.length || path.some(segment => segment === '.' || segment === '..') || !allowedRoots.has(path[0])) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Unknown subscriber endpoint.' }, { status: 404 });
  }

  const baseUrl = process.env.SUBSCRIBER_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ code: 'SUBSCRIBER_API_UNAVAILABLE', message: 'Subscriber service is not configured.' }, { status: 503 });
  }

  let target: URL;
  try {
    target = new URL(path.join('/'), `${baseUrl.replace(/\/$/, '')}/`);
    target.search = new URL(request.url).search;
  } catch {
    return NextResponse.json({ code: 'SUBSCRIBER_API_UNAVAILABLE', message: 'Subscriber service is not configured.' }, { status: 503 });
  }

  const headers = new Headers();
  for (const name of ['accept', 'content-type', 'idempotency-key']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const authorization = request.headers.get('authorization');
  const session = request.cookies.get('ropulse_subscriber_session')?.value;
  if (authorization) headers.set('authorization', authorization);
  else if (session) headers.set('authorization', `Bearer ${session}`);

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
    });
    const responseHeaders = new Headers();
    for (const name of ['content-type', 'x-correlation-id']) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    return NextResponse.json({ code: 'SUBSCRIBER_API_UNAVAILABLE', message: 'Subscriber service is temporarily unavailable.' }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
