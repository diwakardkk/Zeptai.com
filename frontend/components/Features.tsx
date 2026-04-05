"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AudioLines,
  Binary,
  CheckCircle2,
  FileText,
  Globe2,
  Microscope,
  Sparkles,
} from "lucide-react";

type ModuleId = "voice" | "screening" | "summary" | "web" | "api";

const inputModules = [
  {
    id: "voice" as const,
    title: "Voice Intake",
    helper: "Guided conversation",
    icon: AudioLines,
    tone: "text-[#2f8f07]",
    ring: "border-[#38ac06]/35 bg-[#38ac06]/10",
  },
  {
    id: "screening" as const,
    title: "Clinical Screening",
    helper: "Symptoms and context",
    icon: CheckCircle2,
    tone: "text-[#224bc3]",
    ring: "border-[#224bc3]/35 bg-[#224bc3]/10",
  },
];

const outputModules = [
  {
    id: "summary" as const,
    title: "Doctor Summary",
    helper: "Ready before consult",
    icon: FileText,
    tone: "text-[#224bc3]",
    ring: "border-[#224bc3]/35 bg-[#224bc3]/10",
  },
  {
    id: "web" as const,
    title: "Web Access",
    helper: "Browser flow",
    icon: Globe2,
    tone: "text-[#2f8f07]",
    ring: "border-[#38ac06]/35 bg-[#38ac06]/10",
  },
  {
    id: "api" as const,
    title: "API Ready",
    helper: "Integration-ready",
    icon: Binary,
    tone: "text-[#224bc3]",
    ring: "border-[#224bc3]/35 bg-[#224bc3]/10",
  },
];

const liveSignals = ["Voice Active", "Screening", "Structuring", "Output Ready"];

export default function Features() {
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);

  const moduleOrder = useMemo(
    () => [...inputModules.map((m) => m.id), ...outputModules.map((m) => m.id)],
    [],
  );

  return (
    <section id="features" className="relative overflow-hidden bg-background py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-8 h-56 w-56 rounded-full bg-[#38ac06]/10 blur-[95px]" />
        <div className="absolute right-[-10%] top-6 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-5xl">
            Core Product Capabilities
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-black/65 md:text-lg">
            From voice intake to structured clinical output.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-black/10 bg-[#fffffa]/88 p-3.5 shadow-[0_26px_56px_-42px_rgba(0,0,0,0.6)] backdrop-blur-sm md:mt-7 md:p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white/84 px-3 py-2">
            <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              <Microscope className="h-3.5 w-3.5" />
              Research-Led Foundation
            </p>
            <span className="rounded-full border border-[#38ac06]/30 bg-[#38ac06]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f8f07]">
              Live System
            </span>
          </div>

          <div className="relative grid gap-3 md:grid-cols-[0.95fr_1.1fr_0.95fr] md:items-stretch">
            <div className="hidden md:block">
              <motion.span
                className="pointer-events-none absolute left-[31.5%] top-1/2 h-px w-[9%] -translate-y-1/2 bg-gradient-to-r from-[#38ac06]/60 to-[#224bc3]/30"
                animate={{ opacity: activeModule ? 0.35 : 0.75 }}
                transition={{ duration: 0.2 }}
              />
              <div className="space-y-2">
                {inputModules.map((module, index) => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.id;
                  const hasActive = activeModule !== null;

                  return (
                    <motion.button
                      key={module.id}
                      type="button"
                      onMouseEnter={() => setActiveModule(module.id)}
                      onMouseLeave={() => setActiveModule(null)}
                      onFocus={() => setActiveModule(module.id)}
                      onBlur={() => setActiveModule(null)}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.32, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={`w-full rounded-xl border bg-white/92 px-3 py-2.5 text-left transition ${
                        isActive
                          ? "border-[#38ac06]/45 shadow-[0_14px_30px_-24px_rgba(56,172,6,0.8)]"
                          : "border-black/10"
                      } ${hasActive && !isActive ? "opacity-45" : "opacity-100"}`}
                    >
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border ${module.ring}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${module.tone}`} />
                      </span>
                      <p className="mt-2 text-xs font-semibold text-black">{module.title}</p>
                      <p className={`text-[11px] ${isActive ? "text-black/70" : "text-black/50"}`}>
                        {module.helper}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div
              className="relative rounded-2xl border border-[#224bc3]/30 bg-gradient-to-br from-white via-[#fffffa] to-[#224bc3]/[0.08] px-4 py-4 text-center"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(34,75,195,0.18)",
                  "0 0 28px rgba(34,75,195,0.24)",
                  "0 0 0 rgba(34,75,195,0.18)",
                ],
              }}
              transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#38ac06]/70 to-transparent" />
              <motion.div
                className="mx-auto mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#224bc3]/30 bg-[#224bc3]/12 text-[#224bc3]"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              <p className="text-sm font-semibold text-black">ZeptAI Intake Engine</p>
              <p className="mt-1 text-xs text-black/62">Unified workflow orchestration</p>

              <div className="mt-3.5 grid grid-cols-2 gap-2">
                {liveSignals.map((signal, index) => (
                  <motion.span
                    key={signal}
                    className="rounded-full border border-black/10 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-black/65"
                    animate={{ opacity: [0.45, 1, 0.45] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  >
                    {signal}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <div className="hidden md:block">
              <motion.span
                className="pointer-events-none absolute right-[31.5%] top-1/2 h-px w-[9%] -translate-y-1/2 bg-gradient-to-r from-[#224bc3]/35 to-[#224bc3]/70"
                animate={{ opacity: activeModule ? 0.35 : 0.8 }}
                transition={{ duration: 0.2 }}
              />
              <div className="space-y-2">
                {outputModules.map((module, index) => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.id;
                  const hasActive = activeModule !== null;

                  return (
                    <motion.button
                      key={module.id}
                      type="button"
                      onMouseEnter={() => setActiveModule(module.id)}
                      onMouseLeave={() => setActiveModule(null)}
                      onFocus={() => setActiveModule(module.id)}
                      onBlur={() => setActiveModule(null)}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.32, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={`w-full rounded-xl border bg-white/92 px-3 py-2.5 text-left transition ${
                        isActive
                          ? "border-[#224bc3]/45 shadow-[0_14px_30px_-24px_rgba(34,75,195,0.8)]"
                          : "border-black/10"
                      } ${hasActive && !isActive ? "opacity-45" : "opacity-100"}`}
                    >
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border ${module.ring}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${module.tone}`} />
                      </span>
                      <p className="mt-2 text-xs font-semibold text-black">{module.title}</p>
                      <p className={`text-[11px] ${isActive ? "text-black/70" : "text-black/50"}`}>
                        {module.helper}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2 md:hidden">
              {moduleOrder.map((id) => {
                const capability = [...inputModules, ...outputModules].find((item) => item.id === id);
                if (!capability) return null;
                const Icon = capability.icon;
                return (
                  <motion.div
                    key={`mobile-${capability.id}`}
                    whileHover={{ y: -1.5 }}
                    className="rounded-xl border border-black/10 bg-white/92 px-3 py-2.5"
                  >
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-black">
                      <Icon className={`h-3.5 w-3.5 ${capability.tone}`} />
                      {capability.title}
                    </p>
                    <p className="mt-1 text-[11px] text-black/62">{capability.helper}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
