export type PricingPlan = {
  id: "clinic" | "enterprise_api";
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

