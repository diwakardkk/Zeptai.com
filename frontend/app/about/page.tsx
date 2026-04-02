import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageContent from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About ZeptAI | Healthcare AI for Patient Intake and Clinical Screening",
  description:
    "Learn how ZeptAI is building research-driven healthcare AI for patient intake, clinical screening, conversational AI healthcare workflows, and medical AI solutions.",
  keywords: [
    "healthcare AI",
    "patient intake AI",
    "clinical screening AI",
    "conversational AI healthcare",
    "medical AI solutions",
  ],
  openGraph: {
    title: "About ZeptAI | Healthcare AI for Patient Intake and Clinical Screening",
    description:
      "ZeptAI is a research-driven healthcare AI company building conversational patient intake, structured screening, and doctor-ready clinical summaries.",
    url: "https://www.zeptai.com/about",
    siteName: "ZeptAI",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <AboutPageContent />
      <Footer />
    </main>
  );
}
