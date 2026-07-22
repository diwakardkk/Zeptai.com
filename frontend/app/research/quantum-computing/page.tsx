import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantumResearchPageContent from "@/components/research/QuantumResearchPageContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Quantum Computing Research",
  description:
    "Advancing quantum algorithms, Quantum AI, and practical healthcare applications through reliable, benchmarked, and resource-aware research.",
  path: "/research/quantum-computing",
  keywords: [
    "quantum computing research",
    "Quantum AI for healthcare",
    "variational quantum circuits",
    "quantum encoding methods",
    "ECG signal quantum representation",
    "hybrid quantum classical algorithms",
  ],
});

export default function QuantumComputingResearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <QuantumResearchPageContent />
      <Footer />
    </main>
  );
}