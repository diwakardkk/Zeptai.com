"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Binary,
  CheckCircle2,
  FileText,
  MessagesSquare,
  Microscope,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const valueStrip = ["Research-driven", "Evidence-based", "Built for real workflows"];

const capabilityCards = [
  {
    title: "Voice-Driven Intake",
    description:
      "Capture patient context through natural conversation with workflow-aware prompts.",
    icon: MessagesSquare,
  },
  {
    title: "Structured Summaries",
    description:
      "Turn clinical conversations into concise, doctor-ready summaries with clear structure.",
    icon: FileText,
  },
  {
    title: "Scalable APIs",
    description:
      "Integrate intake intelligence into platforms and care journeys through reliable APIs.",
    icon: Binary,
  },
];

const trustSignals = [
  {
    title: "Research Foundation",
    description: "Product decisions start from healthcare AI evidence, not trend-driven features.",
    icon: Microscope,
  },
  {
    title: "Clinical Relevance",
    description: "Designed around real intake realities so teams can use outputs immediately.",
    icon: Workflow,
  },
  {
    title: "Reliability Focus",
    description: "Built with reliability, explainability, and usability as non-negotiable standards.",
    icon: ShieldCheck,
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
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch"
        >
          <article className="rounded-[2rem] border border-border bg-card/90 p-7 shadow-[0_28px_68px_-46px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:p-9">
            <p className="inline-flex rounded-full border border-[#224bc3]/25 bg-card/90 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
              About ZeptAI
            </p>

            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.08]">
              Research-driven healthcare AI designed for real clinical workflows
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              ZeptAI develops healthcare AI systems grounded in research and real clinical needs. We
              translate evidence-based innovation into voice-driven patient intake, structured
              summaries, and scalable APIs that fit seamlessly into healthcare workflows.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              From research to real-world impact, our focus is building AI that is reliable,
              explainable, and clinically usable.
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
                Talk to ZeptAI <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#demo"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground/85 transition hover:bg-muted"
              >
                Try Product Demo
              </Link>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#224bc3]/20 bg-gradient-to-br from-card/92 via-background/94 to-[#224bc3]/[0.08] p-7 shadow-[0_34px_72px_-50px_rgba(34,75,195,0.8)] sm:p-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]/80">
              Product Credibility
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Evidence-led systems, operationally aligned
            </h2>

            <div className="mt-6 space-y-3">
              {[
                "Voice interactions designed for patient comfort and clarity",
                "Structured outputs aligned with doctor review flow",
                "API-first architecture for platform-scale deployment",
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
                { label: "Reliability", tone: "text-[#224bc3]" },
                { label: "Explainability", tone: "text-[#38ac06]" },
                { label: "Usability", tone: "text-foreground" },
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
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {capabilityCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-border bg-card/90 p-6 shadow-[0_24px_48px_-40px_rgba(0,0,0,0.65)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#224bc3]/25"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38ac06]/20 to-[#224bc3]/20 text-[#224bc3]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-border bg-gradient-to-r from-card/95 via-card/90 to-background/95 p-7 shadow-[0_28px_62px_-44px_rgba(0,0,0,0.6)] sm:p-8"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article
                  key={signal.title}
                  className="rounded-2xl border border-border bg-card/90 p-5"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{signal.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{signal.description}</p>
                </article>
              );
            })}
          </div>
        </motion.section>
      </div>
    </section>
  );
}
