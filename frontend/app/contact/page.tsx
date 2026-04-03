import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact ZeptAI for Healthcare AI",
  description:
    "Contact ZeptAI to discuss healthcare AI, patient intake AI, voice-based clinical screening, and doctor-ready clinical summaries for your clinic or digital health platform.",
  path: "/contact",
  keywords: [
    "contact healthcare AI company",
    "patient intake AI demo",
    "voice AI healthcare demo",
    "clinical summary software contact",
  ],
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="relative overflow-hidden border-b border-border pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-6 h-72 w-72 rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute right-[-10%] top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Contact ZeptAI</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Talk with us about healthcare AI for voice intake and clinical summaries
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            We work with clinics, hospitals, telemedicine platforms, and digital health teams that
            need better symptom capture, intake automation, and structured doctor-ready summaries.
          </p>
        </div>
      </section>
      <Contact />
      <Footer />
    </main>
  );
}
