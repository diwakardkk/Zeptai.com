import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Orbit, HeartPulse } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";
import { getOrganizationSchema } from "@/lib/seo/schema";
import { corePositioningStatement } from "@/lib/siteContent";

export const metadata: Metadata = buildPageMetadata({
  title: "Research-Led AI, Healthcare, and Quantum Technology",
  description:
    "ZeptAI is a research-led technology company building practical AI systems for healthcare while developing credible research capability in quantum computing.",
  path: "/",
  keywords: [
    "healthcare AI for patient intake",
    "research-led healthcare AI",
    "quantum computing research company",
    "voice AI patient intake",
    "clinical summary automation",
  ],
});

const aboutCards = [
  {
    title: "Healthcare AI",
    description:
      "Conversational systems, clinical information structuring, explainable models and human-centred digital health tools.",
    icon: HeartPulse,
    href: "/projects/conversational-health-ai",
    linkText: "View Healthcare AI Project",
  },
  {
    title: "AI & Machine Learning Research",
    description:
      "Trustworthy learning, uncertainty estimation, optimization, efficient models and practical decision-support systems.",
    icon: BrainCircuit,
    href: "/research#publications",
    linkText: "Read AI Publications",
  },
  {
    title: "Quantum Computing Research",
    description:
      "Hybrid quantum-classical algorithms, quantum optimization, variational methods and realistic benchmarking against classical approaches.",
    icon: Orbit,
    href: "/research/quantum-computing",
    linkText: "Explore Quantum Directions",
  },
];

const workSteps = [
  {
    step: "01",
    title: "Identify",
    description: "Identify a meaningful real-world problem.",
  },
  {
    step: "02",
    title: "Develop",
    description: "Develop and evaluate research methods.",
  },
  {
    step: "03",
    title: "Build",
    description: "Build a working software prototype.",
  },
  {
    step: "04",
    title: "Validate",
    description: "Validate with domain experts and users.",
  },
];

export default function Home() {
  const organizationSchema = getOrganizationSchema();

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      
      {/* Section 1 - Hero */}
      <Hero />

      {/* Section 2 - About ZeptAI */}
      <section id="about" className="relative overflow-hidden border-b border-border/70 bg-background py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-[#224bc3]/5 blur-[120px]" />
          <div className="absolute right-[-8%] bottom-6 h-72 w-72 rounded-full bg-[#38ac06]/5 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-flex rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3]">
              About ZeptAI
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              From Research to Responsible Technology
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg">
              ZeptAI brings together research, engineering and product development. Our current work spans AI-enabled healthcare communication, trustworthy machine learning and emerging quantum-computing methods. We focus on problems where technology must be accurate, explainable, secure and useful to people and institutions.
            </p>
          </div>

          {/* Three Compact Cards */}
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
            {aboutCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group relative rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#224bc3]/20 hover:shadow-[0_30px_60px_-38px_rgba(20,32,72,0.45)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(34,75,195,0.08),rgba(56,172,6,0.12))] text-[#224bc3] group-hover:scale-105 transition-transform duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground leading-snug">{card.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40">
                    <Link href={card.href} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#224bc3] hover:text-[#1b3a9d] transition-colors">
                      {card.linkText} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 - How We Work */}
      <section id="how-we-work" className="relative overflow-hidden border-b border-border/70 bg-background/50 py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-10%] top-6 h-60 w-60 rounded-full bg-[#224bc3]/5 blur-[120px]" />
          <div className="absolute left-[-10%] bottom-0 h-56 w-56 rounded-full bg-[#38ac06]/5 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.15]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-flex rounded-full border border-[#38ac06]/20 bg-[#38ac06]/[0.06] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#38ac06]">
              Process
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Scientific Thinking. Practical Engineering. Responsible Deployment.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-muted-foreground">
              We apply a structured, evidence-led approach to everything we build, taking research concepts from early formulation to verified, production-ready software.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto relative">
            {workSteps.map((step, idx) => (
              <div
                key={step.step}
                className="relative rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_20px_48px_-40px_rgba(20,32,72,0.22)] backdrop-blur-sm hover:border-[#38ac06]/20 transition duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
                    {step.step}
                  </span>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-9 left-[calc(100%-12px)] w-[calc(100%-48px)] h-[1.5px] bg-gradient-to-r from-[#38ac06]/35 to-[#224bc3]/35 z-10 pointer-events-none" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - Collaboration & Contact */}
      <section id="collaboration" className="relative overflow-hidden bg-background">
        <Contact />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Footer />
    </main>
  );
}
