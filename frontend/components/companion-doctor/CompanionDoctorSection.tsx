"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Languages, MessageSquareText, Mic, ShieldCheck, TriangleAlert } from "lucide-react";

export default function CompanionDoctorSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-12 md:py-14" aria-labelledby="companion-doctor-heading">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-8 h-48 w-48 rounded-full bg-[#38ac06]/10 blur-[85px]" />
        <div className="absolute right-[-10%] top-10 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,172,6,0.08),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(34,75,195,0.08),transparent_36%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-card/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              <HeartPulse className="h-3.5 w-3.5" />
              New ZeptAI Experience
            </span>
            <h2 id="companion-doctor-heading" className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-[2.65rem] md:leading-[1.06]">
              Talk to a Doctor-like<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
                AI Companion
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              A calm, voice-first wellness companion for gentle health support in Hindi, English, and natural Hinglish.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Feeling stressed, tired, or unwell? Talk naturally and get a calm guided response.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/companion-doctor"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_-20px_rgba(34,75,195,0.78)] transition hover:-translate-y-0.5"
              >
                <Mic className="h-4 w-4" />
                Try Voice Conversation
              </Link>
              <Link
                href="/companion-doctor?mode=text"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#224bc3]/35 hover:text-[#224bc3]"
              >
                <MessageSquareText className="h-4 w-4" />
                Text Mode
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#38ac06]/25 bg-[#38ac06]/10 px-3 py-1 text-[#2f8f07]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Your conversation is not stored
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-card/92 px-3 py-1 text-[#224bc3]">
                <Languages className="h-3.5 w-3.5" />
                Hindi + English + Hinglish
              </span>
            </div>

            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              <TriangleAlert className="h-3.5 w-3.5 text-[#d97706]" />
              Not for emergencies or urgent medical situations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative"
          >
            <div className="rounded-[30px] border border-border bg-card/92 p-5 shadow-[0_28px_58px_-44px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-6">
              <div className="grid gap-3 md:grid-cols-[1fr_0.92fr]">
                <div className="rounded-[24px] border border-border bg-background/80 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#224bc3]/25 bg-card/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
                      Live Voice Demo
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Free demo with limited usage
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,172,6,0.24),rgba(34,75,195,0.12))]">
                      <motion.div
                        className="absolute h-20 w-20 rounded-full border border-[#224bc3]/20"
                        animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.65, 0.3] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <Mic className="h-8 w-8 text-[#224bc3]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Warm, doctor-like support</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Soft turn-taking, interruption-aware playback, and bilingual support built as a separate companion flow.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-border bg-[linear-gradient(180deg,rgba(34,75,195,0.06),rgba(56,172,6,0.08))] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">Example</p>
                  <p className="mt-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-sm leading-6 text-foreground shadow-sm">
                    &ldquo;I understand. That sounds tiring. Since you&apos;ve been feeling low and not sleeping well, can you tell me whether this is mostly stress, body weakness, or both?&rdquo;
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>One tap to start listening</p>
                    <p>Interrupt any time and the audio stops immediately</p>
                    <p>Switch to text if mic permission is unavailable</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}