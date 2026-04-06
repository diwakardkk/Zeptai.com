"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AudioLines,
  Brain,
  Clock,
  FileText,
  Stethoscope,
  Users,
} from "lucide-react";

const standoutPillars = [
  {
    title: "Research-Backed Foundation",
    description:
      "Evidence-led product design shaped by real patient-intake and clinical handoff needs.",
    icon: Activity,
    tone: "from-[#224bc3]/20 to-[#224bc3]/5 text-[#224bc3]",
  },
  {
    title: "Voice-First Intake",
    description:
      "Patients can speak naturally, so key symptoms and concerns are captured with less friction.",
    icon: AudioLines,
    tone: "from-[#38ac06]/20 to-[#38ac06]/5 text-[#2f8f07]",
  },
  {
    title: "Doctor-Ready Structured Output",
    description:
      "Conversations are converted into clear, structured summaries ready for clinical review.",
    icon: FileText,
    tone: "from-[#224bc3]/15 to-[#38ac06]/10 text-muted-foreground",
  },
  {
    title: "Built for Real Workflows",
    description:
      "Designed to fit into day-to-day care operations instead of adding another tool burden.",
    icon: Stethoscope,
    tone: "from-black/10 to-[#224bc3]/10 text-muted-foreground",
  },
];

const supportSignals = [
  {
    title: "Clinical Screening Support",
    description:
      "Organizes history, symptoms, and relevant context before consultations begin.",
    icon: Brain,
  },
  {
    title: "Time-Saving for Care Teams",
    description:
      "Reduces repetitive intake questioning and helps teams start with context.",
    icon: Clock,
  },
  {
    title: "Integration-Ready Deployment",
    description:
      "API-first and web-based experience for clinics, hospitals, and digital health teams.",
    icon: Users,
  },
];

const keywords = [
  "Research-backed architecture",
  "Voice-first patient intake",
  "Doctor-ready summaries",
  "Healthcare workflow fit",
  "API + web deployment",
  "Clinically usable output",
  "High-trust product design",
  "Modern intake layer",
];

export default function USPSection() {
  return (
    <section
      id="usp"
      className="relative overflow-hidden border-y border-border bg-background py-14 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-8 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]" />
        <div className="absolute right-[-10%] top-12 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-[30px] border border-border bg-card/85 p-5 shadow-[0_24px_56px_-40px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-7"
        >
          <div className="grid gap-6 lg:grid-cols-[1.02fr,1.24fr] lg:items-start">
            <div>
              <span className="inline-flex rounded-full border border-[#224bc3]/25 bg-card/85 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
                Why ZeptAI Stands Out
              </span>

              <h2 className="mt-4 max-w-xl text-2xl font-bold tracking-tight text-foreground md:text-[2.15rem]">
                Research-backed voice AI for modern clinical intake
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
                ZeptAI combines evidence-driven design with voice-first intake,
                then delivers structured context doctors can use immediately in
                real care workflows.
              </p>

              <div className="mt-5 rounded-2xl border border-border bg-gradient-to-r from-white/85 via-[#fffffa] to-[#224bc3]/[0.08] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
                  Product Positioning
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground md:text-base">
                  Voice-based intake, clinically structured outputs, and
                  integration-ready delivery for modern healthcare teams.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {standoutPillars.map((pillar, index) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.article
                      key={pillar.title}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card/88 p-4 transition-colors hover:border-[#224bc3]/30"
                    >
                      <div
                        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${pillar.tone}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-[0.95rem] font-semibold leading-5 text-foreground">
                        {pillar.title}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {pillar.description}
                      </p>

                      <motion.div
                        className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#38ac06]/60 to-transparent"
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.article>
                  );
                })}
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {supportSignals.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="rounded-2xl border border-border bg-card/80 p-3.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#38ac06]/10 text-[#2f8f07]">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-xs font-semibold text-muted-foreground">
                          {item.title}
                        </p>
                      </div>
                      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
