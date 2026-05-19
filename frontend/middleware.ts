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

  // Prevent search-engine indexing of non-canonical preview/staging hostnames.
  const isNetlifyPreviewHost =
    hostname.endsWith(".netlify.app") && hostname !== canonicalUrl.hostname;
  // AWS Amplify branch deployments use *.amplifyapp.com subdomains.
  const isAmplifyPreviewHost =
    hostname.endsWith(".amplifyapp.com") && hostname !== canonicalUrl.hostname;
  const isPreviewHost = isNetlifyPreviewHost || isAmplifyPreviewHost;

  response.headers.set(
    "X-Robots-Tag",
    isPreviewHost
      ? "noindex, nofollow, noarchive"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
