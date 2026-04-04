import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/seo/site";

const canonicalUrl = new URL(siteConfig.url);
const redirectHosts = new Set<string>(siteConfig.redirectHosts);

function buildCanonicalRedirect(request: NextRequest) {
  const destination = new URL(request.nextUrl.pathname || "/", siteConfig.url);
  destination.search = request.nextUrl.search;
  return destination;
}

export function middleware(request: NextRequest) {
  const { hostname } = request.nextUrl;

  if (redirectHosts.has(hostname)) {
    return NextResponse.redirect(buildCanonicalRedirect(request), 301);
  }

  const response = NextResponse.next();
  const isNetlifyPreviewHost =
    hostname.endsWith(".netlify.app") && hostname !== canonicalUrl.hostname;

  response.headers.set(
    "X-Robots-Tag",
    isNetlifyPreviewHost
      ? "noindex, nofollow, noarchive"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
