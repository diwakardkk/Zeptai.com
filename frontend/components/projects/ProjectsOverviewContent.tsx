"use client";

import Link from "next/link";
import { ArrowRight, Check, AlertCircle } from "lucide-react";

export default function ProjectsOverviewContent() {
  const problems = [
    "Patients may forget relevant details during consultation.",
    "Clinical intake can be time-consuming and inconsistent.",
    "Free-form conversations are difficult to convert into structured information.",
    "Language, literacy and accessibility can affect communication.",
  ];

  const capabilities = [
    "Voice and text interaction",
    "Structured collection of symptoms and history",
    "Follow-up questions based on missing information",
    "Multilingual interaction where supported",
    "Patient-friendly conversation flow",
    "Doctor-reviewable structured summary",
    "Export and API integration",
    "Human confirmation before critical actions",
    "Privacy-oriented deployment options",
    "Clear medical and safety disclaimers",
  ];

  const workflowSteps = [
    { title: "Patient Voice/Text", label: "Input" },
    { title: "Conversational Intake", label: "Assistant Dialogue" },
    { title: "Information Extraction", label: "ML Pipeline" },
    { title: "Structured Summary", label: "Reviewable format" },
    { title: "Human Review", label: "Clinician verification" },
    { title: "Export/API", label: "EMR integration" }
  ];

  const futureProjects = [
    {
      title: "Structured Clinical Summary Pipeline",
      label: "Research Prototype",
      description: "Extracting, organizing, and transforming medical conversation transcripts into structured EMR-ready records.",
      tone: "blue"
    },
    {
      title: "Safety Instrument and Feedback Dashboard",
      label: "Pilot Project",
      description: "Real-time safety guardrails, automated turn limits, and feedback telemetry instrumentation.",
      tone: "amber"
    },
    {
      title: "Open Clinical Summarizer API",
      label: "Open-Source Tool",
      description: "A secure, developer-focused API wrapper for localized clinical summarization and transcription pipelines.",
      tone: "green"
    }
  ];

  const getLabelTone = (tone: string) => {
    switch (tone) {
      case "green":
        return "border-[#38ac06]/20 bg-[#38ac06]/10 text-[#2f8f07]";
      case "amber":
        return "border-amber-300/40 bg-amber-500/10 text-amber-700";
      case "blue":
      default:
        return "border-[#224bc3]/20 bg-[#224bc3]/10 text-[#224bc3]";
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pt-32 pb-14 md:pt-36 md:pb-18 lg:pb-20">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[-8%] h-[20rem] w-[20rem] rounded-full bg-[#224bc3]/14 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,75,195,0.10),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(56,172,6,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.055)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
        
        {/* Projects Hero */}
        <section className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-white/78 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3] shadow-[0_18px_40px_-30px_rgba(34,75,195,0.5)] backdrop-blur-sm">
            Applied Engineering
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
            Applied Engineering &amp;
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#224bc3] via-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
              Projects Built From Research
            </span>
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg lg:text-xl">
            Our projects translate research into usable systems. Each project is developed with clear objectives, transparent limitations, human oversight and a pathway toward real-world validation.
          </p>
        </section>

        {/* Featured Project - Conversational Healthcare Bot */}
        <section className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_70px_-46px_rgba(20,32,72,0.42)] backdrop-blur-sm md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="inline-flex rounded-full border border-[#38ac06]/20 bg-[#38ac06]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2f8f07]">
              Featured Project
            </span>
            <span className="text-xs font-semibold text-muted-foreground font-mono">
              Status: Pilot-Ready
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            ZeptAI Health Conversation Assistant
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            A voice- and text-enabled conversational system that helps collect patient-provided information, organize symptoms and history, and generate a structured summary for review. The system is designed to support communication and documentation; it does not replace qualified medical professionals or provide autonomous diagnosis.
          </p>

          {/* Core columns for Problems & Capabilities */}
          <div className="grid gap-8 mt-10 md:grid-cols-2 pt-8 border-t border-border/40">
            {/* Problems Addressed */}
            <article className="rounded-3xl border border-red-300/20 bg-red-500/[0.02] p-6">
              <div className="flex items-center gap-3 text-red-700 mb-4">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-lg font-bold">Problems Addressed</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-muted-foreground">
                {problems.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Core Capabilities */}
            <article className="rounded-3xl border border-[#38ac06]/20 bg-[#38ac06]/[0.01] p-6">
              <div className="flex items-center gap-3 text-[#2f8f07] mb-4">
                <Check className="h-5 w-5" />
                <h3 className="text-lg font-bold">Core Capabilities</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                {capabilities.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38ac06] shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Workflow graphic representation */}
          <div className="mt-10 p-6 rounded-3xl border border-border/40 bg-background/50">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5 text-center">
              Recommended Workflow Graphic
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
              {workflowSteps.map((step, idx) => (
                <div key={step.title} className="flex items-center w-full md:w-auto">
                  <div className="flex flex-col items-center justify-center p-3.5 bg-background border border-border rounded-2xl w-full text-center md:min-w-[140px] shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-[#224bc3]">{step.label}</span>
                    <span className="text-xs font-bold text-foreground mt-1">{step.title}</span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden md:flex items-center text-muted-foreground/60 mx-1 shrink-0">
                      <span className="text-lg">→</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calls to Action */}
          <div className="mt-8 flex flex-wrap gap-3.5 justify-center">
            <Link
              href="/projects/conversational-health-ai"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#224bc3] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:-translate-y-0.5 transition"
            >
              View Interactive Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=Joint Proposal"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition"
            >
              Request Pilot
            </Link>
            <Link
              href="/contact?type=Industry Validation"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition"
            >
              Discuss Integration
            </Link>
          </div>
        </section>

        {/* Future Project Cards */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              Pipeline
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Future Project Tracks
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Under our developmental standards, we do not publish empty product cards. These projects will remain listed as Research Prototypes or Pilot Projects until a fully functional deployment or prototype is validated.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 max-w-6xl">
            {futureProjects.map((p) => (
              <article
                key={p.title}
                className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_40px_-30px_rgba(20,32,72,0.25)] flex flex-col justify-between"
              >
                <div>
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${getLabelTone(p.tone)}`}>
                    {p.label}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground leading-6">{p.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}