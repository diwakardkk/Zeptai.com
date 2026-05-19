/**
 * Simple in-memory rate limiter for Next.js API routes.
 *
 * IMPORTANT — serverless caveat:
 * In serverless environments (AWS Lambda, Amplify Hosting, Vercel) each
 * function instance maintains its own in-memory state. This provides
 * per-instance protection only — a burst spread across multiple warm
 * instances can exceed the logical rate limit.
 *
 * For production-grade cross-instance rate limiting, use one of:
 *   - AWS WAF rate-based rules on the CloudFront distribution (recommended)
 *   - @upstash/ratelimit backed by Upstash Redis
 *   - DynamoDB atomic conditional writes (token bucket)
 *
 * This implementation is a last-line-of-defence baseline, not a substitute
 * for infrastructure-level rate limiting.
 */

const WINDOW_MS = 60_000; // 1 minute sliding window
const MAX_REQUESTS = 5;   // max requests per IP per window

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

/**
 * Returns true if the given IP has exceeded the rate limit.
 * Side effect: increments the counter for this IP.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

/**
 * Extract the best-effort client IP from the incoming request headers.
 * AWS Amplify / CloudFront sets X-Forwarded-For; fall back to X-Real-Ip.
 * Returns "unknown" if neither is present (should not happen in production).
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // x-forwarded-for may contain a comma-separated chain; leftmost is the client.
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}
