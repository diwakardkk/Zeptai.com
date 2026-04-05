"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, QrCode, Smartphone, X } from "lucide-react";

export type PricingRange = {
  reportCount: number;
  minRate: number;
  maxRate: number;
  minTotal: number;
  maxTotal: number;
  pricePerReportText: string;
  estimatedCostText: string;
  note: string;
  isRange: boolean;
};

export function calculateCustomPricing(reportCountInput: number): PricingRange {
  const reportCount = Math.max(1, Math.floor(reportCountInput || 0));

  if (reportCount <= 200) {
    const pricePerReport = 30;
    const total = reportCount * pricePerReport;
    return {
      reportCount,
      minRate: pricePerReport,
      maxRate: pricePerReport,
      minTotal: total,
      maxTotal: total,
      pricePerReportText: `₹${pricePerReport} / report`,
      estimatedCostText: formatInr(total),
      note: "Starter clinic volume bracket",
      isRange: false,
    };
  }

  if (reportCount <= 500) {
    const pricePerReport = 20;
    const total = reportCount * pricePerReport;
    return {
      reportCount,
      minRate: pricePerReport,
      maxRate: pricePerReport,
      minTotal: total,
      maxTotal: total,
      pricePerReportText: `₹${pricePerReport} / report`,
      estimatedCostText: formatInr(total),
      note: "Growth clinic volume bracket",
      isRange: false,
    };
  }

  const minRate = 15;
  const maxRate = 25;
  const minTotal = reportCount * minRate;
  const maxTotal = reportCount * maxRate;
  return {
    reportCount,
    minRate,
    maxRate,
    minTotal,
    maxTotal,
    pricePerReportText: `₹${minRate} - ₹${maxRate} / report`,
    estimatedCostText: `${formatInr(minTotal)} - ${formatInr(maxTotal)}`,
    note: "Enterprise volume range (final quote based on workflow and SLA)",
    isRange: true,
  };
}

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type CustomizePlanModalProps = {
  open: boolean;
  planName: string;
  defaultDoctors: number;
  defaultReports: number;
  onClose: () => void;
  onPayNow: (payload: {
    planName: string;
    doctors: number;
    reports: number;
    estimate: PricingRange;
  }) => void;
};

export default function CustomizePlanModal({
  open,
  planName,
  defaultDoctors,
  defaultReports,
  onClose,
  onPayNow,
}: CustomizePlanModalProps) {
  const [doctors, setDoctors] = useState(defaultDoctors);
  const [reports, setReports] = useState(defaultReports);

  useEffect(() => {
    if (!open) return;
    setDoctors(defaultDoctors);
    setReports(defaultReports);
  }, [defaultDoctors, defaultReports, open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  const safeDoctors = Math.max(1, Math.floor(doctors || 0));
  const estimate = useMemo(() => calculateCustomPricing(reports), [reports]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8 sm:px-6">
      <button
        type="button"
        aria-label="Close custom pricing modal"
        className="absolute inset-0 bg-black/35 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Customize your ZeptAI pricing"
        className="relative z-[71] w-full max-w-xl overflow-hidden rounded-3xl border border-[#224bc3]/20 bg-[#fffffa]/95 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.65)]"
      >
        <div className="border-b border-black/10 bg-gradient-to-r from-[#38ac06]/10 via-white/70 to-[#224bc3]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                Custom Pricing
              </p>
              <h3 className="mt-1 text-xl font-bold text-black">Customize {planName}</h3>
              <p className="mt-1 text-sm text-black/65">
                Estimate pricing instantly by doctors and monthly report volume.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/70 transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#224bc3]/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-black/80">Number of doctors</span>
              <input
                type="number"
                min={1}
                value={safeDoctors}
                onChange={(event) => setDoctors(Number(event.target.value))}
                className="h-12 w-full rounded-2xl border border-black/15 bg-white px-4 text-base text-black shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38ac06]/40"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-black/80">Number of reports</span>
              <input
                type="number"
                min={1}
                value={estimate.reportCount}
                onChange={(event) => setReports(Number(event.target.value))}
                className="h-12 w-full rounded-2xl border border-black/15 bg-white px-4 text-base text-black shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#224bc3]/40"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-[#224bc3]/20 bg-white/90 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                  Price Per Report
                </p>
                <p className="mt-1 text-lg font-bold text-[#224bc3]">{estimate.pricePerReportText}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                  Estimated Cost
                </p>
                <p className="mt-1 text-lg font-bold text-black">{estimate.estimatedCostText}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-black/60">{estimate.note}</p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-black/10 bg-[#fffffa] p-4 text-xs text-black/65 sm:grid-cols-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 py-2">
              <QrCode className="h-3.5 w-3.5 text-[#224bc3]" /> UPI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 py-2">
              <CreditCard className="h-3.5 w-3.5 text-[#224bc3]" /> Cards
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 py-2">
              <Smartphone className="h-3.5 w-3.5 text-[#224bc3]" /> Razorpay
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 px-5 text-sm font-semibold text-black/75 transition hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onPayNow({
                planName,
                doctors: safeDoctors,
                reports: estimate.reportCount,
                estimate,
              })
            }
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#38ac06] to-[#224bc3] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(34,75,195,0.95)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-16px_rgba(34,75,195,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#224bc3]/40"
          >
            Pay Now
          </button>
        </div>
      </section>
    </div>
  );
}
