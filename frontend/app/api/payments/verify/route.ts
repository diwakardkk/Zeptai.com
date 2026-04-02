import crypto from "crypto";
import { NextResponse } from "next/server";
import { getPlanById } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      planId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const plan = getPlanById(String(body.planId ?? ""));
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

    if (expectedSignature !== signature) {
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

