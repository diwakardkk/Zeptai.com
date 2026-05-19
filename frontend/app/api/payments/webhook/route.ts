import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Legacy webhook endpoint kept for backwards compatibility.
 * The full-featured webhook handler (Firestore storage, idempotency, event
 * processing) lives at /api/razorpay/webhook.
 * Point your Razorpay dashboard webhook URL to /api/razorpay/webhook.
 */
export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    const payload = await req.text();

    if (!webhookSecret) {
      console.error("Razorpay webhook: secret not configured");
      return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    // timingSafeEqual prevents timing-based signature oracle attacks.
    const expectedBuf = Buffer.from(expectedSig, "hex");
    const receivedBuf = Buffer.from(signature, "hex");
    const isValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}

