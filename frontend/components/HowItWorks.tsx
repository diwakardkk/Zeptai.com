"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AudioLines, Brain, FileText } from "lucide-react";

const waveformBars = Array.from({ length: 12 }, (_, i) => i);
const screeningTags = ["Symptoms", "History", "Duration", "Medication", "Context"];
const reportFields = ["Chief complaint", "Summary", "Findings", "Next step"];

function StageConnector({ active }: { active: boolean }) {
  return (
    <div className="relative mx-auto h-12 w-6 lg:h-6 lg:w-16">
      <div
        className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rounded-full lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:-translate-y-1/2 lg:translate-x-0 ${
          active
            ? "bg-gradient-to-b from-[#38ac06]/70 to-[#224bc3]/70 lg:bg-gradient-to-r"
            : "bg-border"
        }`}
      />
      <motion.span
        className={`absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full lg:left-1 lg:top-1/2 lg:-translate-y-1/2 ${
          active ? "bg-[#224bc3]" : "bg-border"
        } lg:hidden`}
        animate={active ? { y: [0, 26, 0] } : { y: 0 }}
        transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className={`absolute left-1 top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
          active ? "bg-[#224bc3]" : "bg-border"
        } lg:block`}
        animate={active ? { x: [0, 54, 0] } : { x: 0 }}
        transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function HowItWorks() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-8 h-56 w-56 rounded-full bg-[#38ac06]/10 blur-[100px]" />
        <div className="absolute right-[-12%] top-14 h-64 w-64 rounded-full bg-[#224bc3]/12 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-5xl">How ZeptAI Works</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            From guided conversation to structured clinical output.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card/82 p-4 shadow-[0_22px_54px_-40px_rgba(0,0,0,0.52)] backdrop-blur-sm md:p-5">
          <div className="grid grid-cols-1 items-stretch gap-1 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr] lg:gap-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -3, scale: 1.01 }}
              onMouseEnter={() => setActiveStage(0)}
              onMouseLeave={() => setActiveStage(null)}
              className="group relative rounded-2xl border border-border bg-card/90 p-4"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#38ac06]/16 blur-2xl" />
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#38ac06]/12 text-[#2f8f07]">
                <AudioLines className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">Guided Conversation</h3>
              <p className="mt-1 text-xs text-muted-foreground">Voice intake live</p>

              <div className="mt-4 rounded-xl border border-border bg-background/70 p-3">
                <div className="mb-2 inline-flex rounded-full border border-[#38ac06]/25 bg-[#38ac06]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2f8f07]">
                  Listening
                </div>
                <div className="flex h-10 items-end justify-center gap-1">
                  {waveformBars.map((bar) => (
                    <motion.span
                      key={bar}
                      className="w-1 rounded-full bg-gradient-to-t from-[#38ac06] to-[#224bc3]"
                      animate={{ height: [6, 14 + (bar % 5) * 3, 7, 12, 6] }}
                      transition={{
                        duration: 1,
                        delay: bar * 0.04,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.article>

            <StageConnector active={activeStage === null || activeStage === 0 || activeStage === 1} />

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: 0.08 }}
              whileHover={{ y: -4, scale: 1.012 }}
              onMouseEnter={() => setActiveStage(1)}
              onMouseLeave={() => setActiveStage(null)}
              className="group relative rounded-2xl border border-[#224bc3]/30 bg-gradient-to-br from-card via-[#fffffa]/90 to-[#224bc3]/[0.08] p-4 shadow-[0_20px_42px_-32px_rgba(34,75,195,0.58)]"
            >
              <motion.div
                className="pointer-events-none absolute -left-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#224bc3]/16 blur-2xl"
                animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#224bc3]/12 text-[#224bc3]">
                <Brain className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">AI Screening Engine</h3>
              <p className="mt-1 text-xs text-muted-foreground">Clinical context builder</p>

              <div className="relative mt-4 rounded-xl border border-border bg-card/92 p-3">
                <motion.div
                  className="mx-auto mb-3 h-12 w-12 rounded-full border border-[#224bc3]/35 bg-gradient-to-br from-[#224bc3]/20 to-[#38ac06]/20"
                  animate={{ scale: [1, 1.07, 1], boxShadow: ["0 0 0 0 rgba(34,75,195,0.2)", "0 0 0 10px rgba(34,75,195,0.04)", "0 0 0 0 rgba(34,75,195,0.2)"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="grid grid-cols-2 gap-1.5">
                  {screeningTags.map((tag, idx) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 + idx * 0.05, duration: 0.32 }}
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background/80 px-2 py-1 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.article>

            <StageConnector active={activeStage === null || activeStage === 1 || activeStage === 2} />

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              whileHover={{ y: -3, scale: 1.01 }}
              onMouseEnter={() => setActiveStage(2)}
              onMouseLeave={() => setActiveStage(null)}
              className="group relative rounded-2xl border border-border bg-card/90 p-4"
            >
              <div className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[#224bc3]/14 blur-2xl" />
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#224bc3]/12 text-[#224bc3]">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">Doctor-Ready Output</h3>
              <p className="mt-1 text-xs text-muted-foreground">Structured handoff report</p>

              <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-background/72 p-3">
                <motion.div
                  className="pointer-events-none absolute inset-y-0 -left-24 w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: [-120, 320] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
                />
                <div className="space-y-2">
                  {reportFields.map((field, idx) => (
                    <div key={field} className="rounded-lg border border-border bg-card/85 px-2.5 py-1.5">
                      <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{field}</p>
                      <motion.div
                        className="mt-1 h-1.5 rounded-full bg-[linear-gradient(90deg,rgba(56,172,6,0.28),rgba(34,75,195,0.32))]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${78 - idx * 8}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + idx * 0.08, duration: 0.35 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
