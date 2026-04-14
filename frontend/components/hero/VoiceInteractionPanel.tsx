"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AudioLines, FileText } from "lucide-react";

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "ready" | "reporting";

type ReportPayload = {
  summary?: {
    summary_text?: string;
    chief_complaint?: string | null;
    duration?: string | null;
  };
  analysis?: {
    key_findings?: string[];
  };
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const STATE_META: Record<
  VoiceState,
  { label: string; helper: string; accent: string; badge: string }
> = {
  idle: {
    label: "Ready",
    helper: "Start voice flow",
    accent: "#224bc3",
    badge: "System idle",
  },
  listening: {
    label: "Listening",
    helper: "Patient speaking",
    accent: "#38ac06",
    badge: "Listening...",
  },
  processing: {
    label: "Processing",
    helper: "Clinical reasoning",
    accent: "#224bc3",
    badge: "Processing...",
  },
  speaking: {
    label: "Responding",
    helper: "AI speaking",
    accent: "#224bc3",
    badge: "Responding...",
  },
  ready: {
    label: "Ready",
    helper: "Generate report",
    accent: "#38ac06",
    badge: "Output ready",
  },
  reporting: {
    label: "Generating",
    helper: "Structuring summary",
    accent: "#224bc3",
    badge: "Generating...",
  },
};

const ENV_API_BASE = process.env.NEXT_PUBLIC_NURSE_API_BASE;
const BARS = Array.from({ length: 20 }, (_, i) => i);

function getApiCandidates() {
  const candidates = [ENV_API_BASE].filter((v): v is string => Boolean(v));

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";

    if (isLocalHost) {
      candidates.push("http://127.0.0.1:8000/api/v1", "http://127.0.0.1:8001/api/v1");
    }

    if (host === "zeptai.com" || host.endsWith(".zeptai.com")) {
      candidates.push("https://api.zeptai.com/api/v1");
    }
  }

  return Array.from(new Set(candidates)).map((base) => base.replace(/\/$/, ""));
}

async function resolveApiBase() {
  const candidates = getApiCandidates();
  for (const base of candidates) {
    try {
      const health = await fetch(`${base}/health`, { method: "GET" });
      if (health.ok) return base;
    } catch {
      // Try next.
    }
  }

  throw new Error(
    "Unable to connect to API. Start backend: cd backend/api && uvicorn app.main:app --host 0.0.0.0 --port 8000",
  );
}

async function parseJsonOrThrow(r: Response) {
  const raw = await r.text();
  let data: unknown = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    // keep raw
  }

  if (!r.ok) {
    const msg =
      data && typeof data === "object" && "detail" in data
        ? String((data as Record<string, unknown>).detail)
        : raw || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  return data as Record<string, unknown>;
}

