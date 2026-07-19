import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsOverviewContent from "@/components/projects/ProjectsOverviewContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects and Product Systems",
  description:
    "Explore ZeptAI's product systems, prototypes, and workflow-oriented deployment approach for conversational healthcare AI.",
  path: "/projects",
  keywords: [
    "healthcare AI product",
    "conversational health AI",
    "AI workflow product",
    "pilot-ready healthcare AI",
  ],
});

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <ProjectsOverviewContent />
      <Footer />
    </main>
  );
}