"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AudioLines, FileText } from "lucide-react";

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "ready" | "reporting";

type ReportPayload = {
  generated_at?: string;
  summary?: {
    summary_text?: string;
    chief_complaint?: string | null;
    duration?: string | null;
    questions_completed?: number;
    total_turns?: number;
  };
  analysis?: {
    key_findings?: string[];
    risk_level?: string;
    red_flags?: string[];
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
const MAX_CONVERSATION_MS = 5 * 60 * 1000;
const LISTENING_IDLE_TIMEOUT_MS = 90 * 1000;
const API_RESPONSE_TIMEOUT_MS = 45 * 1000;
const REPORT_RESPONSE_TIMEOUT_MS = 60 * 1000;

function getApiCandidates() {
  const candidates: string[] = [];

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";

    if (isLocalHost) {
      candidates.push("http://127.0.0.1:8000/api/v1", "http://127.0.0.1:8001/api/v1");
    } else {
      // Prefer same-origin proxy in production to avoid CORS/network flakiness.
      candidates.push('/api/nurse-proxy');
    }
  }

  if (ENV_API_BASE?.trim()) {
    candidates.push(ENV_API_BASE.trim());
  }

  return Array.from(new Set(candidates)).map((base) => base.replace(/\/$/, ""));
}

async function resolveApiBase() {
  const candidates = getApiCandidates();

  if (!candidates.length) {
    throw new Error("Conversation service is not configured. Please try again later.");
  }

  for (const base of candidates) {
    try {
      const health = await fetch(`${base}/health`, { method: "GET" });
      if (health.ok) return base;
    } catch (e) {
      // Try next candidate on transient errors.
      // eslint-disable-next-line no-console
      console.debug('health check failed for', base, e);
    }
  }

  throw new Error("Conversation service is temporarily unavailable. Please try again later.");
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
        : data && typeof data === "object" && "error" in data
        ? String((data as Record<string, unknown>).error)
        : raw || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  return data as Record<string, unknown>;
}

function getRecognitionCtor() {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function stripQuestionLabels(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*q\d+\s*[:.)-]?\s*/i, ""))
    .filter((line) => line.trim().length > 0)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function mergeBotText(responseText: string, nextQuestionText: string) {
  const response = stripQuestionLabels(responseText || "");
  const next = stripQuestionLabels(nextQuestionText || "");

  if (!next) return response;
  if (!response) return next;
  if (response === next) return response;
  return `${response}\n\n${next}`;
}

