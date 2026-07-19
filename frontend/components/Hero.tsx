import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AbstractHeroVisual from "@/components/hero/AbstractHeroVisual";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border/70 bg-background pt-32 pb-14 md:pt-36 md:pb-18 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[-8%] h-[20rem] w-[20rem] rounded-full bg-[#224bc3]/14 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,75,195,0.10),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(56,172,6,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.055)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-white/78 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3] shadow-[0_18px_40px_-30px_rgba(34,75,195,0.5)] backdrop-blur-sm">
            Research-driven AI &amp; Quantum
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
            Research-Driven AI and
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#224bc3] via-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
              Quantum Technologies for Real-World Impact
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg lg:mx-0">
            ZeptAI is a research-focused technology company developing responsible artificial intelligence for healthcare and advancing applied research in quantum computing. We connect scientific methods, software engineering and real-world needs to create trustworthy digital systems.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/research"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-20px_rgba(34,75,195,0.72)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-18px_rgba(34,75,195,0.82)]"
            >
              Explore Research <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#224bc3]/18 bg-white/75 px-5 py-3 text-sm font-semibold text-foreground shadow-[0_16px_34px_-28px_rgba(20,32,72,0.48)] backdrop-blur-sm transition hover:border-[#224bc3]/35 hover:text-[#224bc3]"
            >
              View Projects
            </Link>
          </div>

          <p className="mt-6 text-sm font-medium text-muted-foreground">
            <Link href="/blog" className="text-[#224bc3] underline decoration-[#224bc3]/30 underline-offset-4 transition hover:text-[#1b3a9d]">
              Read Our Blog
            </Link>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <AbstractHeroVisual />
        </div>
      </div>
    </section>
  );
}
