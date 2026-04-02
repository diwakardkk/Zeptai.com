"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  Users,
} from "lucide-react";

const usps = [
  {
    title: "Human-Like Voice Interaction",
    description:
      "Patients describe their problem naturally through voice instead of filling rigid forms or typing long responses.",
    icon: <Activity className="h-5 w-5 text-primary" />,
  },
  {
    title: "Structured Intake Before Consultation",
    description:
      "Symptoms, duration, history, and relevant context are captured before the doctor interaction begins.",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Doctor-Ready Smart Summary",
    description:
      "ZeptAI converts the conversation into a clean clinical summary that is easier to review and act on.",
    icon: <FileText className="h-5 w-5 text-primary" />,
  },
  {
    title: "Built to Save Doctor Time",
    description:
      "Doctors can skip repetitive intake questions and start consultations with structured context already available.",
    icon: <Clock className="h-5 w-5 text-primary" />,
  },
  {
    title: "API-First Healthcare Integration",
    description:
      "Designed for telemedicine platforms, hospitals, clinics, and digital health products that need an intake layer.",
    icon: <Users className="h-5 w-5 text-primary" />,
  },
  {
    title: "Web-Based Access Without an App",
    description:
      "Patients can start immediately through the web interface, reducing friction for direct use and faster enterprise rollout.",
    icon: <Globe2 className="h-5 w-5 text-primary" />,
  },
];

const keywords = [
  "Voice-based patient intake",
  "Clinical screening API",
  "Doctor-ready summaries",
  "Web-based healthcare AI",
];

export default function USPSection() {
  return (
    <section
      id="usp"
      className="border-y border-border bg-gradient-to-b from-background via-secondary/30 to-background py-20"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr,1.35fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-primary/15 bg-background/90 p-8 shadow-sm"
        >
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Why ZeptAI Stands Out
          </span>
          <h2 className="max-w-md text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Research-backed voice AI for modern clinical intake
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
            ZeptAI helps healthcare teams collect patient concerns, screening
            details, and history through natural conversation, then turns that
            information into structured clinical insight before the doctor even
            starts.
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Product Summary
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              From natural conversation to structured clinical insight before
              the doctor even starts.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group rounded-3xl border border-border bg-background/90 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                {usp.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {usp.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {usp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
