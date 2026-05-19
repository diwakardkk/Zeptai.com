"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Brain,
  Code2,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";

const domains = [
  {
    label: "Conversational AI",
    icon: AudioLines,
  },
  {
    label: "Medical Imaging",
    icon: Brain,
  },
  {
    label: "Explainable AI",
    icon: Code2,
  },
];

const publications = [
  {
    title: "Conversational Framework for Mental Health Diagnosis",
    journal: "PeerJ Computer Science [Impact Factor: 2.8]",
    year: "2026",
    doi: "10.7717/peerj-cs.3602",
    href: "https://peerj.com/articles/cs-3602/",
    badge: "Peer-reviewed SCIE | Q1 journal",
  },
  {
    title:
      "Interpretable Chest X-ray Localization with Principal Components",
    journal: "Engineering Applications of Artificial Intelligence Journal [Impact Factor: 8.0]",
    year: "2025",
    doi: "10.1016/j.engappai.2025.112358",
    href: "https://doi.org/10.1016/j.engappai.2025.112358",
    badge: "Peer-reviewed SCIE | Q1 journal",
  },
];

export default function Research() {
  return (
    <section
      id="research"
      className="relative overflow-hidden border-y border-border bg-background py-14 md:py-20"
      aria-label="Healthcare AI research publications and journal impact"
    >
      <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-[#38ac06]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[#224bc3]/10 blur-[110px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-[#224bc3]/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Research and Scientific Authority
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Peer-Reviewed AI Research Behind ZeptAI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Scientific foundation across conversational AI, medical imaging, and explainability.
          </p>
        </div>

        {/* Domain tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <span
                key={domain.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium text-foreground"
              >
                <Icon className="h-4 w-4 text-[#224bc3]" />
                {domain.label}
              </span>
            );
          })}
        </motion.div>

        {/* Publications */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {publications.map((paper, index) => (
            <motion.article
              key={paper.doi}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-[#38ac06]/30 bg-[#38ac06]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#38ac06]">
                  {paper.badge}
                </span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                  {paper.year}
                </span>
              </div>

              <h3 className="mt-3 text-[0.9rem] font-semibold leading-snug text-foreground">
                {paper.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {paper.journal}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#224bc3]/30 bg-[#224bc3]/10 px-3 py-1.5 text-xs font-semibold text-[#224bc3] transition-colors hover:bg-[#224bc3]/20"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Read Paper
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-muted-foreground underline-offset-2 hover:text-[#224bc3] hover:underline"
                >
                  doi:{paper.doi}
                </a>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

