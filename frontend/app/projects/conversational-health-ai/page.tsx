import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConversationalHealthAIContent from "@/components/projects/ConversationalHealthAIContent";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Conversational Health AI Project",
  description:
    "See ZeptAI's conversational health AI project, including capabilities, demo experience, and safety framing for real workflow use.",
  path: "/projects/conversational-health-ai",
  keywords: [
    "conversational health AI",
    "voice healthcare AI demo",
    "multilingual health assistant",
    "structured intake system",
  ],
});

export default function ConversationalHealthAIPage() {
  return (
    <>
      <Navbar />
      <ConversationalHealthAIContent initialMode="voice" />
      <Footer />
    </>
  );
}