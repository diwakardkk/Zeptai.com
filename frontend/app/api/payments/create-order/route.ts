import { NextResponse } from "next/server";
import { getLaunchPackTotal, getPlanById } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { planId } = (await req.json()) as { planId?: string };
    const plan = getPlanById(String(planId ?? ""));

    if (!plan) {
      return NextResponse.json({ error: "Invalid pricing plan." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.",
        },
        { status: 500 },
      );
    }

    const amount = getLaunchPackTotal(plan) * 100;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `zeptai_${plan.id}_${Date.now()}`,
        notes: {
          plan_id: plan.id,
          plan_name: plan.name,
          report_credits: String(plan.reportCredits),
          billing_model: "per_report",
        },
      }),
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
        reportCredits: plan.reportCredits,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Unable to create payment order." }, { status: 500 });
  }
}

