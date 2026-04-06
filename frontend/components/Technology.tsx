"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Code2,
  Cpu,
  FileText,
  Globe2,
  Server,
  Users,
} from "lucide-react";

const branchChips = {
  web: [
    { label: "Browser Intake", icon: Globe2 },
    { label: "Report Layer", icon: FileText },
  ],
  api: [
    { label: "FastAPI Backend", icon: Server },
    { label: "Platform Integrations", icon: Users },
  ],
};

export default function Technology() {
  return (
    <section
      id="technology"
      className="relative overflow-hidden border-y border-border bg-background py-12 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-6 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]" />
        <div className="absolute right-[-10%] top-8 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Web-Based Patient Intake & API Infrastructure
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            One unified intake engine powering both web intake and API delivery.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto mt-6 max-w-6xl rounded-3xl border border-border bg-card/85 p-4 shadow-[0_24px_56px_-40px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-6"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Voice-First", icon: AudioLines, tone: "text-[#2f8f07]" },
              { label: "Research Logic", icon: Code2, tone: "text-[#224bc3]" },
            ].map((chip) => {
              const Icon = chip.icon;
              return (
                <motion.div
                  key={chip.label}
                  whileHover={{ y: -1 }}
                  className="rounded-xl border border-border bg-card/85 px-3 py-2"
                >
                  <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <Icon className={`h-3.5 w-3.5 ${chip.tone}`} />
                    {chip.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-center">
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-[#224bc3]/30 bg-gradient-to-br from-white to-[#224bc3]/[0.08] px-4 py-3.5 text-center"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(34,75,195,0.18)",
                  "0 0 24px rgba(34,75,195,0.26)",
                  "0 0 0 rgba(34,75,195,0.18)",
                ],
              }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Cpu className="h-4 w-4 text-[#224bc3]" />
                Unified Intake Engine
              </p>
            </motion.div>
          </div>

          <div className="relative mt-4 pt-5">
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-[#224bc3]/65 to-[#224bc3]/20" />
              <div className="absolute left-1/4 right-1/4 top-4 h-px bg-gradient-to-r from-[#38ac06]/40 via-[#224bc3]/50 to-[#224bc3]/40" />
              <div className="absolute left-1/4 top-4 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-[#224bc3]/50 to-[#224bc3]/20" />
              <div className="absolute right-1/4 top-4 h-4 w-px translate-x-1/2 bg-gradient-to-b from-[#224bc3]/50 to-[#224bc3]/20" />
              <motion.div
                className="absolute left-1/4 top-[13px] h-2 w-2 rounded-full bg-[#38ac06]"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute right-1/4 top-[13px] h-2 w-2 rounded-full bg-[#224bc3]"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-border bg-card/90 p-4"
              >
                <p className="text-sm font-semibold text-foreground">Web Intake</p>
                <div className="mt-3 grid gap-2">
                  {branchChips.web.map((chip) => {
                    const Icon = chip.icon;
                    return (
                      <div
                        key={chip.label}
                        className="rounded-xl border border-border bg-[#fffffa] px-3 py-2 text-xs text-muted-foreground"
                      >
                        <p className="inline-flex items-center gap-2 font-medium">
                          <Icon className="h-3.5 w-3.5 text-[#2f8f07]" />
                          {chip.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-border bg-card/90 p-4"
              >
                <p className="text-sm font-semibold text-foreground">API Infrastructure</p>
                <div className="mt-3 grid gap-2">
                  {branchChips.api.map((chip) => {
                    const Icon = chip.icon;
                    return (
                      <div
                        key={chip.label}
                        className="rounded-xl border border-border bg-[#fffffa] px-3 py-2 text-xs text-muted-foreground"
                      >
                        <p className="inline-flex items-center gap-2 font-medium">
                          <Icon className="h-3.5 w-3.5 text-[#224bc3]" />
                          {chip.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