function getRecognitionCtor() {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function mergeBotText(responseText: string, nextQuestionText: string) {
  const response = (responseText || "").trim();
  const next = (nextQuestionText || "").trim();

  if (!next) return response;
  if (!response) return next;
  if (response === next) return response;
  return `${response}\n\n${next}`;
}

export default function VoiceInteractionPanel() {
  const [state, setState] = useState<VoiceState>("idle");
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [apiBase, setApiBase] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionLabel, setConnectionLabel] = useState("Not connected");

  const timerRef = useRef<number[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef("");

  const meta = STATE_META[state];
  const isRunning =
    state === "listening" || state === "processing" || state === "speaking" || state === "reporting";

  const clearTimers = () => {
    timerRef.current.forEach((id) => window.clearTimeout(id));
    timerRef.current = [];
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakAssistant = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      const cleanText = text.trim();
      if (!cleanText) {
        resolve();
        return;
      }

      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        typeof window.SpeechSynthesisUtterance === "undefined"
      ) {
        resolve();
        return;
      }

      try {
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      stopListening();
      stopSpeaking();
    };
  }, []);

  const ensureConversation = useCallback(async () => {
    if (apiBase && conversationId) return { base: apiBase, cid: conversationId, greeting: "" };

    const base = apiBase ?? (await resolveApiBase());
    setApiBase(base);
    setConnectionLabel("Connected");

    const r = await fetch(`${base}/chat/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "en", voice_mode: false }),
    });
    const data = await parseJsonOrThrow(r);
    const cid = String(data.conversation_id ?? "");
    if (!cid) throw new Error("Missing conversation_id from API.");
    const greeting = typeof data.greeting === "string" ? data.greeting.trim() : "";

    setConversationId(cid);
    return { base, cid, greeting };
  }, [apiBase, conversationId]);

  const runAssistantTurn = useCallback(
    async (userText: string) => {
      const text = userText.trim();
      if (!text) {
        setState("ready");
        return;
      }

      const { base, cid } = await ensureConversation();
      setState("processing");

      const r = await fetch(`${base}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-conversation-id": cid,
        },
        body: JSON.stringify({ conversation_id: cid, message: text }),
      });
      const data = await parseJsonOrThrow(r);
      const reply = String(data.response ?? "I could not generate a response.");
      const nextQuestion =
        data.next_question && typeof data.next_question === "string" ? data.next_question.trim() : "";
      const spokenText = mergeBotText(reply, nextQuestion);

      setState("speaking");
      await speakAssistant(spokenText);
      setState("ready");
    },
    [ensureConversation, speakAssistant],
  );

  const startConversation = useCallback(async () => {
    if (isRunning) return;

    clearTimers();
    setShowReport(false);
    setReport(null);
    setError(null);

    try {
      const { greeting } = await ensureConversation();

      if (greeting) {
        setState("speaking");
        await speakAssistant(greeting);
      }

      setState("listening");

      const Ctor = getRecognitionCtor();
      if (!Ctor) {
        timerRef.current.push(
          window.setTimeout(() => {
            void runAssistantTurn("I have fever and cough for three days with chest discomfort.");
          }, 1200),
        );
        return;
      }

      transcriptRef.current = "";
      const recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const results = event?.results;
        if (!results || !results.length) return;

        let transcript = "";
        for (let i = 0; i < results.length; i += 1) {
          const segment = results[i]?.[0]?.transcript;
          if (segment) transcript += segment;
        }

        const clean = transcript.trim();
        if (clean) transcriptRef.current = clean;
      };

      recognition.onerror = () => {
        setError("Voice input unavailable. Using guided simulation.");
        stopListening();
        void runAssistantTurn("I have fever and cough for three days with chest discomfort.");
      };

      recognition.onend = () => {
        const captured = transcriptRef.current.trim();
        transcriptRef.current = "";
        void runAssistantTurn(captured || "I have fever and cough for three days with chest discomfort.");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      setState("idle");
      setConnectionLabel("Not connected");
      setError(err instanceof Error ? err.message : "Unable to start conversation.");
    }
  }, [ensureConversation, isRunning, runAssistantTurn, speakAssistant]);

  const generateReport = useCallback(async () => {
    clearTimers();
    setError(null);

    try {
      const { base, cid } = await ensureConversation();
      setState("reporting");

      const r = await fetch(`${base}/chat/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-conversation-id": cid,
        },
        body: JSON.stringify({ conversation_id: cid }),
      });
      const data = (await parseJsonOrThrow(r)) as unknown as ReportPayload;
      setReport(data);

      timerRef.current.push(
        window.setTimeout(() => {
          setShowReport(true);
          setState("ready");
        }, 800),
      );
    } catch (err: unknown) {
      setState("ready");
      setError(err instanceof Error ? err.message : "Unable to generate report.");
    }
  }, [ensureConversation]);

  const waveConfig = useMemo(() => {
    if (state === "listening") return { base: 26, variance: 16, duration: 0.62, ease: "easeInOut" as const };
    if (state === "processing") return { base: 18, variance: 6, duration: 1.15, ease: "easeInOut" as const };
    if (state === "speaking") return { base: 22, variance: 12, duration: 0.82, ease: "easeInOut" as const };
    if (state === "reporting") return { base: 16, variance: 8, duration: 0.95, ease: "easeInOut" as const };
    if (state === "ready") return { base: 14, variance: 4, duration: 1.2, ease: "easeInOut" as const };
    return { base: 10, variance: 3, duration: 1.4, ease: "easeInOut" as const };
  }, [state]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-border bg-card/88 p-3 shadow-[0_26px_54px_-38px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="pointer-events-none absolute -left-10 top-2 h-28 w-28 rounded-full bg-[#38ac06]/12 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 bottom-2 h-32 w-32 rounded-full bg-[#224bc3]/12 blur-2xl" />

      <div className="relative rounded-2xl border border-border bg-card/95 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
            <AudioLines className="h-3.5 w-3.5" />
            Voice Interface
          </p>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {connectionLabel}
          </span>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="relative h-40 w-full max-w-[340px]">
            <motion.div
              className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
              animate={{
                scale:
                  state === "listening"
                    ? [1, 1.08, 1]
                    : state === "speaking"
                    ? [1, 1.05, 1]
                    : state === "processing"
                    ? [1, 1.03, 1]
                    : [1, 1.02, 1],
                boxShadow: [
                  `0 0 0 0 ${meta.accent}20`,
                  `0 0 30px 2px ${meta.accent}55`,
                  `0 0 0 0 ${meta.accent}20`,
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: `radial-gradient(circle at 35% 30%, #ffffff, ${meta.accent}22)` }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
              animate={{ rotate: state === "processing" || state === "reporting" ? 360 : 0 }}
              transition={{
                duration: state === "processing" || state === "reporting" ? 4.8 : 0.4,
                repeat: state === "processing" || state === "reporting" ? Infinity : 0,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
              animate={{
                scale:
                  state === "listening" || state === "speaking"
                    ? [1, 1.08, 1]
                    : [1, 1.03, 1],
                opacity: [0.35, 0.85, 0.35],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute inset-x-2 bottom-2 flex h-16 items-end justify-center gap-1.5">
              {BARS.map((bar) => {
                const midpoint = Math.abs(10 - bar);
                const peak = waveConfig.base + (waveConfig.variance - midpoint);
                const resting = Math.max(8, waveConfig.base - midpoint / 2);
                return (
                  <motion.span
                    key={bar}
                    className="w-1.5 rounded-full"
                    style={{ backgroundColor: meta.accent }}
                    animate={{ height: [resting, peak, resting], opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: waveConfig.duration + (bar % 4) * 0.07,
                      repeat: Infinity,
                      ease: waveConfig.ease,
                      delay: (bar % 5) * 0.04,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.13em]" style={{ color: meta.accent }}>
            {meta.label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{meta.helper}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={startConversation}
              disabled={isRunning}
              className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-20px_rgba(34,75,195,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(34,75,195,0.9)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRunning ? meta.badge : "Start Conversation"}
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </button>

            <AnimatePresence>
              {(state === "ready" || showReport || state === "reporting") && (
                <motion.button
                  type="button"
                  onClick={generateReport}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#224bc3]/30 bg-[#224bc3]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#224bc3] transition hover:-translate-y-0.5 hover:bg-[#224bc3]/15"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Generate Report
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <AnimatePresence>
          {showReport && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-xl border border-border bg-background p-3"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#224bc3]">
                Structured Clinical Summary
              </p>
              <div className="mt-2.5 space-y-1.5">
                {[
                  report?.summary?.chief_complaint ? 92 : 72,
                  report?.summary?.duration ? 84 : 66,
                  report?.analysis?.key_findings?.length ? 76 : 58,
                  report?.summary?.summary_text ? 88 : 80,
                ].map((width, idx) => (
                  <motion.div
                    key={`${width}-${idx}`}
                    className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(56,172,6,0.3),rgba(34,75,195,0.28))]"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${width}%`, opacity: 1 }}
                    transition={{ duration: 0.35, delay: idx * 0.1, ease: "easeOut" }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
