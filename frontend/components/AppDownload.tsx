"use client";

import { motion } from "framer-motion";
import { Binary, Building2, Cpu, Globe2, Layers3, Sparkles } from "lucide-react";
import { useState } from "react";

type Mode = "web" | "api" | null;

export default function AppDownload() {
  const [activeMode, setActiveMode] = useState<Mode>(null);

  return (
    <section id="access" className="relative overflow-hidden bg-background py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[-10%] top-8 h-56 w-56 rounded-full bg-[#38ac06]/10 blur-[90px]"
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-10%] top-8 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[105px]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[28px] border border-black/10 bg-[#fffffa]/85 p-5 shadow-[0_26px_56px_-42px_rgba(0,0,0,0.58)] backdrop-blur-sm md:p-7"
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-white/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              <Layers3 className="h-3.5 w-3.5" />
              Web Access + Enterprise API
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-5xl">
              One intake engine. Two ways to deploy.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-black/65 md:text-base">
              Use ZeptAI directly on the web or integrate it into healthcare platforms through API.
            </p>
          </div>

          <div className="relative mt-6 md:mt-7">
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <motion.div
                className="absolute left-[18%] right-1/2 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[#38ac06]/55 to-[#224bc3]/30"
                animate={{ opacity: activeMode === "api" ? 0.35 : 0.9 }}
                transition={{ duration: 0.25 }}
              />
              <motion.div
                className="absolute left-1/2 right-[18%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[#224bc3]/30 to-[#224bc3]/65"
                animate={{ opacity: activeMode === "web" ? 0.35 : 0.9 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute left-[35%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#38ac06]"
                animate={{ x: [0, 26, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute right-[35%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#224bc3]"
                animate={{ x: [0, -26, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
            </div>

            <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
              <motion.article
                onMouseEnter={() => setActiveMode("web")}
                onMouseLeave={() => setActiveMode(null)}
                whileHover={{ y: -3 }}
                className={`group relative overflow-hidden rounded-2xl border bg-white/92 p-4 transition-colors ${
                  activeMode === "web"
                    ? "border-[#38ac06]/45 shadow-[0_12px_34px_-26px_rgba(56,172,6,0.7)]"
                    : "border-black/10"
                }`}
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#38ac06]/8 via-transparent to-transparent"
                  animate={{ opacity: activeMode === "web" ? 1 : 0.55 }}
                />
                <div className="relative">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#38ac06]/12 text-[#2f8f07]">
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-black">Web Access</p>
                  <p className="mt-1 text-xs text-black/60">Browser intake</p>
                </div>
              </motion.article>

              <motion.article
                whileHover={{ y: -2, scale: 1.01 }}
                className="relative overflow-hidden rounded-2xl border border-[#224bc3]/35 bg-gradient-to-br from-white to-[#224bc3]/[0.08] px-4 py-4 text-center md:min-w-[240px]"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(34,75,195,0.2)",
                    "0 0 26px rgba(34,75,195,0.24)",
                    "0 0 0 rgba(34,75,195,0.2)",
                  ],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span
                  className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#224bc3]/12 text-[#224bc3]"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Cpu className="h-4 w-4" />
                </motion.span>
                <p className="mt-3 text-sm font-semibold text-black">Unified Intake Engine</p>
                <p className="mt-1 text-xs text-black/60">Voice + logic + summary</p>
              </motion.article>

              <motion.article
                onMouseEnter={() => setActiveMode("api")}
                onMouseLeave={() => setActiveMode(null)}
                whileHover={{ y: -3 }}
                className={`group relative overflow-hidden rounded-2xl border bg-white/92 p-4 transition-colors ${
                  activeMode === "api"
                    ? "border-[#224bc3]/45 shadow-[0_12px_34px_-26px_rgba(34,75,195,0.7)]"
                    : "border-black/10"
                }`}
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-[#224bc3]/10 via-transparent to-transparent"
                  animate={{ opacity: activeMode === "api" ? 1 : 0.55 }}
                />
                <div className="relative">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#224bc3]/12 text-[#224bc3]">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-black">Enterprise API</p>
                  <p className="mt-1 text-xs text-black/60">Platform integration</p>
                </div>
              </motion.article>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#38ac06]/35 bg-[#38ac06]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#2f8f07] transition hover:bg-[#38ac06]/15"
            >
              <Globe2 className="h-4 w-4" />
              Try Web Intake
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#224bc3]/35 bg-[#224bc3]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#224bc3] transition hover:bg-[#224bc3]/15"
            >
              <Binary className="h-4 w-4" />
              Explore API Access
            </a>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-medium text-black/55">
            <Sparkles className="h-3.5 w-3.5 text-[#224bc3]" />
            One core workflow for patients and platforms
          </div>
        </motion.div>
      </div>
    </section>
  );
}
