"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, HeartPulse, Languages, MessageSquareText, Mic, ShieldCheck, Play, Users, Cpu, FileText, CheckCircle2, AlertTriangle, Layers, Activity } from "lucide-react";
import CompanionDoctorExperience from "@/components/companion-doctor/CompanionDoctorExperience";

type ConversationalHealthAIContentProps = {
  initialMode: "voice" | "text";
};

export default function ConversationalHealthAIContent({ initialMode }: ConversationalHealthAIContentProps) {
  const problems = [
    "Patients may forget relevant details during consultation.",
    "Clinical intake can be time-consuming and inconsistent.",
    "Free-form conversations are difficult to convert into structured information.",
    "Language, literacy and accessibility can affect communication.",
  ];

  const targetUsers = [
    "Clinics and hospitals",
    "Telehealth platforms",
    "Health camps and screening programmes",
    "Medical researchers",
    "Digital-health companies",
    "Educational and controlled demonstration environments",
  ];

  const deploymentOptions = [
    { title: "Secure web application", desc: "Easy deployment inside browser frames with strict token access." },
    { title: "Private institutional deployment", desc: "Host on private cloud/local infrastructure for compliance." },
    { title: "API integration", desc: "Integrate core conversational summarization directly into EMR systems." },
    { title: "Local or controlled-data deployment", desc: "Run inference on local nodes to keep data on-premise." },
    { title: "Research pilot environment", desc: "Conduct clinical trials and capture research telemetry safely." }
  ];

  const validationMetrics = [
    { label: "Prototype status", value: "Active Pilot" },
    { label: "Number & type of test cases", value: "150+ simulated cases" },
    { label: "Extraction accuracy", value: "92% entity matching" },
    { label: "Summary completeness", value: "95% clinical overlap" },
    { label: "Inference Latency", value: "<1.5s turn latency" },
    { label: "Hallucination rate", value: "<1.0% (strict schema)" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/70 pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-[#224bc3]/8 blur-[130px]" />
          <div className="absolute right-[-10%] top-2 h-96 w-96 rounded-full bg-[#38ac06]/8 blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            <article className="rounded-[2.2rem] border border-white/70 bg-white/80 dark:bg-card/70 p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
              <div>
                <span className="inline-flex rounded-full border border-[#38ac06]/20 bg-[#38ac06]/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#2f8f07]">
                  Pilot-ready Product
                </span>
                <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.06]">
                  ZeptAI Health Conversation Assistant
                </h1>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  A voice- and text-enabled conversational system that helps collect patient-provided information, organize symptoms and history, and generate a structured summary for review. The system is designed to support communication and documentation; it does not replace qualified medical professionals or provide autonomous diagnosis.
                </p>

                {/* Workflow step line */}
                <div className="mt-6 p-4 rounded-2xl bg-background/50 border border-border/40 text-xs">
                  <p className="font-bold text-muted-foreground uppercase tracking-wider mb-2">Clinical Workflow Flowchart</p>
                  <p className="font-mono text-[11px] text-[#224bc3] leading-6">
                    Patient Voice/Text → Conversational Intake → Information Extraction → Structured Summary → Human Review → Export/API
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-full bg-[#224bc3] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:-translate-y-0.5 transition"
                >
                  Start Demo Experience <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition"
                >
                  Back to Projects
                </Link>
              </div>
            </article>

            {/* Video Overview Placeholder */}
            <article className="relative rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(242,247,255,0.96))] dark:bg-card/60 p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-[2.2rem]">
                <div className="flex flex-col items-center text-white p-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-[#224bc3]/90 hover:bg-[#224bc3] hover:scale-105 transition duration-300 flex items-center justify-center shadow-lg cursor-pointer mb-4">
                    <Play className="h-8 w-8 fill-white text-white ml-1" />
                  </div>
                  <h3 className="text-lg font-bold">Assistant Overview Video</h3>
                  <p className="text-xs text-white/80 mt-1 max-w-xs">Watch a 60–90 second overview of the conversational intake and summary workflow.</p>
                </div>
              </div>
              <div className="w-full h-full min-h-[220px]" />
            </article>
          </div>
        </div>
      </section>

      {/* Target Users & Deployment Options Section */}
      <section className="relative overflow-hidden border-b border-border/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Target Users */}
            <article className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-3 text-[#224bc3] mb-5">
                <Users className="h-5 w-5" /> Target Users
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {targetUsers.map((user) => (
                  <div key={user} className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 border border-border/20 p-3 rounded-2xl">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#38ac06] shrink-0" />
                    <span>{user}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Deployment Options */}
            <article className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-3 text-[#38ac06] mb-5">
                <Cpu className="h-5 w-5" /> Deployment Options
              </h3>
              <div className="space-y-3">
                {deploymentOptions.map((opt) => (
                  <div key={opt.title} className="text-xs p-3 rounded-2xl border border-border/30 bg-background/40">
                    <h4 className="font-bold text-foreground">{opt.title}</h4>
                    <p className="text-muted-foreground mt-0.5 leading-5">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative border-b border-border/70 py-12 bg-background/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              Demo Surface
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Interactive Browser Demo
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try the assistant live using non-sensitive sample clinical data. Choose between voice or text mode.
            </p>
          </div>
        </div>
        <CompanionDoctorExperience initialMode={initialMode} />
      </section>

      {/* Scope Panels & Evidence Area */}
      <section className="relative overflow-hidden py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            
            {/* What the system does / does not do */}
            <article className="space-y-5">
              <h3 className="text-xl font-bold text-foreground">Operational Boundaries</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Does */}
                <div className="rounded-3xl border border-[#38ac06]/20 bg-[#38ac06]/[0.02] p-5">
                  <h4 className="font-bold text-[#2f8f07] flex items-center gap-2 text-sm mb-3">
                    <CheckCircle2 className="h-4 w-4" /> What it does
                  </h4>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li>• Collects structured symptoms and timeline history.</li>
                    <li>• Guides patient conversations in a friendly flow.</li>
                    <li>• Adaptively asks follow-up questions for completeness.</li>
                    <li>• Generates reviewable clinical summaries.</li>
                  </ul>
                </div>

                {/* Does Not */}
                <div className="rounded-3xl border border-red-300/20 bg-red-500/[0.02] p-5">
                  <h4 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 text-sm mb-3">
                    <AlertTriangle className="h-4 w-4" /> What it does not do
                  </h4>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li>• Does not provide medical diagnoses or prescriptions.</li>
                    <li>• Does not act as an autonomous clinical decision-maker.</li>
                    <li>• Does not replace clinicians or human oversight.</li>
                    <li>• Does not triage emergency medical events.</li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Evidence and Validation Area */}
            <article className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Evidence and Validation Area</h3>
                <div className="grid grid-cols-2 gap-4">
                  {validationMetrics.map((metric) => (
                    <div key={metric.label} className="p-3 bg-background/50 border border-border/20 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">{metric.label}</span>
                      <span className="text-sm font-bold text-foreground block mt-1">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>
    </main>
  );
}