import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageContent from "@/components/about/AboutPageContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About ZeptAI",
  description:
    "Learn how ZeptAI positions its work across applied AI, healthcare technology, and ongoing quantum computing research.",
  path: "/about",
  keywords: [
    "research-led technology company",
    "healthcare AI company",
    "quantum computing research company",
    "AI and healthcare innovation",
  ],
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 selection:text-white">
      <Navbar />
      <AboutPageContent />
      <Footer />
    </main>
  );
}
