"use client";

import { useMemo } from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const gatewayConfig = {
  name: "Razorpay",
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YOUR_KEY",
  currency: "INR",
  themeColor: "#224bc3",
};

const plans = [
  {
    id: "basic",
    name: "Starter",
    price: 999,
    description: "Designed for pilot programs and small clinics.",
    features: [
      "Voice-based patient intake",
      "Structured prescreening reports",
      "Secure patient data storage support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 2499,
    description: "Best for growing hospitals and multi-doctor clinics.",
    features: [
      "Advanced workflow automation",
      "Medication and history capture",
      "Priority onboarding support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 4999,
    description: "Custom deployment and enterprise-grade support.",
    features: [
      "Dedicated implementation",
      "Custom integration support",
      "Team training and analytics",
    ],
  },
];

const openCheckout = (plan: typeof plans[number]) => {
  if (!window || !window.Razorpay) {
    window.alert("Payment service is not ready yet. Please refresh the page.");
    return;
  }

  const options = {
    key: gatewayConfig.key,
    amount: plan.price * 100,
    currency: gatewayConfig.currency,
    name: "ZeptAI",
    description: plan.description,
    image: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/logo.png",
    handler: function (response: any) {
      window.alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    },
    theme: { color: gatewayConfig.themeColor },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

export default function PricingPage() {
  const gatewayNote = useMemo(
    () =>
      gatewayConfig.key === "rzp_test_YOUR_KEY"
        ? "Update NEXT_PUBLIC_RAZORPAY_KEY in .env.local to enable live checkout."
        : `Using ${gatewayConfig.name} test mode.`,
    []
  );

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <Navbar />
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider">
              Pricing Plans
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Simple pricing for healthcare teams</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your clinic or hospital. Each tier is built to scale with your patient intake needs.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{gatewayNote}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-[2rem] border border-border bg-card p-8 shadow-lg shadow-primary/5">
                <div className="flex items-baseline gap-2 text-foreground">
                  <span className="text-5xl font-extrabold">₹{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-foreground">{plan.name}</h2>
                <p className="mt-3 text-muted-foreground">{plan.description}</p>

                <ul className="mt-8 space-y-4 text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openCheckout(plan)}
                  className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Pay with {gatewayConfig.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-background p-8 text-muted-foreground">
            <h3 className="text-xl font-semibold text-foreground">Easy updates</h3>
            <p className="mt-4">
              To change pricing, edit the `plans` array and the `gatewayConfig` object in <span className="font-mono text-sm text-foreground">app/pricing/page.tsx</span>. The payment gateway is configured as a single object so you can switch providers quickly.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
