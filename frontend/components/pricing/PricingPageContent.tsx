"use client";

import { useState } from "react";
import Script from "next/script";
import {
  ArrowRight,
  BadgeIndianRupee,
  Binary,
  Building2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { getLaunchPackTotal, getStandardPackTotal, pricingPlans } from "@/lib/pricing";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const iconMap = {
  clinic: <Stethoscope className="h-5 w-5 text-primary" />,
  enterprise_api: <Building2 className="h-5 w-5 text-primary" />,
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PricingPageContent() {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  async function openCheckout(planId: string) {
    setError("");
    setLoadingPlanId(planId);

    try {
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const orderPayload = (await orderResponse.json()) as {
        error?: string;
        keyId?: string;
        order?: { id: string; amount: number; currency: string };
        plan?: { id: string; name: string; reportCredits: number };
      };

      if (!orderResponse.ok || !orderPayload.order || !orderPayload.keyId || !orderPayload.plan) {
        throw new Error(orderPayload.error || "Unable to start payment.");
      }

      if (!window.Razorpay) {
        throw new Error("Payment checkout is not ready. Refresh and try again.");
      }

      const checkout = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.order.amount,
        currency: orderPayload.order.currency,
        name: "ZeptAI",
        description: `${orderPayload.plan.name} · ${orderPayload.plan.reportCredits} report credits`,
        image:
          "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/logo.png",
        order_id: orderPayload.order.id,
        theme: { color: "#224bc3" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        notes: {
          plan_id: orderPayload.plan.id,
          product: "ZeptAI report credits",
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              planId: orderPayload.plan?.id,
              ...response,
            }),
          });

          const verifyPayload = (await verifyResponse.json()) as {
            ok?: boolean;
            redirectUrl?: string;
            error?: string;
          };

          if (!verifyResponse.ok || !verifyPayload.ok || !verifyPayload.redirectUrl) {
            throw new Error(verifyPayload.error || "Payment verification failed.");
          }

          window.location.href = verifyPayload.redirectUrl;
        },
      });

      checkout.open();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start payment right now.",
      );
    } finally {
      setLoadingPlanId(null);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Per-Report Pricing
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Usage-Based Pricing for Healthcare AI
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              ZeptAI pricing is built around report credits. Both plans start at
              a standard rate of about <strong>$1 per report</strong>, with
              launch offers for clinics and enterprise pilots.
            </p>
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground md:grid-cols-4">
            <div className="rounded-2xl bg-background px-4 py-4">
              <div className="font-semibold text-foreground">Razorpay Checkout</div>
              <div className="mt-1">Secure hosted payment flow</div>
            </div>
            <div className="rounded-2xl bg-background px-4 py-4">
              <div className="font-semibold text-foreground">UPI + QR Scan</div>
              <div className="mt-1">Fast payment on desktop and mobile</div>
            </div>
            <div className="rounded-2xl bg-background px-4 py-4">
              <div className="font-semibold text-foreground">Credit / Debit Cards</div>
              <div className="mt-1">Card and netbanking supported</div>
            </div>
            <div className="rounded-2xl bg-background px-4 py-4">
              <div className="font-semibold text-foreground">Per-Report Credits</div>
              <div className="mt-1">Simple pricing for direct usage</div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {pricingPlans.map((plan) => {
              const launchTotal = getLaunchPackTotal(plan);
              const standardTotal = getStandardPackTotal(plan);
              const isLoading = loadingPlanId === plan.id;

              return (
                <section
                  key={plan.id}
                  className="rounded-[2rem] border border-border bg-card p-8 shadow-lg shadow-primary/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {iconMap[plan.id]}
                        {plan.shortLabel}
                      </span>
                      <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground">
                        {plan.name}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-right">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Standard Rate
                      </div>
                      <div className="mt-1 text-lg font-bold text-foreground">$1 / report</div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-background p-5 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Launch Offer
                      </div>
                      <div className="mt-2 flex flex-wrap items-end gap-3">
                        <span className="text-4xl font-extrabold tracking-tight text-foreground">
                          {formatInr(launchTotal)}
                        </span>
                        <span className="rounded-full bg-secondary/60 px-3 py-1 text-sm text-muted-foreground">
                          {formatInr(plan.launchPricePerReportInr)} / report
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <span className="line-through">{formatInr(standardTotal)}</span>{" "}
                        regular pricing for {plan.reportCredits} reports
                      </div>
                    </div>
                    <div className="rounded-2xl bg-secondary/25 px-4 py-4 text-sm text-muted-foreground">
                      <div className="font-semibold text-foreground">{plan.reportCredits} report credits</div>
                      <div className="mt-1">{plan.highlight}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-background/80 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Delivery
                      </div>
                      <div className="mt-2 text-sm font-medium text-foreground">
                        {plan.deliveryLabel}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/80 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Support
                      </div>
                      <div className="mt-2 text-sm font-medium text-foreground">
                        {plan.supportLabel}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => openCheckout(plan.id)}
                    disabled={isLoading}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Opening checkout..." : plan.ctaLabel}
                  </button>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Razorpay checkout supports UPI, QR scan, debit cards, credit cards, and netbanking.
                  </p>
                </section>
              );
            })}
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <section className="mt-12 rounded-[2rem] border border-border bg-background p-8 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              What the pricing means
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <BadgeIndianRupee className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Per-report billing</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Every paid report credit maps to a generated patient intake summary or report.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <Binary className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">FastAPI-backed workflow</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The same backend logic powers intake capture, summarization, and report generation.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Secure hosted payments</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Users pay through Razorpay checkout with support for UPI scan, cards, and Indian payment methods.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>Need custom volume pricing or hospital procurement support?</p>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Talk to ZeptAI <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-border bg-secondary/10 p-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Payment methods available at checkout
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background px-5 py-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <QrCode className="h-5 w-5 text-primary" />
                </div>
                <div className="font-semibold text-foreground">UPI + QR Scan</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Scan and pay from any supported UPI app during Razorpay checkout.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-5 py-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="font-semibold text-foreground">Credit and Debit Cards</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Accept payments with major credit cards, debit cards, and supported card rails.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-5 py-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="font-semibold text-foreground">Hosted checkout</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  One click opens the secure payment flow without building a separate payment UI.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
