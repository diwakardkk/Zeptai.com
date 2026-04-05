"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  BookOpen,
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
    tone: "from-[#38ac06]/20 to-[#38ac06]/5 text-[#2f8f07]",
  },
  {
    label: "Medical Imaging",
    icon: Brain,
    tone: "from-[#224bc3]/20 to-[#224bc3]/5 text-[#224bc3]",
  },
  {
    label: "Explainable AI",
    icon: Code2,
    tone: "from-[#224bc3]/15 to-[#38ac06]/10 text-black/80",
  },
];

const publications = [
  {
    title: "Conversational Framework for Mental Health Diagnosis",
    journal: "PeerJ Computer Science",
    year: "2026",
    doi: "10.7717/peerj-cs.3602",
    href: "https://peerj.com/articles/cs-3602/",
    badge: "Peer-reviewed",
  },
  {
    title:
      "Interpretable Chest X-ray Localization with Principal Components",
    journal: "Engineering Applications of AI",
    year: "2025",
    doi: "10.1016/j.engappai.2025.112358",
    href: "https://doi.org/10.1016/j.engappai.2025.112358",
    badge: "Q1 journal",
  },
];

export default function Research() {
  return (
    <section
      id="research"
      className="relative overflow-hidden border-y border-black/10 bg-background py-12 md:py-14"
      aria-label="Healthcare AI research publications and journal impact"
    >
      <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-[#38ac06]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[#224bc3]/10 blur-[110px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Research and Scientific Authority
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-5xl">
            Peer-Reviewed AI Research Behind ZeptAI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-black/65 md:text-base">
            Scientific foundation across conversational AI, medical imaging, and explainability.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto mt-6 max-w-6xl rounded-3xl border border-black/10 bg-[#fffffa]/85 p-4 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-6"
        >
          <div className="flex justify-center">
            <motion.div
              className="relative w-full max-w-sm rounded-2xl border border-[#224bc3]/30 bg-gradient-to-br from-white to-[#224bc3]/[0.08] px-4 py-3 text-center"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(34,75,195,0.16)",
                  "0 0 24px rgba(34,75,195,0.24)",
                  "0 0 0 rgba(34,75,195,0.16)",
                ],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-black">
                <BookOpen className="h-4 w-4 text-[#224bc3]" />
                Research Core
              </p>
            </motion.div>
          </div>

          <div className="relative mt-4 pt-5">
            <div className="pointer-events-none absolute inset-0 hidden sm:block">
              <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-[#224bc3]/55 to-[#224bc3]/20" />
              <div className="absolute left-[16.666%] right-[16.666%] top-4 h-px bg-gradient-to-r from-[#38ac06]/40 via-[#224bc3]/55 to-[#38ac06]/40" />
              <div className="absolute left-[16.666%] top-4 h-3 w-px -translate-x-1/2 bg-gradient-to-b from-[#224bc3]/40 to-transparent" />
              <div className="absolute left-1/2 top-4 h-3 w-px -translate-x-1/2 bg-gradient-to-b from-[#224bc3]/40 to-transparent" />
              <div className="absolute right-[16.666%] top-4 h-3 w-px translate-x-1/2 bg-gradient-to-b from-[#224bc3]/40 to-transparent" />
              <motion.div
                className="absolute left-1/2 top-[13px] h-2 w-2 -translate-x-1/2 rounded-full bg-[#38ac06]"
                animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {domains.map((domain, index) => {
                const Icon = domain.icon;
                return (
                  <motion.div
                    key={domain.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-black/10 bg-white/90 p-3.5 text-center"
                  >
                    <span
                      className={`mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${domain.tone}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-black">{domain.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {publications.map((paper, index) => (
              <motion.article
                key={paper.doi}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-black/10 bg-white/90 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#38ac06]/25 bg-[#38ac06]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2f8f07]">
                    {paper.badge}
                  </span>
                  <span className="text-xs font-medium text-black/55">{paper.year}</span>
                </div>

                <p className="mt-2 text-sm font-semibold leading-6 text-black">{paper.title}</p>
                <p className="mt-1 text-xs text-black/60">{paper.journal}</p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <a
                    href={paper.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#224bc3]/25 bg-[#224bc3]/10 px-2.5 py-1.5 text-xs font-semibold text-[#224bc3] transition-colors hover:bg-[#224bc3]/15"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Read
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-black/55 underline-offset-2 hover:text-[#224bc3] hover:underline"
                  >
                    DOI
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
