import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPlanById } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Payment Successful | ZeptAI Pricing",
  description:
    "Your ZeptAI payment was received. Review your plan details and contact the team for onboarding or activation.",
};

export default function PricingSuccessPage({
  searchParams,
}: {
  searchParams: { plan?: string; payment_id?: string };
}) {
  const plan = getPlanById(String(searchParams.plan ?? ""));

  return (
    <main className="min-h-screen bg-background text-foreground pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card p-10 shadow-lg shadow-primary/5">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Payment Received
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground">
            Thanks for choosing ZeptAI
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Your payment was verified successfully. Our team can now help you activate
            your {plan ? ` ${plan.name.toLowerCase()}` : ""} and plan the next steps.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-background p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Plan
                </div>
                <div className="mt-2 text-lg font-semibold text-foreground">
                  {plan?.name ?? "ZeptAI Credits"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Payment ID
                </div>
                <div className="mt-2 break-all text-sm font-medium text-foreground">
                  {searchParams.payment_id ?? "Will be shared in Razorpay receipt"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contact ZeptAI for Activation
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Back to Pricing
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

