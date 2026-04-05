"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Mic, Sparkles } from "lucide-react";
import NurseChat from "./NurseChat";

type AssistantState = "idle" | "bot_speaking" | "listening" | "processing" | "report_ready";

export default function ChatbotDemo() {
  const [isListening, setIsListening] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");

  useEffect(() => {
    const onListeningState = (event: Event) => {
      const custom = event as CustomEvent<{ listening?: boolean }>;
      setIsListening(Boolean(custom.detail?.listening));
    };

    const onAssistantState = (event: Event) => {
      const custom = event as CustomEvent<{ state?: AssistantState }>;
      if (custom.detail?.state) {
        setAssistantState(custom.detail.state);
      }
    };

    window.addEventListener("nursechat-listening-state", onListeningState);
    window.addEventListener("nursechat-assistant-state", onAssistantState);

    return () => {
      window.removeEventListener("nursechat-listening-state", onListeningState);
      window.removeEventListener("nursechat-assistant-state", onAssistantState);
    };
  }, []);

  function toggleSpeaking() {
    window.dispatchEvent(new Event("nursechat-toggle-listening"));
  }

  const stateMeta = useMemo(() => {
    if (assistantState === "listening") {
      return {
        label: "Listening",
        description: "Patient turn is active. Speak naturally and we will auto-capture.",
        chipClass: "border-[#38ac06]/35 bg-[#38ac06]/15 text-[#2f8f07]",
      };
    }

    if (assistantState === "processing") {
      return {
        label: "Processing",
        description: "Assistant is structuring your latest response.",
        chipClass: "border-[#224bc3]/35 bg-[#224bc3]/12 text-[#224bc3]",
      };
    }

    if (assistantState === "bot_speaking") {
      return {
        label: "Bot Turn",
        description: "Assistant is guiding the next clinical intake step.",
        chipClass: "border-[#224bc3]/30 bg-[#224bc3]/10 text-[#224bc3]",
      };
    }

    if (assistantState === "report_ready") {
      return {
        label: "Report Ready",
        description: "Structured intake report is available in the panel.",
        chipClass: "border-[#38ac06]/35 bg-[#38ac06]/15 text-[#2f8f07]",
      };
    }

    return {
      label: "Ready",
      description: "Start conversation to begin the live AI intake workflow.",
      chipClass: "border-black/15 bg-white/80 text-black/65",
    };
  }, [assistantState]);

  const isSignalActive =
    assistantState === "listening" || assistantState === "processing" || assistantState === "bot_speaking";

  return (
    <section id="demo" className="relative overflow-hidden border-y border-black/10 bg-[#fffffa] py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-8 h-72 w-72 rounded-full bg-[#38ac06]/10 blur-[120px]" />
        <div className="absolute right-[-12%] top-0 h-96 w-96 rounded-full bg-[#224bc3]/12 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-14 lg:flex-row">
          <div className="lg:w-1/2">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 inline-flex rounded-full border border-[#224bc3]/25 bg-white/80 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]"
            >
              Try Live Intake
            </motion.span>

            <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-5xl md:leading-tight">
              Experience a Conversational AI Intake Assistant in Real Time
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/70">
              This live website demo simulates a guided patient intake conversation with voice capture,
              AI follow-up questions, and structured report generation for clinical review.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-white/85 p-4 shadow-[0_20px_38px_-28px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.13em] ${stateMeta.chipClass}`}>
                  {stateMeta.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-black/65">{stateMeta.description}</p>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
              <p className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 p-3">
                <Cpu className="h-4 w-4 text-[#224bc3]" /> Live conversational turn handling
              </p>
              <p className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 p-3">
                <Activity className="h-4 w-4 text-[#38ac06]" /> Voice capture + structured reporting
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#fffffa]/88 p-2 shadow-[0_30px_75px_-45px_rgba(0,0,0,0.65)] backdrop-blur-sm"
            >
              <div className="rounded-[1.4rem] border border-black/10 bg-white/85 px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      <motion.span
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#38ac06]/45 to-[#224bc3]/45"
                        animate={
                          isSignalActive
                            ? { scale: [1, 1.35, 1], opacity: [0.4, 0.12, 0.4] }
                            : { scale: 1, opacity: 0.2 }
                        }
                        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="relative inline-flex h-4 w-4 rounded-full bg-gradient-to-br from-[#38ac06] to-[#224bc3]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">ZeptAI Conversational Intake</p>
                      <p className="text-xs text-black/55">Website demo · Voice + Chat + Report</p>
                    </div>
                  </div>

                  <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.13em] ${stateMeta.chipClass}`}>
                    {stateMeta.label}
                  </span>
                </div>
              </div>

              <div className="mt-2 h-[560px] overflow-hidden rounded-[1.4rem] border border-black/10 bg-white/70">
                <NurseChat />
              </div>

              <div className="mt-2 rounded-[1.4rem] border border-black/10 bg-white/85 p-3">
                <button
                  onClick={toggleSpeaking}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${
                    isListening
                      ? "border-[#38ac06]/45 bg-[#38ac06]/15 text-[#2f8f07] hover:bg-[#38ac06]/20"
                      : "border-transparent bg-gradient-to-r from-[#38ac06] to-[#224bc3] text-white shadow-[0_14px_28px_-18px_rgba(34,75,195,0.9)] hover:-translate-y-0.5"
                  }`}
                >
                  {isListening ? <Sparkles className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isListening ? "Stop Conversation" : "Start Conversation"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
