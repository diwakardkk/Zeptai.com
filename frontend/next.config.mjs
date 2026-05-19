/** @type {import('next').NextConfig} */

// Content-Security-Policy for Next.js 14 with Firebase client SDK.
//
// Notes:
// - 'unsafe-inline' in script-src: required because Next.js inlines __NEXT_DATA__
//   as a <script> tag. Prefer nonce-based CSP in a future hardening pass.
// - 'unsafe-inline' in style-src: required for Tailwind CSS and Framer Motion
//   inline styles injected at runtime.
// - connect-src includes Firebase/Google APIs used by the client SDK.
// - next/font/google self-hosts fonts, so no external font-src entries are needed.
// - media-src / worker-src blob: required for MediaRecorder audio in companion doctor.
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://raw.githubusercontent.com",
  "font-src 'self'",
  [
    "connect-src 'self'",
    "https://*.googleapis.com",
    "https://*.firebaseio.com",
    "https://*.firebaseapp.com",
    "https://identitytoolkit.googleapis.com",
  ].join(" "),
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: cspHeader },
];

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin", "@google-cloud/firestore"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
