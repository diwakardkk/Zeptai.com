import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanionDoctorExperience from "@/components/companion-doctor/CompanionDoctorExperience";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Talk to a Doctor-like AI Companion",
  description:
    "A calm, bilingual ZeptAI voice companion for supportive wellness conversations in Hindi, English, and Hinglish.",
  path: "/companion-doctor",
  keywords: [
    "AI health companion",
    "voice wellness assistant",
    "bilingual healthcare AI",
    "Hindi English voice AI",
  ],
});

type CompanionDoctorPageProps = {
  searchParams?: { mode?: string };
};

export default function CompanionDoctorPage({ searchParams }: CompanionDoctorPageProps) {
  const initialMode = searchParams?.mode === "text" ? "text" : "voice";

  return (
    <main className="min-h-screen bg-background text-foreground pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <CompanionDoctorExperience initialMode={initialMode} />
      <Footer />
    </main>
  );
}