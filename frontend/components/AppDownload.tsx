"use client";

import { motion } from "framer-motion";
import { ArrowRight, Binary, Building2, Cpu, Globe2, Layers3, Sparkles } from "lucide-react";
import { useState } from "react";

type Mode = "web" | "api" | null;

export default function AppDownload() {
  const [activeMode, setActiveMode] = useState<Mode>(null);

  return (
    <section id="access" className="relative overflow-hidden bg-background py-14 md:py-20">
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

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-[#224bc3]/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]"
          >
            <Layers3 className="h-3.5 w-3.5" />
            Web Access + Enterprise API
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            One intake engine. Two ways to deploy.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base"
          >
            Use ZeptAI directly on the web or integrate it into healthcare platforms through API.
          </motion.p>
        </div>

        {/* 3-panel engine diagram */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-10 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-0"
        >
          {/* Web Access */}
          <motion.article
            onMouseEnter={() => setActiveMode("web")}
            onMouseLeave={() => setActiveMode(null)}
            whileHover={{ y: -3 }}
            className={`flex-1 rounded-2xl border bg-card p-5 transition-all duration-200 ${
              activeMode === "web"
                ? "border-[#38ac06]/50 shadow-[0_8px_28px_-12px_rgba(56,172,6,0.45)]"
                : "border-border shadow-sm"
            }`}
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 ${
                activeMode === "web"
                  ? "border-[#38ac06]/30 bg-[#38ac06]/15 text-[#38ac06]"
                  : "border-border bg-muted/60 text-[#38ac06]"
              }`}
            >
              <Globe2 className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">Web Access</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Ready-to-use browser intake — no setup required.
            </p>
          </motion.article>

          {/* Connector arrow left */}
          <div className="flex items-center justify-center px-2 py-1 md:py-0">
            <motion.span
              animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#38ac06]"
            >
              <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
            </motion.span>
          </div>

          {/* Unified Engine — center, prominent */}
          <motion.article
            whileHover={{ y: -3 }}
            className="relative flex-1 overflow-hidden rounded-2xl border border-[#224bc3]/40 bg-[#224bc3]/8 p-5 text-center shadow-[0_0_0_1px_rgba(34,75,195,0.12)] transition-all duration-200 hover:shadow-[0_8px_32px_-12px_rgba(34,75,195,0.45)] md:flex-[1.15]"
          >
            {/* Animated ring on icon */}
            <div className="relative mx-auto w-fit">
              <motion.span
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0px rgba(34,75,195,0.30)",
                    "0 0 0 6px rgba(34,75,195,0.10)",
                    "0 0 0 0px rgba(34,75,195,0.30)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#224bc3]/35 bg-[#224bc3]/15 text-[#224bc3]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cpu className="h-5 w-5" />
              </motion.span>
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">Unified Intake Engine</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Voice + logic + summary
            </p>
          </motion.article>

          {/* Connector arrow right */}
          <div className="flex items-center justify-center px-2 py-1 md:py-0">
            <motion.span
              animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="text-[#224bc3]"
            >
              <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
            </motion.span>
          </div>

          {/* Enterprise API */}
          <motion.article
            onMouseEnter={() => setActiveMode("api")}
            onMouseLeave={() => setActiveMode(null)}
            whileHover={{ y: -3 }}
            className={`flex-1 rounded-2xl border bg-card p-5 transition-all duration-200 ${
              activeMode === "api"
                ? "border-[#224bc3]/50 shadow-[0_8px_28px_-12px_rgba(34,75,195,0.45)]"
                : "border-border shadow-sm"
            }`}
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 ${
                activeMode === "api"
                  ? "border-[#224bc3]/30 bg-[#224bc3]/15 text-[#224bc3]"
                  : "border-border bg-muted/60 text-[#224bc3]"
              }`}
            >
              <Building2 className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">Enterprise API</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Plug directly into your healthcare platform.
            </p>
          </motion.article>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2"
        >
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#38ac06]/35 bg-[#38ac06]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#38ac06] transition hover:bg-[#38ac06]/18"
          >
            <Globe2 className="h-3.5 w-3.5" />
            Try Web Intake
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#224bc3]/35 bg-[#224bc3]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#224bc3] transition hover:bg-[#224bc3]/18"
          >
            <Binary className="h-3.5 w-3.5" />
            Explore API Access
          </a>
        </motion.div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[#224bc3]" />
          One core workflow for patients and platforms
        </div>

      </div>
    </section>
  );
}

