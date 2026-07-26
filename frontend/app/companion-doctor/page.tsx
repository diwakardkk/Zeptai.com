import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConversationalHealthAIContent from "@/components/projects/ConversationalHealthAIContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Conversational Health AI Demo",
  description:
    "Legacy access path for ZeptAI's conversational health AI project demo in voice and text modes.",
  path: "/companion-doctor",
  keywords: [
    "conversational health AI demo",
    "voice healthcare AI",
    "multilingual health assistant",
    "legacy demo route",
  ],
});

type CompanionDoctorPageProps = {
  searchParams?: { mode?: string };
};

export default function CompanionDoctorPage({ searchParams }: CompanionDoctorPageProps) {
  const initialMode = searchParams?.mode === "text" ? "text" : "voice";

  return (
    <>
      <Navbar />
      <ConversationalHealthAIContent initialMode={initialMode} />
      <Footer />
    </>
  );
}