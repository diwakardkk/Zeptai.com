"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  FileText,
  Globe2,
  HeartPulse,
  Microscope,
  MessagesSquare,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from "lucide-react";

const whatWeDo = [
  {
    title: "Conversational patient intake",
    description:
      "ZeptAI guides patients through a natural voice conversation to capture symptoms, history, and pre-consultation context.",
    icon: <MessagesSquare className="h-5 w-5 text-primary" />,
  },
  {
    title: "Structured clinical summaries",
    description:
      "The system turns patient conversation into clear doctor-ready summaries instead of leaving information buried in raw dialogue.",
    icon: <FileText className="h-5 w-5 text-primary" />,
  },
  {
    title: "Workflow-ready healthcare AI",
    description:
      "Our product direction is built around real clinical workflows, not generic assistant experiences.",
    icon: <Workflow className="h-5 w-5 text-primary" />,
  },
];

const productHighlights = [
  {
    title: "Voice-based patient interaction",
    description:
      "Patients can explain their problem more comfortably through human-like voice conversation.",
    icon: <Activity className="h-5 w-5 text-primary" />,
  },
  {
    title: "Browser-based experience",
    description:
      "Individuals can access the working model directly in the browser without installing an app.",
    icon: <Globe2 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Doctor-ready reports",
    description:
      "Patient concerns, history, and intake context are organized into a structured summary doctors can review quickly.",
    icon: <Stethoscope className="h-5 w-5 text-primary" />,
  },
];

const approach = [
  "Research-driven product design grounded in healthcare AI work",
  "Simple patient experience with clear, guided conversation",
  "Reliable workflow thinking for doctors, clinics, and partners",
  "Healthcare-focused positioning for real screening and intake use cases",
];

const audiences = [
  {
    title: "Hospitals and clinics",
    description:
      "Improve intake quality and reduce repetitive consultation overhead with structured pre-consultation context.",
    icon: <Building2 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Telemedicine platforms",
    description:
      "Add voice-based intake before the doctor joins and pass doctor-ready context into the consultation flow.",
    icon: <HeartPulse className="h-5 w-5 text-primary" />,
  },
  {
    title: "Healthcare startups",
    description:
      "Use ZeptAI as an API-first intake and screening layer inside digital health products.",
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
  },
  {
    title: "Individual users",
    description:
      "Use the browser experience to explain symptoms clearly and prepare a more structured consultation.",
    icon: <Globe2 className="h-5 w-5 text-primary" />,
  },
];

export default function AboutPageContent() {
  return (
    <section className="relative overflow-hidden pb-24 pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-0 h-72 w-72 rounded-full bg-primary/12 blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] h-80 w-80 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              About ZeptAI
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Research-driven healthcare AI for patient intake, screening, and
              clinical summaries
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              ZeptAI is building conversational AI for healthcare that helps
              patients speak naturally, helps doctors start with better context,
              and helps healthcare platforms bring structured intake into real
              workflows.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background/90 p-7 shadow-lg shadow-primary/5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Core Positioning
            </p>
            <p className="mt-4 text-2xl font-semibold leading-9 text-foreground">
              ZeptAI turns natural patient conversation into structured
              clinical context before the doctor even starts.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Healthcare AI",
                "Patient intake AI",
                "Clinical screening AI",
                "Medical AI solutions",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-background/90 p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              About ZeptAI
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              ZeptAI is a healthcare AI company focused on one clear problem:
              doctors spend too much consultation time collecting basic intake
              details, while patients often struggle to explain their condition
              clearly in the moment.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              We are building a research-driven platform that improves that
              first layer of care communication through conversational patient
              intake, structured screening, and doctor-ready summaries.
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-primary/15 bg-gradient-to-br from-background via-background to-primary/5 p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Why It Matters
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              In many healthcare workflows, the first minutes of a consultation
              are spent asking repetitive intake questions about symptoms,
              duration, medications, and history.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              ZeptAI reduces that burden by helping patients share their
              concerns through guided voice conversation and by organizing the
              output into structured clinical context that is easier to review.
            </p>
          </motion.article>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-secondary/35 p-8"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              What We Do
            </h2>
            <div className="mt-8 space-y-4">
              {whatWeDo.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-background/90 p-5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-border bg-background/90 p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Our Product
            </h2>
            <div className="mt-8 space-y-4">
              {productHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-background/90 p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Our Approach
            </h2>
            <ul className="mt-6 space-y-4">
              {approach.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-border bg-secondary/35 px-5 py-4 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-border bg-background/90 p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Who We Serve
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {audiences.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-secondary/25 p-5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-background p-8"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Enterprise API for Healthcare Platforms
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              ZeptAI is being built as an integration-ready platform for
              telemedicine products, hospitals, clinics, and healthcare
              startups that want a conversational intake and screening layer.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Our API direction supports browser interaction, patient intake
              capture, structured summaries, and workflow integration for
              healthcare teams that need scalable medical AI solutions.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore API Access
            </Link>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-border bg-background/90 p-8 shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Microscope className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Research With Real-World Direction
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              ZeptAI is shaped by healthcare AI research in conversational
              systems, clinical structuring, and interpretable medical AI. We
              care about practical deployment, not just technical novelty.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Our goal is to build tools that improve patient communication,
              reduce intake friction, and support better healthcare workflows
              in real operating environments.
            </p>
          </motion.article>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] border border-border bg-gradient-to-br from-background via-secondary/35 to-background p-8 md:p-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Vision
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground md:text-lg">
            We believe the future of healthcare communication will be more
            conversational, more structured, and more useful for both patients
            and doctors. ZeptAI is building toward that future by making voice
            interaction, patient screening, and clinical summaries easier to
            access through the browser and easier to integrate through APIs.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Try in Browser
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request Demo
            </Link>
          </div>
        </motion.section>
      </div>
    </section>
  );
}
