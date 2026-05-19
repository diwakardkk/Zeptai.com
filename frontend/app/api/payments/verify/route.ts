import crypto from "crypto";
import { NextResponse } from "next/server";
import { getPlanById } from "@/lib/pricing";

export const runtime = "nodejs";

// ── Test payment guard ─────────────────────────────────────────────────────
// The razorpay_test_10 plan is only verifiable when ENABLE_TEST_PAYMENT=true.
const TEST_PLAN_ID = "razorpay_test_10";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      planId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const rawPlanId = String(body.planId ?? "").trim();

    // Block test plan verification unless the env flag is set.
    if (rawPlanId === TEST_PLAN_ID && process.env.ENABLE_TEST_PAYMENT !== "true") {
      return NextResponse.json({ error: "Missing payment verification data." }, { status: 400 });
    }

    const plan = getPlanById(rawPlanId);
    const orderId = String(body.razorpay_order_id ?? "").trim();
    const paymentId = String(body.razorpay_payment_id ?? "").trim();
    const signature = String(body.razorpay_signature ?? "").trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!plan || !orderId || !paymentId || !signature || !keySecret) {
      return NextResponse.json({ error: "Missing payment verification data." }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // timingSafeEqual prevents timing-based signature oracle attacks.
    const expectedBuf = Buffer.from(expectedSignature, "hex");
    const receivedBuf = Buffer.from(signature, "hex");
    const signatureValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!signatureValid) {
      return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
    }

    const redirectUrl = `/pricing/success?plan=${encodeURIComponent(plan.id)}&payment_id=${encodeURIComponent(paymentId)}`;

    return NextResponse.json({
      ok: true,
      redirectUrl,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}

