import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingPageContent from "@/components/pricing/PricingPageContent";

export const metadata: Metadata = {
  title: "ZeptAI Pricing | Per-Report Pricing for Clinics and Enterprise APIs",
  description:
    "Explore ZeptAI pricing for clinics and enterprise healthcare platforms. Pay per report with launch offers, Razorpay checkout, UPI, QR scan, and card payments.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <PricingPageContent />
      <Footer />
    </main>
  );
}
