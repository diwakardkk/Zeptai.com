import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  HeartPulse,
  Orbit,
  Users,
} from "lucide-react";
import { collaborationModes, corePositioningStatement, homeFocusAreas } from "@/lib/siteContent";

const valueStrip = ["Research-led", "Evidence-based", "Status-transparent"];

const capabilityCards = [
  {
    title: "AI and Healthcare Foundation",
    description:
      "We operate with direct, hands-on grounding in applied artificial intelligence, healthcare workflows, and technical execution.",
    icon: BrainCircuit,
  },
  {
    title: "Product Roots, Broader Identity",
    description:
      "Our conversational healthcare products represent important clinical avenues, supported by a broader scientific research identity.",
    icon: HeartPulse,
  },
  {
    title: "Quantum Capability Building",
    description:
      "We pursue quantum research as an active direction under development, using careful maturity labels and making no unsupported advantage claims.",
    icon: Orbit,
  },
];

const trustSignals = [
  {
    title: "Published and ongoing work stay separate",
    description: "We strictly demarcate peer-reviewed publications from exploratory, ongoing research so you can verify the status of our work.",
    icon: CheckCircle2,
  },
  {
    title: "Research and product remain connected",
    description: "Our work demonstrates a clear scientific evolution from research models into functional, scalable clinical systems.",
    icon: CheckCircle2,
  },
  {
    title: "Collaboration is invited explicitly",
    description: "We actively welcome academic, industry, and international technical partnerships to extend our collaborative reach.",
    icon: Users,
  },
];

export default function AboutPageContent() {
  return (
    <section className="relative overflow-hidden pb-20 pt-24 md:pb-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-12%] top-12 h-80 w-80 rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute right-[-14%] top-4 h-96 w-96 rounded-full bg-[#224bc3]/14 blur-[150px]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:gap-14 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <article className="rounded-[2rem] border border-border bg-card/90 p-7 shadow-[0_28px_68px_-46px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:p-9">
            <p className="inline-flex rounded-full border border-[#224bc3]/25 bg-card/90 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
              About ZeptAI
            </p>

            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.08]">
              Research-led technology with practical roots in healthcare AI
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {corePositioningStatement}
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Our growth follows a natural, evidence-based trajectory from applied AI research and healthcare products to an expanded technical agenda including quantum computing.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {valueStrip.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#38ac06] to-[#224bc3] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(34,75,195,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_-18px_rgba(34,75,195,0.8)]"
              >
                Start a Conversation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground/85 transition hover:bg-muted"
              >
                Explore Research
              </Link>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#224bc3]/20 bg-gradient-to-br from-card/92 via-background/94 to-[#224bc3]/[0.08] p-7 shadow-[0_34px_72px_-50px_rgba(34,75,195,0.8)] sm:p-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]/80">
              Operational Principles
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              How we establish trust
            </h2>

            <div className="mt-6 space-y-3">
              {[
                "We strictly label published work, ongoing projects, and conceptual paths.",
                "Our conversational systems are presented as specific products, not our entire identity.",
                "Quantum algorithms are explored with scientific caution, backed by classical baselines.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-2xl border border-border bg-card/90 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#38ac06]" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {[
                { label: "Published", tone: "text-[#224bc3]" },
                { label: "Ongoing", tone: "text-[#38ac06]" },
                { label: "Prototype", tone: "text-foreground" },
              ].map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-border bg-card/90 px-3 py-3 text-center"
                >
                  <p className={`text-sm font-semibold ${signal.tone}`}>{signal.label}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {capabilityCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-border bg-card/90 p-6 shadow-[0_24px_48px_-40px_rgba(0,0,0,0.65)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#224bc3]/25"
              >
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38ac06]/20 to-[#224bc3]/20 text-[#224bc3]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground leading-snug">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-border bg-gradient-to-r from-card/95 via-card/90 to-background/95 p-7 shadow-[0_28px_62px_-44px_rgba(0,0,0,0.6)] sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article
                  key={signal.title}
                  className="rounded-2xl border border-border bg-card/90 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground leading-snug">{signal.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{signal.description}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {collaborationModes.map((mode) => (
              <article key={mode.title} className="rounded-2xl border border-border bg-card/90 p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground leading-snug">{mode.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{mode.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {homeFocusAreas.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card/90 p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