function formatTimeLeft(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function VoiceInteractionPanel() {
  const [state, setState] = useState<VoiceState>("idle");
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [apiBase, setApiBase] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [timeLeftLabel, setTimeLeftLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionLabel, setConnectionLabel] = useState("Not connected");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackMessageType, setFeedbackMessageType] = useState<"success" | "error" | null>(null);

  const timerRef = useRef<number[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef("");
  const listeningIdleTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const shouldProcessOnEndRef = useRef(true);
  const autoReportTriggeredRef = useRef(false);
  const generateReportRef = useRef<() => Promise<void>>(async () => {});
  const runAssistantTurnRef = useRef<(userText: string) => Promise<void>>(async () => {});

  const meta = STATE_META[state];
  const isRunning =
    state === "listening" || state === "processing" || state === "speaking" || state === "reporting";

  const clearTimers = useCallback(() => {
    timerRef.current.forEach((id) => window.clearTimeout(id));
    timerRef.current = [];
  }, []);

  const clearListeningIdleTimer = useCallback(() => {
    if (listeningIdleTimerRef.current !== null) {
      window.clearTimeout(listeningIdleTimerRef.current);
      listeningIdleTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback((processOnEnd = false) => {
    clearListeningIdleTimer();
    shouldProcessOnEndRef.current = processOnEnd;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, [clearListeningIdleTimer]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const fetchWithTimeout = useCallback(
    async (url: string, init: RequestInit, timeoutMs = API_RESPONSE_TIMEOUT_MS) => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

      try {
        return await fetch(url, { ...init, signal: controller.signal });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new Error("Request timed out. Please try again.");
        }
        throw error;
      } finally {
        window.clearTimeout(timeoutId);
      }
    },
    [],
  );

  const speakWithBrowser = useCallback((cleanText: string) => {
    return new Promise<void>((resolve) => {
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
  }, [stopSpeaking]);

  const speakWithElevenLabs = useCallback(async (cleanText: string) => {
    stopSpeaking();

    const response = await fetch("/api/tts/elevenlabs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: cleanText }),
    });

    if (!response.ok) {
      let message = `ElevenLabs TTS failed (${response.status}).`;
      try {
        const data = (await response.json()) as { error?: string };
        if (data?.error) message = data.error;
      } catch {
        try {
          const text = await response.text();
          if (text) message = text;
        } catch {
          // Use fallback message.
        }
      }
      throw new Error(message);
    }

    const audioBlob = await response.blob();
    if (!audioBlob.size) {
      throw new Error("ElevenLabs returned empty audio.");
    }

    const objectUrl = URL.createObjectURL(audioBlob);
    audioUrlRef.current = objectUrl;
    const audio = new Audio(objectUrl);
    audioRef.current = audio;

    await new Promise<void>((resolve) => {
      const finalize = () => {
        audio.onended = null;
        audio.onerror = null;
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        if (audioUrlRef.current === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          audioUrlRef.current = null;
        }
        resolve();
      };

      audio.onended = finalize;
      audio.onerror = finalize;
      audio.play().catch(() => finalize());
    });
  }, [stopSpeaking]);

  const speakAssistant = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    try {
      setError(null);
      await speakWithElevenLabs(cleanText);
      return;
    } catch (err: unknown) {
      const fallbackReason = err instanceof Error ? err.message.toLowerCase() : "";
      if (fallbackReason.includes("quota_exceeded")) {
        setError("ElevenLabs quota exceeded. Falling back to browser voice.");
      } else {
        setError("ElevenLabs unavailable right now. Falling back to browser voice.");
      }
      await speakWithBrowser(cleanText);
    }
  }, [speakWithBrowser, speakWithElevenLabs]);

  const listenForPatient = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setState("ready");
      setError("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    stopListening(false);
    shouldProcessOnEndRef.current = true;
    transcriptRef.current = "";
    setState("listening");
    setError(null);

    const armListeningIdleTimer = () => {
      clearListeningIdleTimer();
      listeningIdleTimerRef.current = window.setTimeout(() => {
        stopListening(false);
        setState("ready");
        setConnectionLabel("Session paused");
        setError(
          "No response detected for 90 seconds. Listening stopped to protect privacy. Restart when ready.",
        );
      }, LISTENING_IDLE_TIMEOUT_MS);
    };

    armListeningIdleTimer();

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
      if (clean) {
        transcriptRef.current = clean;
        armListeningIdleTimer();
      }
    };

    recognition.onerror = (event: any) => {
      const reason = event?.error ? String(event.error) : "unknown_error";
      setError(`Voice capture failed (${reason}). Please try again.`);
      stopListening(false);
      setState("ready");
    };

    recognition.onend = () => {
      clearListeningIdleTimer();
      recognitionRef.current = null;

      if (!shouldProcessOnEndRef.current) {
        shouldProcessOnEndRef.current = true;
        transcriptRef.current = "";
        return;
      }

      const captured = transcriptRef.current.trim();
      transcriptRef.current = "";

      if (!captured) {
        setState("ready");
        setError("No speech detected. Tap Start Conversation and try again.");
        return;
      }

      void runAssistantTurnRef.current(captured);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [clearListeningIdleTimer, stopListening]);

  useEffect(() => {
    return () => {
      clearTimers();
      stopListening(false);
      stopSpeaking();
    };
  }, [clearTimers, stopListening, stopSpeaking]);

  useEffect(() => {
    if (!sessionEndsAt) {
      setTimeLeftLabel(null);
      return;
    }

    const updateTimeLeft = () => {
      const remainingMs = sessionEndsAt - Date.now();
      setTimeLeftLabel(formatTimeLeft(remainingMs));
    };

    updateTimeLeft();
    const intervalId = window.setInterval(updateTimeLeft, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sessionEndsAt]);

  const ensureConversation = useCallback(async () => {
    if (apiBase && conversationId) return { base: apiBase, cid: conversationId, greeting: "" };

    const base = apiBase ?? (await resolveApiBase());
    setApiBase(base);
    setConnectionLabel("Connected");

    const r = await fetchWithTimeout(`${base}/chat/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "en", voice_mode: false }),
    });
    const data = await parseJsonOrThrow(r);
    const cid = String(data.conversation_id ?? "");
    if (!cid) throw new Error("Missing conversation_id from API.");
    const greeting = typeof data.greeting === "string" ? stripQuestionLabels(data.greeting) : "";

    setConversationId(cid);
    return { base, cid, greeting };
  }, [apiBase, conversationId, fetchWithTimeout]);

  const runAssistantTurn = useCallback(
    async (userText: string) => {
      const text = userText.trim();
      if (!text) {
        setState("ready");
        return;
      }

      try {
        const { base, cid } = await ensureConversation();
        setState("processing");

        const r = await fetchWithTimeout(`${base}/chat/message`, {
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

        if (autoReportTriggeredRef.current) return;

        timerRef.current.push(
          window.setTimeout(() => {
            listenForPatient();
          }, 220),
        );
      } catch (err: unknown) {
        stopListening(false);
        setState("ready");
        setConnectionLabel("Session paused");
        console.error(err);
        setError("Service temporarily unavailable. Please try again.");
      }
    },
    [ensureConversation, fetchWithTimeout, listenForPatient, speakAssistant, stopListening],
  );

  useEffect(() => {
    runAssistantTurnRef.current = runAssistantTurn;
  }, [runAssistantTurn]);

  const startConversation = useCallback(async () => {
    if (isRunning) return;

    clearTimers();
    stopListening(false);
    stopSpeaking();
    setSessionEndsAt(null);
    setTimeLeftLabel(null);
    setShowReport(false);
    setReport(null);
    setError(null);
    setFeedbackName("");
    setFeedbackEmail("");
    setFeedbackText("");
    setFeedbackMessage(null);
    setFeedbackMessageType(null);
    setConnectionLabel("Connecting...");

    try {
      const { greeting } = await ensureConversation();
      setConnectionLabel("Connected");
      autoReportTriggeredRef.current = false;
      const deadline = Date.now() + MAX_CONVERSATION_MS;
      setSessionEndsAt(deadline);
      setTimeLeftLabel(formatTimeLeft(MAX_CONVERSATION_MS));

      if (greeting) {
        setState("speaking");
        await speakAssistant(greeting);
      }

      timerRef.current.push(
        window.setTimeout(() => {
          if (autoReportTriggeredRef.current) return;
          autoReportTriggeredRef.current = true;
          setConnectionLabel("Time limit reached");
          setSessionEndsAt(null);
          setTimeLeftLabel(null);
          void generateReportRef.current();
        }, MAX_CONVERSATION_MS),
      );

      listenForPatient();
    } catch (err: unknown) {
      setState("idle");
      setConnectionLabel("Connection error");
      console.error(err);
      setError("Service temporarily unavailable. Please try again.");
    }
  }, [clearTimers, ensureConversation, isRunning, listenForPatient, speakAssistant, stopListening, stopSpeaking]);

  const generateReport = useCallback(async () => {
    clearTimers();
    stopListening(false);
    stopSpeaking();
    setSessionEndsAt(null);
    setTimeLeftLabel(null);
    setError(null);
    autoReportTriggeredRef.current = true;

    try {
      const { base, cid } = await ensureConversation();
      setState("reporting");

      const r = await fetchWithTimeout(
        `${base}/report/full/${cid}`,
        {
        method: "GET",
        headers: {
          "x-conversation-id": cid,
        },
        },
        REPORT_RESPONSE_TIMEOUT_MS,
      );
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
      console.error(err);
      setError("Unable to generate report right now. Please try again later.");
    }
  }, [clearTimers, ensureConversation, fetchWithTimeout, stopListening, stopSpeaking]);

  useEffect(() => {
    generateReportRef.current = generateReport;
  }, [generateReport]);

  const submitFeedback = useCallback(async () => {
    if (feedbackSubmitting) return;

    const name = feedbackName.trim();
    const email = feedbackEmail.trim().toLowerCase();
    const feedback = feedbackText.trim();

    if (!name || !email || !feedback) {
      setFeedbackMessageType("error");
      setFeedbackMessage("Name, email, and feedback are required.");
      return;
    }

    try {
      setFeedbackSubmitting(true);
      setFeedbackMessage(null);
      setFeedbackMessageType(null);

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          feedback,
          conversationId,
          sourcePage: "home_demo_report",
        }),
      });

      await parseJsonOrThrow(response);
      setFeedbackMessageType("success");
      setFeedbackMessage("Thanks. Your feedback was saved.");
      setFeedbackText("");
    } catch (err: unknown) {
      setFeedbackMessageType("error");
      setFeedbackMessage(err instanceof Error ? err.message : "Unable to save feedback right now.");
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [conversationId, feedbackEmail, feedbackName, feedbackSubmitting, feedbackText]);

  const waveConfig = useMemo(() => {
    if (state === "listening") return { base: 26, variance: 16, duration: 0.62, ease: "easeInOut" as const };
    if (state === "processing") return { base: 18, variance: 6, duration: 1.15, ease: "easeInOut" as const };
    if (state === "speaking") return { base: 22, variance: 12, duration: 0.82, ease: "easeInOut" as const };
    if (state === "reporting") return { base: 16, variance: 8, duration: 0.95, ease: "easeInOut" as const };
    if (state === "ready") return { base: 14, variance: 4, duration: 1.2, ease: "easeInOut" as const };
    return { base: 10, variance: 3, duration: 1.4, ease: "easeInOut" as const };
  }, [state]);

  const keyFindings = useMemo(
    () =>
      (report?.analysis?.key_findings ?? [])
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .slice(0, 3),
    [report?.analysis?.key_findings],
  );

  const reportSummary = report?.summary?.summary_text?.trim() || "Summary is not available yet.";
  const reportChiefComplaint = report?.summary?.chief_complaint?.trim() || "Not captured";
  const reportDuration = report?.summary?.duration?.trim() || "Not captured";
  const turnsCompleted =
    typeof report?.summary?.questions_completed === "number" ? report.summary.questions_completed : null;
  const totalTurns = typeof report?.summary?.total_turns === "number" ? report.summary.total_turns : null;

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
          {timeLeftLabel && !showReport && (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Time left: {timeLeftLabel}
            </p>
          )}

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
              {(Boolean(conversationId) || showReport || state === "reporting") && (
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
              className="mt-4 max-h-[320px] overflow-y-auto rounded-xl border border-[#224bc3]/20 bg-[linear-gradient(180deg,rgba(34,75,195,0.06),rgba(56,172,6,0.05))] p-3"
            >
              <div className="rounded-lg border border-[#224bc3]/25 bg-[linear-gradient(115deg,rgba(34,75,195,0.2),rgba(56,172,6,0.16))] p-2.5 shadow-[0_8px_26px_-20px_rgba(34,75,195,0.55)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#224bc3]">
                  Structured Clinical Summary
                </p>
                <p className="mt-1 text-[10px] leading-4 text-foreground/90">
                  Demo only. This preview is not medical advice. For detailed demo including patient vitals, history and production onboarding,{" "}
                  <Link href="/contact" className="font-semibold text-[#224bc3] underline underline-offset-2">
                    contact our team
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {[
                  report?.summary?.chief_complaint ? 92 : 72,
                  report?.summary?.duration ? 84 : 66,
                  report?.analysis?.key_findings?.length ? 76 : 58,
                  report?.summary?.summary_text ? 88 : 80,
                ].map((width, idx) => (
                  <motion.div
                    key={`${width}-${idx}`}
                    className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(56,172,6,0.58),rgba(34,75,195,0.52))]"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${width}%`, opacity: 1 }}
                    transition={{ duration: 0.35, delay: idx * 0.1, ease: "easeOut" }}
                  />
                ))}
              </div>

              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-[#224bc3]/20 bg-background/85 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#224bc3]/85">
                      Chief Complaint
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-foreground">{reportChiefComplaint}</p>
                  </div>

                  <div className="rounded-lg border border-[#38ac06]/20 bg-background/85 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#2f8f07]/90">
                      Duration
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-foreground">{reportDuration}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-[#38ac06]/28 bg-background/90 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#2f8f07]/90">
                    Summary
                  </p>
                  <p className="mt-1 max-h-16 overflow-y-auto pr-1 text-[11px] leading-4 text-foreground/95">
                    {reportSummary}
                  </p>
                </div>

                <div className="rounded-lg border border-[#224bc3]/28 bg-background/90 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#224bc3]/90">
                    Key Findings
                  </p>
                  {keyFindings.length > 0 ? (
                    <ul className="mt-1 space-y-1 text-[11px] leading-4 text-foreground/95">
                      {keyFindings.map((finding, idx) => (
                        <li key={`${finding}-${idx}`} className="flex items-start gap-1.5">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#38ac06]" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[11px] leading-4 text-foreground/75">No key findings available.</p>
                  )}
                </div>

                {(turnsCompleted !== null || totalTurns !== null || report?.generated_at) && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                    {turnsCompleted !== null && (
                      <span className="rounded-full border border-[#38ac06]/30 bg-[#38ac06]/10 px-2 py-0.5 text-[#2f8f07]">
                        Questions: {turnsCompleted}
                      </span>
                    )}
                    {totalTurns !== null && (
                      <span className="rounded-full border border-[#224bc3]/30 bg-[#224bc3]/10 px-2 py-0.5 text-[#224bc3]">
                        Turns: {totalTurns}
                      </span>
                    )}
                    {report?.generated_at && (
                      <span className="rounded-full border border-border bg-background/85 px-2 py-0.5 text-foreground/80">
                        {new Date(report.generated_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}

                <div className="rounded-lg border border-[#224bc3]/25 bg-[linear-gradient(120deg,rgba(34,75,195,0.1),rgba(56,172,6,0.08))] p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#224bc3]">
                    Quick Feedback
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                    Share your demo experience. We use this only to improve product quality.
                  </p>

                  <form
                    className="mt-2 space-y-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void submitFeedback();
                    }}
                  >
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        value={feedbackName}
                        onChange={(event) => setFeedbackName(event.target.value)}
                        maxLength={120}
                        placeholder="Name"
                        className="h-8 rounded-md border border-border bg-background px-2 text-[11px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#224bc3]/45 focus:ring-2 focus:ring-[#224bc3]/20"
                      />
                      <input
                        type="email"
                        value={feedbackEmail}
                        onChange={(event) => setFeedbackEmail(event.target.value)}
                        maxLength={160}
                        placeholder="Email"
                        className="h-8 rounded-md border border-border bg-background px-2 text-[11px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#224bc3]/45 focus:ring-2 focus:ring-[#224bc3]/20"
                      />
                    </div>

                    <textarea
                      value={feedbackText}
                      onChange={(event) => setFeedbackText(event.target.value)}
                      maxLength={1000}
                      placeholder="Your feedback"
                      className="min-h-[62px] w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-[11px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#224bc3]/45 focus:ring-2 focus:ring-[#224bc3]/20"
                    />

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] text-muted-foreground">Name, email, and feedback are required.</p>
                      <button
                        type="submit"
                        disabled={feedbackSubmitting}
                        className="inline-flex h-7 items-center rounded-full bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {feedbackSubmitting ? "Saving..." : "Send"}
                      </button>
                    </div>
                  </form>

                  {feedbackMessage && (
                    <p
                      className={`mt-2 text-[10px] ${
                        feedbackMessageType === "success" ? "text-[#2f8f07]" : "text-destructive"
                      }`}
                    >
                      {feedbackMessage}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
