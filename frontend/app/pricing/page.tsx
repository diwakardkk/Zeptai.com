import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingPageContent from "@/components/pricing/PricingPageContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing for Patient Intake AI",
  description:
    "Explore ZeptAI pricing for healthcare AI deployments, voice-based patient intake workflows, and structured clinical summary generation for clinics and digital health teams.",
  path: "/pricing",
  keywords: [
    "patient intake AI pricing",
    "healthcare AI pricing",
    "clinical summary software pricing",
    "voice AI healthcare pricing",
  ],
});

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <PricingPageContent />
      <Footer />
    </main>
  );
}
