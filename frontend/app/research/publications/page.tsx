import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";
import { getStatusBadgeClasses, researchPublications } from "@/lib/siteContent";

export const metadata: Metadata = buildPageMetadata({
  title: "Research Publications",
  description:
    "Read ZeptAI's published research references in conversational AI and interpretable medical imaging.",
  path: "/research/publications",
  keywords: ["AI publications", "research publications", "conversational AI paper", "medical imaging paper"],
});

export default function ResearchPublicationsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="relative overflow-hidden pb-20 pt-28 md:pb-24 md:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-[#224bc3]/10 blur-[130px]" />
          <div className="absolute right-[-12%] top-10 h-96 w-96 rounded-full bg-[#38ac06]/10 blur-[150px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/research" className="inline-flex items-center gap-2 text-sm font-semibold text-[#224bc3]">
            <ArrowLeft className="h-4 w-4" />
            Back to Research
          </Link>

          <div className="mt-5 rounded-[2rem] border border-white/75 bg-white/84 p-7 shadow-[0_30px_70px_-46px_rgba(20,32,72,0.48)] backdrop-blur-sm sm:p-9">
            <p className="inline-flex rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3]">
              Publications
            </p>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.06]">
              Published research references
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              These publications represent ZeptAI&apos;s public research foundation. They are separated here from ongoing and conceptual work so the research record remains clear.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {researchPublications.map((paper) => (
              <article key={paper.doi} className="rounded-[1.8rem] border border-white/75 bg-white/84 p-6 shadow-[0_24px_56px_-44px_rgba(20,32,72,0.42)] backdrop-blur-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${getStatusBadgeClasses(paper.status.tone)}`}>
                      {paper.status.label}
                    </span>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{paper.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-foreground/82">{paper.journal} • {paper.year}</p>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">doi:{paper.doi}</p>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">{paper.summary}</p>
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#224bc3]"
                >
                  Open publication <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}