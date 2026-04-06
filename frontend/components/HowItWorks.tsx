"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Brain,
  CalendarClock,
  FileText,
  MessageSquare,
  Stethoscope,
} from "lucide-react";

const originalFlowSteps = [
  "Patient starts voice conversation",
  "AI collects clinical context",
  "Screening logic organizes responses",
  "Doctor-ready summary is generated",
  "Vitals and prior history can be added",
  "Consultation starts with context",
];

const workflowStages = [
  {
    title: "Guided Conversation",
    description: "Patients share symptoms naturally through structured voice prompts.",
    icon: AudioLines,
    tone: "from-[#38ac06]/25 to-[#38ac06]/10 text-[#2f8f07]",
  },
  {
    title: "AI Screening Engine",
    description: "ZeptAI organizes responses into clinically relevant intake context.",
    icon: Brain,
    tone: "from-[#224bc3]/25 to-[#224bc3]/10 text-[#224bc3]",
  },
  {
    title: "Doctor-Ready Output",
    description: "Structured summaries arrive before consultation begins.",
    icon: FileText,
    tone: "from-[#38ac06]/15 to-[#224bc3]/15 text-muted-foreground",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-8 h-64 w-64 rounded-full bg-[#38ac06]/10 blur-[110px]" />
        <div className="absolute right-[-12%] top-16 h-72 w-72 rounded-full bg-[#224bc3]/12 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How ZeptAI Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A voice-based patient intake workflow that moves from guided conversation to doctor-ready clinical context.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-border bg-card/88 p-5 shadow-[0_22px_54px_-38px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-6"
          >
            <p className="inline-flex rounded-full border border-[#224bc3]/25 bg-card/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#224bc3]">
              Workflow Steps
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {originalFlowSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                  className="flex items-start gap-2.5 rounded-2xl border border-border bg-card/85 px-3 py-2.5"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#224bc3]/10 text-[10px] font-bold text-[#224bc3]">
                    {index + 1}
                  </span>
                  <p className="text-xs leading-5 text-muted-foreground">{step}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                <MessageSquare className="h-3.5 w-3.5 text-[#224bc3]" /> Voice intake
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                <CalendarClock className="h-3.5 w-3.5 text-[#38ac06]" /> Screening context
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" /> Clinical handoff
              </span>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="relative rounded-3xl border border-border bg-gradient-to-br from-white/90 via-[#fffffa]/92 to-[#224bc3]/[0.08] p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.55)] md:p-6"
          >
            <div className="pointer-events-none absolute left-[29px] top-[62px] bottom-[62px] w-px bg-gradient-to-b from-[#38ac06]/50 via-[#224bc3]/40 to-[#224bc3]/20" />
            <motion.div
              className="pointer-events-none absolute left-[26px] top-[64px] h-2.5 w-2.5 rounded-full bg-[#38ac06]"
              animate={{ y: [0, 92, 184, 0], opacity: [0.9, 0.7, 0.8, 0.9] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="space-y-3">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.title}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="relative ml-7 rounded-2xl border border-border bg-card/88 px-4 py-3.5"
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className={`absolute -left-9 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br ${stage.tone} border border-border`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <p className="text-sm font-semibold text-foreground">{stage.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{stage.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
