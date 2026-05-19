import { NextResponse } from "next/server";
import { getLaunchPackTotal, getPlanById } from "@/lib/pricing";

export const runtime = "nodejs";

// ── Test payment guard ─────────────────────────────────────────────────────
// The razorpay_test_10 plan is only accessible when the server-side env flag
// ENABLE_TEST_PAYMENT=true is set. It is never exposed to the public pricing UI.
const TEST_PLAN_ID = "razorpay_test_10";

export async function POST(req: Request) {
  try {
    const { planId } = (await req.json()) as { planId?: string };

    // Block test plan unless explicitly enabled on the server.
    if (planId === TEST_PLAN_ID && process.env.ENABLE_TEST_PAYMENT !== "true") {
      return NextResponse.json({ error: "Invalid pricing plan." }, { status: 400 });
    }

    const plan = getPlanById(String(planId ?? ""));

    if (!plan) {
      return NextResponse.json({ error: "Invalid pricing plan." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment service is not configured. Please contact support." },
        { status: 500 },
      );
    }

    // Test plan: fixed ₹10 = 1000 paise. Other plans use standard pricing.
    const amount =
      plan.id === TEST_PLAN_ID
        ? 10 * 100 // 1000 paise — exactly ₹10, regardless of plan fields
        : getLaunchPackTotal(plan) * 100;

    const receipt =
      plan.id === TEST_PLAN_ID
        ? `zeptai_test_10_${Date.now()}`
        : `zeptai_${plan.id}_${Date.now()}`;

    const notes =
      plan.id === TEST_PLAN_ID
        ? {
            plan_id: TEST_PLAN_ID,
            plan_name: "Temporary Test Payment",
            billing_model: "test_payment",
          }
        : {
            plan_id: plan.id,
            plan_name: plan.name,
            report_credits: String(plan.reportCredits),
            billing_model: "per_report",
          };

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency: "INR", receipt, notes }),
    });

    const orderPayload = (await orderResponse.json()) as {
      error?: { description?: string };
      id?: string;
      amount?: number;
      currency?: string;
    };

    if (!orderResponse.ok || !orderPayload.id || !orderPayload.amount || !orderPayload.currency) {
      return NextResponse.json(
        { error: orderPayload.error?.description || "Failed to create Razorpay order." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      keyId,
      order: {
        id: orderPayload.id,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
      },
      plan: {
        id: plan.id,
        name: plan.name,
        reportCredits: plan.id === TEST_PLAN_ID ? 0 : plan.reportCredits,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Unable to create payment order." }, { status: 500 });
  }
}

