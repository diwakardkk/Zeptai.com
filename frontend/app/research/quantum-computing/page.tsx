import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Orbit } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";
import { getStatusBadgeClasses, quantumResearchDirections } from "@/lib/siteContent";

export const metadata: Metadata = buildPageMetadata({
  title: "Quantum Computing Research Direction",
  description:
    "See how ZeptAI is building research capability in hybrid quantum-classical algorithms and realistic quantum benchmarking without overstating current maturity.",
  path: "/research/quantum-computing",
  keywords: ["quantum computing research", "hybrid quantum classical", "quantum benchmarking", "ongoing research"],
});

export default function QuantumComputingResearchPage() {
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
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
              <Orbit className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.06]">
              Quantum computing research direction
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              ZeptAI is building credible research capability in quantum algorithms and hybrid methods. We approach quantum research with mathematical and scientific discipline, focusing on fundamental algorithms and evaluation frameworks rather than premature deployment or advantage claims.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {quantumResearchDirections.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-white/75 bg-white/84 p-6 shadow-[0_24px_56px_-44px_rgba(20,32,72,0.42)] backdrop-blur-sm">
                <span className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${getStatusBadgeClasses(item.status.tone)}`}>
                  {item.status.label}
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <p className="mt-3 text-sm leading-7 text-foreground/82">{item.evidence}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}