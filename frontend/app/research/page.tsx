import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchPageContent from "@/components/research/ResearchPageContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Research in AI, Healthcare, and Quantum Computing",
  description:
    "Explore ZeptAI research across published AI work, healthcare systems thinking, and ongoing quantum computing directions with transparent status labels.",
  path: "/research",
  keywords: [
    "AI research company",
    "healthcare AI research",
    "quantum computing research",
    "published AI papers",
  ],
});

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <ResearchPageContent />
      <Footer />
    </main>
  );
}