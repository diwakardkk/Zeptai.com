export type PricingPlan = {
  id: "clinic" | "clinic_basic" | "clinic_pro" | "enterprise_api";
  name: string;
  shortLabel: string;
  audience: string;
  description: string;
  launchPricePerReportInr: number;
  standardPricePerReportInr: number;
  reportCredits: number;
  ctaLabel: string;
  highlight: string;
  deliveryLabel: string;
  supportLabel: string;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  // ── Clinic tiers (match the pricing page UI cards) ────────────────────────
  {
    id: "clinic_basic",
    name: "Clinic Plan — Basic",
    shortLabel: "For individual clinics",
    audience: "Single clinics and small care teams",
    description:
      "Basic clinic plan: 200 report credits at ₹30/report for a single doctor.",
    launchPricePerReportInr: 30,
    standardPricePerReportInr: 30,
    reportCredits: 200,
    ctaLabel: "Pay for Clinic Basic",
    highlight: "200 reports for 1 doctor",
    deliveryLabel: "Web intake + doctor-ready report view",
    supportLabel: "Email onboarding support",
    features: [
      "200 report credits for patient intake and summary generation",
      "Voice-led patient intake on the web",
      "Structured doctor-ready report for each completed case",
      "Built for direct clinic use without custom integration",
      "Ideal for consultation prep, screening, and repeat intake flow",
    ],
  },
  {
    id: "clinic_pro",
    name: "Clinic Plan — Pro",
    shortLabel: "For growing clinics",
    audience: "Growing clinics with multiple doctors",
    description:
      "Pro clinic plan: 500 report credits at ₹20/report for up to 2 doctors.",
    launchPricePerReportInr: 20,
    standardPricePerReportInr: 20,
    reportCredits: 500,
    ctaLabel: "Pay for Clinic Pro",
    highlight: "500 reports for 2 doctors",
    deliveryLabel: "Web intake + doctor-ready report view",
    supportLabel: "Email onboarding support",
    features: [
      "500 report credits for patient intake and summary generation",
      "Voice-led patient intake on the web",
      "Structured doctor-ready report for each completed case",
      "Built for direct clinic use without custom integration",
      "Ideal for high-volume clinics and multi-doctor setups",
    ],
  },
  // ── Legacy single clinic plan (kept for backwards compatibility) ──────────
  {
    id: "clinic",
    name: "Clinic Plan",
    shortLabel: "For individual clinics",
    audience: "Single clinics and small care teams",
    description:
      "A compact web-based intake workflow for clinics that want structured patient reports without a full platform integration.",
    launchPricePerReportInr: 49,
    standardPricePerReportInr: 99,
    reportCredits: 100,
    ctaLabel: "Pay for Clinic Credits",
    highlight: "Launch pack for faster adoption and early pilot use",
    deliveryLabel: "Web intake + doctor-ready report view",
    supportLabel: "Email onboarding support",
    features: [
      "100 report credits for patient intake and summary generation",
      "Voice-led patient intake on the web",
      "Structured doctor-ready report for each completed case",
      "Built for direct clinic use without custom integration",
      "Ideal for consultation prep, screening, and repeat intake flow",
    ],
  },
  {
    id: "enterprise_api",
    name: "Enterprise API Plan",
    shortLabel: "For hospitals and healthcare platforms",
    audience: "Hospitals, telemedicine products, and health startups",
    description:
      "An API-first report generation pack for teams that want ZeptAI intake, summarization, and reporting inside their own workflow.",
    launchPricePerReportInr: 69,
    standardPricePerReportInr: 99,
    reportCredits: 500,
    ctaLabel: "Pay for API Credits",
    highlight: "POC offer for platform evaluation and integration",
    deliveryLabel: "FastAPI-backed intake and report workflow",
    supportLabel: "Priority onboarding and API discussion",
    features: [
      "500 API report credits for structured intake and summary output",
      "FastAPI-backed report generation and doctor-ready summaries",
      "Best fit for telemedicine, hospitals, and healthcare products",
      "Launch-ready for pilot integration and internal validation",
      "Includes higher-volume starting pack for enterprise evaluation",
    ],
  },
];

export function getPlanById(planId: string) {
  return pricingPlans.find((plan) => plan.id === planId);
}

export function getLaunchPackTotal(plan: PricingPlan) {
  return plan.launchPricePerReportInr * plan.reportCredits;
}

export function getStandardPackTotal(plan: PricingPlan) {
  return plan.standardPricePerReportInr * plan.reportCredits;
}

