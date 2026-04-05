"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  CreditCard,
  Crown,
  QrCode,
  Smartphone,
  Stethoscope,
  TestTube2,
} from "lucide-react";
import CustomizePlanModal, { calculateCustomPricing } from "@/components/pricing/CustomizePlanModal";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const clinicTiers = [
  {
    id: "basic",
    name: "Basic",
    reports: 200,
    doctors: 1,
    pricePerReport: 30,
    total: 6000,
  },
  {
    id: "pro",
    name: "Pro",
    reports: 500,
    doctors: 2,
    pricePerReport: 20,
    total: 10000,
  },
] as const;

type CustomizablePlan = "clinic" | "enterprise";

export default function PricingPageContent() {
  const [activeTierId, setActiveTierId] = useState<(typeof clinicTiers)[number]["id"]>("pro");
  const [customizePlan, setCustomizePlan] = useState<CustomizablePlan | null>(null);
  const [paymentNotice, setPaymentNotice] = useState("");

  const activeClinicTier = useMemo(
    () => clinicTiers.find((tier) => tier.id === activeTierId) ?? clinicTiers[1],
    [activeTierId],
  );

  const modalDefaults = useMemo(() => {
    if (customizePlan === "clinic") {
      return {
        planName: "Clinic Plan",
        doctors: activeClinicTier.doctors,
        reports: activeClinicTier.reports,
      };
    }

    return {
      planName: "Enterprise API Plan",
      doctors: 4,
      reports: 1000,
    };
  }, [activeClinicTier.doctors, activeClinicTier.reports, customizePlan]);

  const openPayPlaceholder = ({
    planName,
    doctors,
    reports,
  }: {
    planName: string;
    doctors: number;
    reports: number;
  }) => {
    const estimate = calculateCustomPricing(reports);
    setPaymentNotice(
      `${planName}: ${reports} reports for ${doctors} doctor${doctors > 1 ? "s" : ""} estimated at ${estimate.estimatedCostText}. Payment UI is ready for Razorpay, UPI, and Cards; backend payment wiring can be connected next.`,
    );
  };

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-[radial-gradient(circle_at_top_left,rgba(56,172,6,0.16),transparent_55%),radial-gradient(circle_at_top_right,rgba(34,75,195,0.2),transparent_56%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-white/85 px-4 py-1 text-xs font-semibold uppercase tracking-[0.17em] text-[#224bc3]">
              ZeptAI Pricing
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-black md:text-6xl">
              Premium SaaS Pricing for Healthcare AI
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-black/65">
              Choose a plan that matches your report volume. Built for clinics first, and scalable
              for enterprise API rollouts with flexible pricing in INR.
            </p>
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border border-black/10 bg-[#fffffa]/85 p-5 text-sm text-black/60 shadow-[0_24px_60px_-42px_rgba(0,0,0,0.45)] backdrop-blur md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white/90 px-4 py-4">
              <div className="font-semibold text-black">Razorpay Ready</div>
              <div className="mt-1">Hosted checkout slot prepared on UI</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/90 px-4 py-4">
              <div className="font-semibold text-black">INR Per Report</div>
              <div className="mt-1">Simple and transparent pricing slabs</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/90 px-4 py-4">
              <div className="font-semibold text-black">Scale Anytime</div>
              <div className="mt-1">Customize doctor and report usage instantly</div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <section className="rounded-[2rem] border border-black/10 bg-[#fffffa]/90 p-6 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgba(0,0,0,0.55)]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#38ac06]/10 text-[#38ac06]">
                <TestTube2 className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">Trial Plan</p>
              <h2 className="mt-2 text-2xl font-bold text-black">Start Fast</h2>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Entry-level plan to test patient intake and summary quality with minimal setup.
              </p>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white/90 p-4">
                <p className="text-sm text-black/55">Pricing</p>
                <p className="mt-1 text-3xl font-extrabold text-black">₹0</p>
                <p className="text-sm text-black/60">50 reports included (trial)</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-black/75">
                {["50 AI reports", "Voice-based intake", "Basic summaries"].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#38ac06]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#38ac06] to-[#224bc3] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(34,75,195,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(34,75,195,0.85)]"
              >
                Start Trial
              </Link>
            </section>

            <section className="relative rounded-[2rem] border border-[#224bc3]/30 bg-gradient-to-b from-white/95 to-[#fffffa]/95 p-6 shadow-[0_22px_60px_-36px_rgba(34,75,195,0.7)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-34px_rgba(34,75,195,0.65)]">
              <span className="absolute -top-3 right-5 inline-flex items-center gap-1.5 rounded-full border border-[#224bc3]/25 bg-[#224bc3] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-white">
                <Crown className="h-3.5 w-3.5" />
                Most Popular
              </span>

              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
                <Stethoscope className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">Clinic Plan</p>
              <h2 className="mt-2 text-2xl font-bold text-black">For Growing Clinics</h2>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Choose between Basic and Pro based on your monthly report volume.
              </p>

              <div className="mt-6 grid gap-2.5">
                {clinicTiers.map((tier) => {
                  const isActive = tier.id === activeTierId;
                  return (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => setActiveTierId(tier.id)}
                      className={`rounded-2xl border p-3.5 text-left transition ${
                        isActive
                          ? "border-[#224bc3]/45 bg-[#224bc3]/10 shadow-[0_14px_28px_-22px_rgba(34,75,195,0.9)]"
                          : "border-black/10 bg-white/85 hover:border-[#224bc3]/25 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-black">{tier.name}</p>
                        <p className="text-sm font-semibold text-[#224bc3]">₹{tier.pricePerReport}/report</p>
                      </div>
                      <p className="mt-1 text-xs text-black/60">
                        {tier.reports} reports · {formatInr(tier.total)} · {tier.doctors}{" "}
                        {tier.doctors > 1 ? "doctors" : "doctor"}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-black/10 bg-white/90 p-4">
                <p className="text-sm text-black/55">Selected tier total</p>
                <p className="mt-1 text-3xl font-extrabold text-black">{formatInr(activeClinicTier.total)}</p>
                <p className="text-sm text-black/60">
                  {activeClinicTier.reports} reports at ₹{activeClinicTier.pricePerReport}/report
                </p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-black/75">
                {[
                  "Structured summaries",
                  "Up to 2 doctors",
                  "Faster processing",
                  "Dashboard support",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#38ac06]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setCustomizePlan("clinic")}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#224bc3]/30 bg-white px-5 text-sm font-semibold text-[#224bc3] transition hover:bg-[#224bc3]/10"
                >
                  Customize Plan
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openPayPlaceholder({
                      planName: "Clinic Plan",
                      doctors: activeClinicTier.doctors,
                      reports: activeClinicTier.reports,
                    })
                  }
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#38ac06] to-[#224bc3] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(34,75,195,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(34,75,195,0.85)]"
                >
                  Pay Now
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-black/10 bg-[#fffffa]/90 p-6 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgba(0,0,0,0.55)]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">
                Enterprise API Plan
              </p>
              <h2 className="mt-2 text-2xl font-bold text-black">Scale with API</h2>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Built for hospitals and digital health products needing custom workflows and deep
                integrations.
              </p>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white/90 p-4">
                <p className="text-sm text-black/55">Pricing range</p>
                <p className="mt-1 text-3xl font-extrabold text-black">₹15 - ₹25</p>
                <p className="text-sm text-black/60">per report for 1000+ reports</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-black/75">
                {[
                  "API integration",
                  "Custom workflows",
                  "Scalable usage",
                  "Priority support",
                  "Unlimited doctors",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#38ac06]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setCustomizePlan("enterprise")}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#224bc3]/30 bg-white px-5 text-sm font-semibold text-[#224bc3] transition hover:bg-[#224bc3]/10"
                >
                  Customize Plan
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openPayPlaceholder({
                      planName: "Enterprise API Plan",
                      doctors: 5,
                      reports: 1000,
                    })
                  }
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#38ac06] to-[#224bc3] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(34,75,195,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(34,75,195,0.85)]"
                >
                  Pay Now
                </button>
              </div>
            </section>
          </div>

          {paymentNotice && (
            <div className="mt-6 rounded-2xl border border-[#224bc3]/25 bg-white/90 px-5 py-4 text-sm text-black/70">
              {paymentNotice}
            </div>
          )}

          <section className="mt-10 rounded-[2rem] border border-black/10 bg-[#fffffa]/85 p-8 shadow-[0_24px_50px_-40px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-bold tracking-tight text-black">Payment Readiness</h2>
            <p className="mt-2 text-sm leading-7 text-black/65">
              Payment actions are wired as UI placeholders, ready for backend integration with
              Razorpay checkout.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/90 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#224bc3]/10">
                  <Smartphone className="h-5 w-5 text-[#224bc3]" />
                </div>
                <h3 className="font-semibold text-black">Razorpay</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  Hosted checkout integration slot is prepared.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/90 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#224bc3]/10">
                  <QrCode className="h-5 w-5 text-[#224bc3]" />
                </div>
                <h3 className="font-semibold text-black">UPI</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  Ready for UPI intent and QR-based payment flows.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/90 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#224bc3]/10">
                  <CreditCard className="h-5 w-5 text-[#224bc3]" />
                </div>
                <h3 className="font-semibold text-black">Cards</h3>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  Supports debit and credit card checkout paths.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
              <p>Need procurement-friendly pricing for multi-clinic deployments?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold text-[#224bc3] transition hover:text-[#224bc3]/80"
              >
                Talk to ZeptAI <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </section>

      <CustomizePlanModal
        open={Boolean(customizePlan)}
        planName={modalDefaults.planName}
        defaultDoctors={modalDefaults.doctors}
        defaultReports={modalDefaults.reports}
        onClose={() => setCustomizePlan(null)}
        onPayNow={({ planName, doctors, reports }) => {
          openPayPlaceholder({ planName, doctors, reports });
          setCustomizePlan(null);
        }}
      />
    </>
  );
}
