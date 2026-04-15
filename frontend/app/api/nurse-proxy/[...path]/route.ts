import { NextResponse } from 'next/server';

const TARGET_BASE = process.env.NURSE_API_BASE || process.env.NEXT_PUBLIC_NURSE_API_BASE;
if (!TARGET_BASE) {
  // Allow route to exist but respond with helpful message at runtime.
  console.warn('NURSE_API_BASE is not set. nurse-proxy will return 500 until configured.');
}

const DEFAULT_TIMEOUT = 30_000;

async function forwardRequest(req: Request, targetUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      if (k.toLowerCase() === 'host') return;
      headers[k] = v;
    });

    const body = await req.text();

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body || undefined,
      signal: controller.signal,
    });

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const responseBody = await upstream.arrayBuffer();

    const res = new NextResponse(responseBody, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });

    return res;
  } finally {
    clearTimeout(timeout);
  }
}

function buildTargetUrl(pathParts: string[] | undefined, req: Request) {
  const base = TARGET_BASE;
  if (!base) return null;

  const path = (pathParts || []).join('/');
  const url = new URL(req.url);
  const qs = url.search;

  // Ensure no duplicate slashes
  return `${base.replace(/\/$/, '')}/${path.replace(/^\/*/, '')}${qs}`;
}

export async function GET(req: Request, { params }: { params: { path?: string[] } }) {
  const target = buildTargetUrl(params?.path, req);
  if (!target) return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 });
  return forwardRequest(req, target);
}

export async function POST(req: Request, { params }: { params: { path?: string[] } }) {
  const target = buildTargetUrl(params?.path, req);
  if (!target) return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 });
  return forwardRequest(req, target);
}

export async function PUT(req: Request, { params }: { params: { path?: string[] } }) {
  const target = buildTargetUrl(params?.path, req);
  if (!target) return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 });
  return forwardRequest(req, target);
}

export async function DELETE(req: Request, { params }: { params: { path?: string[] } }) {
  const target = buildTargetUrl(params?.path, req);
  if (!target) return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 });
  return forwardRequest(req, target);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: 'GET,POST,PUT,DELETE,OPTIONS' } });
}
