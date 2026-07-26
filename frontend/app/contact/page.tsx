import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact ZeptAI",
  description:
    "Contact ZeptAI for research collaboration, healthcare AI product discussions, pilot conversations, or broader technical dialogue.",
  path: "/contact",
  keywords: [
    "contact AI research company",
    "healthcare AI collaboration",
    "quantum computing research contact",
    "AI product pilot contact",
  ],
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="relative overflow-hidden border-b border-border pt-16 md:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-6 h-72 w-72 rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute right-[-10%] top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Contact ZeptAI</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Research collaboration, product pilots, and technical conversations
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            Reach out if you want to discuss healthcare AI systems, research collaboration, workflow pilots, or ZeptAI&apos;s broader technical direction.
          </p>
        </div>
      </section>
      <Contact variant="page" />
      <Footer />
    </main>
  );
}
