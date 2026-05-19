import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Health check endpoint.
 * Returns a minimal JSON response to confirm the service is reachable.
 *
 * IMPORTANT: Do NOT add database status, secret values, environment variable
 * names, or any internal configuration details to this response. It is public.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "zeptai-web",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
