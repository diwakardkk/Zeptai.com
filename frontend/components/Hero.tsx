"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import VoiceInteractionPanel from "@/components/hero/VoiceInteractionPanel";

export default function Hero() {
  return (
    <section id="demo" className="relative overflow-hidden border-b border-border bg-background pt-12 pb-12 lg:pt-14 lg:pb-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
            className="absolute left-[-12%] top-[-14%] h-[340px] w-[340px] rounded-full bg-[#38ac06]/12 blur-[120px]"
          animate={{ opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute right-[-12%] top-[-8%] h-[430px] w-[430px] rounded-full bg-[#224bc3]/12 blur-[130px]"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,250,0.95),rgba(255,255,250,0.72)_40%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(9,9,9,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(9,9,9,0.045)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-7 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-card/90 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
            <motion.span
              className="h-2 w-2 rounded-full bg-[#38ac06]"
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            />
            Healthcare AI Research and Enterprise AI Platform
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.45rem] lg:leading-[1.02]">
            Reducing Doctor Stress with<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#38ac06] to-[#224bc3] bg-clip-text text-transparent">
              Intelligent Patient Intake
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg lg:mx-0">
            ZeptAI uses voice-based healthcare AI to capture patient symptoms, history,
            medications and converts them into clear, structured summaries that save
            doctors time and improve communication before consultation.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_-18px_rgba(34,75,195,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-18px_rgba(34,75,195,0.88)]"
            >
              Request Demo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#224bc3]/35 hover:text-[#224bc3]"
            >
              Read AI Insights
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#38ac06]/35 hover:text-[#2f8f07]"
            >
              <PlayCircle className="h-4 w-4" /> Try Live Intake
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="relative mx-auto w-full max-w-2xl lg:max-w-none"
        >
          <VoiceInteractionPanel />
        </motion.div>
      </div>
    </section>
  );
}
