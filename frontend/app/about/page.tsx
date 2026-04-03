import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageContent from "@/components/about/AboutPageContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Our Healthcare AI Platform",
  description:
    "Learn how ZeptAI builds healthcare AI for voice-based patient intake, structured clinical summaries, and telemedicine-ready screening workflows.",
  path: "/about",
  keywords: [
    "healthcare AI company",
    "patient intake AI platform",
    "voice AI healthcare company",
    "clinical summary platform",
  ],
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <AboutPageContent />
      <Footer />
    </main>
  );
}
