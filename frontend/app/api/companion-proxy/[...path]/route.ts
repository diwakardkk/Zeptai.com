import { NextResponse } from "next/server";

const TARGET_BASE = process.env.NURSE_API_BASE || process.env.NEXT_PUBLIC_NURSE_API_BASE;
const DEFAULT_TIMEOUT = 45_000;
const CLIENT_COOKIE = "companion_client_id";

function buildTargetUrl(pathParts: string[] | undefined, request: Request) {
  if (!TARGET_BASE) return null;
  const url = new URL(request.url);
  const targetPath = (pathParts || []).join("/");
  return `${TARGET_BASE.replace(/\/$/, "")}/${targetPath.replace(/^\/*/, "")}${url.search}`;
}

async function forwardRequest(request: Request, targetUrl: string, clientId: string, shouldSetCookie: boolean) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("content-length");
  headers.set("x-companion-client-id", clientId);

  try {
    const bodyBuffer = request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: bodyBuffer,
      signal: controller.signal,
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set("Cache-Control", "no-store");
    const responseBody = await upstream.arrayBuffer();

    const response = new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
    if (shouldSetCookie) {
      response.cookies.set({
        name: CLIENT_COOKIE,
        value: clientId,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request, { params }: { params: { path?: string[] } }) {
  const target = buildTargetUrl(params?.path, request);
  if (!target) {
    return NextResponse.json({ error: "Companion backend is not configured." }, { status: 500 });
  }
  const cookieValue = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CLIENT_COOKIE}=`))
    ?.split("=", 2)[1];
  const clientId = cookieValue || crypto.randomUUID();
  return forwardRequest(request, target, clientId, !cookieValue);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "POST,OPTIONS" },
  });
}