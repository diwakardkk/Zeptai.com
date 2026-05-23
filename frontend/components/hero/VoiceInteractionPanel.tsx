"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AudioLines, ChevronDown, FileText, Mic } from "lucide-react";

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

type BrowserSpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

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

function getBrowserSpeechWindow() {
  return window as BrowserSpeechWindow;
}

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
  const speechWindow = getBrowserSpeechWindow();
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
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

export default function VoiceInteractionPanel({ highlight = false }: { highlight?: boolean }) {
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

  const listenForPatient = useCallback(async () => {
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

    // Check mic permission state before starting SpeechRecognition.
    // Only call getUserMedia when state is 'prompt' (first time) — never on subsequent turns.
    if (typeof navigator !== "undefined") {
      let permState: PermissionState | null = null;
      try {
        const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
        permState = status.state;
      } catch {
        // Permissions API not supported — fall through to getUserMedia.
      }

      if (permState === "denied") {
        stopListening(false);
        setState("ready");
        setError(
          "Microphone access was denied. Please allow microphone access in your browser settings and try again.",
        );
        return;
      }

      if (permState !== "granted" && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          stopListening(false);
          setState("ready");
          setError(
            "Microphone access was denied. Please allow microphone access in your browser settings and try again.",
          );
          return;
        }
      }
    }

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
      let message: string;
      if (reason === "not-allowed" || reason === "permission-denied") {
        message =
          "Microphone access was denied. Please allow microphone access in your browser settings and try again.";
      } else if (reason === "no-speech") {
        message = "No speech detected. Please try again.";
      } else if (reason === "network") {
        message = "Network error during voice capture. Please check your connection and try again.";
      } else {
        message = `Voice capture failed (${reason}). Please try again.`;
      }
      setError(message);
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

  // Pre-warm API connection on mount — wakes up the Render backend and caches
  // the resolved base URL so the first "Start Conversation" click is instant.
  // Errors are swallowed here and surfaced to the user on click.
  useEffect(() => {
    resolveApiBase()
      .then((base) => {
        setApiBase(base);
        setConnectionLabel("Ready");
      })
      .catch(() => { /* surface on click */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      id="voice-panel"
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

        <div className="mt-5 flex flex-col items-center gap-4">
          {/* Waveform visualiser — only rendered while session is active */}
          <AnimatePresence>
            {isRunning && (
              <motion.div
                key="waveform"
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.4 }}
                transition={{ duration: 0.25 }}
                className="flex h-12 w-full max-w-[300px] items-end justify-center gap-1"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status badge */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.13em]" style={{ color: meta.accent }}>
              {isRunning ? meta.badge : connectionLabel}
            </p>
            {timeLeftLabel && !showReport && (
              <p className="text-xs font-medium text-muted-foreground">
                Session time left: {timeLeftLabel}
              </p>
            )}
          </div>

          {/* Primary CTA — large, clearly visible */}
          <div className="flex w-full max-w-[280px] flex-col items-center gap-1.5">

            {/* Floating "Click here" label — shown when highlight active */}
            <AnimatePresence>
              {highlight && !isRunning && (
                <motion.div
                  key="click-label"
                  className="flex flex-col items-center gap-0.5"
                  initial={{ opacity: 0, y: -6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="rounded-full bg-[#38ac06] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_14px_rgba(56,172,6,0.6)]">
                    Click here to start
                  </span>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-[#38ac06]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button with beacon rings */}
            <div className="relative w-full">
              {/* Expanding pulse rings */}
              <AnimatePresence>
                {highlight && !isRunning && (
                  <motion.div
                    key="beacon-rings"
                    className="pointer-events-none absolute inset-0 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[0, 0.5, 1.0].map((delay) => (
                      <motion.span
                        key={delay}
                        className="absolute inset-0 rounded-2xl border-[2.5px] border-[#38ac06]"
                        initial={{ scale: 1, opacity: 0.75 }}
                        animate={{ scale: 1.9, opacity: 0 }}
                        transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeOut" }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={startConversation}
                disabled={isRunning}
                whileHover={!isRunning ? { y: -2 } : {}}
                animate={
                  highlight && !isRunning
                    ? {
                        boxShadow: [
                          "0 12px 32px -14px rgba(56,172,6,0.5)",
                          "0 14px 44px -8px rgba(56,172,6,0.95)",
                          "0 12px 32px -14px rgba(56,172,6,0.5)",
                        ],
                        scale: [1, 1.03, 1],
                      }
                    : { boxShadow: "0 12px 32px -14px rgba(34,75,195,0.85)", scale: 1 }
                }
                transition={{
                  duration: 0.9,
                  repeat: highlight && !isRunning ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-6 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                <Mic className="h-4 w-4 shrink-0" />
                <span>{isRunning ? meta.badge : "Start Conversation"}</span>
                {!isRunning && (
                  <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
                )}
              </motion.button>
            </div>
          </div>

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
              className="mt-4 max-h-[680px] overflow-y-auto rounded-xl border border-[#224bc3]/20 bg-[linear-gradient(180deg,rgba(34,75,195,0.06),rgba(56,172,6,0.05))] p-3"
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

              {/* ── Demo Vitals Dashboard ── */}
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0d1117] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38ac06]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
                    Patient Vitals
                  </p>
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-white/40">
                    Demo Data
                  </span>
                </div>

                {/* 2×2 chart grid */}
                <div className="grid grid-cols-2 gap-px bg-white/[0.05]">

                  {/* ① Blood Pressure — horizontal bars */}
                  <div className="bg-[#0d1117] p-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/55">Blood Pressure</p>
                    <p className="mt-0.5 text-[8px] font-semibold text-[#22c55e]">120/93 mmHg — Elevated</p>
                    <div className="mt-2 space-y-[5px]">
                      {[
                        { label: "Systolic",  value: 120, max: 200, color: "#22c55e" },
                        { label: "Diastolic", value: 93,  max: 200, color: "#ef4444" },
                        { label: "Norm Sys",  value: 120, max: 200, color: "#3b82f6" },
                        { label: "Norm Dia",  value: 80,  max: 200, color: "#3b82f6" },
                      ].map(({ label, value, max, color }) => (
                        <div key={label} className="flex items-center gap-1">
                          <span className="w-[40px] shrink-0 text-right text-[7px] text-white/35">{label}</span>
                          <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${(value / max) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            />
                          </div>
                          <span className="w-6 shrink-0 text-right text-[7px] font-bold text-white/65">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ② Blood Sugar — semicircle gauge */}
                  <div className="flex flex-col items-center bg-[#0d1117] p-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/55">Blood Sugar</p>
                    <p className="mt-0.5 text-[8px] font-semibold text-[#22c55e]">Normal</p>
                    <div className="relative mt-1">
                      <svg viewBox="0 0 120 72" className="w-[84px]">
                        <path d="M 16,66 A 50,50 0 0,1 104,66" fill="none" stroke="#ffffff0d" strokeWidth="11" strokeLinecap="round" />
                        <motion.path
                          d="M 16,66 A 50,50 0 0,1 104,66"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="11"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 75 / 200, opacity: 1 }}
                          transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <span className="text-sm font-bold leading-none text-white">75</span>
                        <span className="mt-px text-[7px] text-white/40">mg/dL</span>
                      </div>
                    </div>
                  </div>

                  {/* ③ BMI — semicircle gauge */}
                  <div className="flex flex-col items-center bg-[#0d1117] p-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/55">Body Mass Index</p>
                    <p className="mt-0.5 text-[8px] font-semibold text-[#f97316]">Overweight</p>
                    <div className="relative mt-1">
                      <svg viewBox="0 0 120 72" className="w-[84px]">
                        <path d="M 16,66 A 50,50 0 0,1 104,66" fill="none" stroke="#ffffff0d" strokeWidth="11" strokeLinecap="round" />
                        <motion.path
                          d="M 16,66 A 50,50 0 0,1 104,66"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="11"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 26.9 / 40, opacity: 1 }}
                          transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <span className="text-sm font-bold leading-none text-white">26.9</span>
                        <span className="mt-px text-[7px] text-white/40">kg/m²</span>
                      </div>
                    </div>
                  </div>

                  {/* ④ Temp & Pulse — vertical bar chart */}
                  <div className="bg-[#0d1117] p-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/55">Temp &amp; Pulse</p>
                    <div className="mt-2 flex items-end gap-1" style={{ height: "52px" }}>
                      {[
                        { label: "Temp °C",    value: 37,   max: 80, color: "#22c55e" },
                        { label: "Pulse bpm",  value: 70,   max: 80, color: "#22c55e" },
                        { label: "Norm Temp",  value: 36.6, max: 80, color: "#3b82f6" },
                        { label: "Norm Pulse", value: 72,   max: 80, color: "#3b82f6" },
                      ].map(({ label, value, max, color }) => (
                        <motion.div
                          key={label}
                          className="flex-1 rounded-t-[2px]"
                          style={{ backgroundColor: color }}
                          initial={{ height: 0 }}
                          animate={{ height: Math.round((value / max) * 52) }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                        />
                      ))}
                    </div>
                    <div className="mt-1 flex gap-1">
                      {["Temp °C", "Pulse bpm", "Norm Temp", "Norm Pulse"].map((l) => (
                        <span key={l} className="flex-1 text-center text-[6px] leading-tight text-white/35">{l}</span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Stats strip — weight, height, temp, pulse */}
                <div className="grid grid-cols-4 divide-x divide-white/[0.06] border-t border-white/[0.06] bg-[#0a0e16]">
                  {[
                    { label: "Weight", value: "76 kg",  color: "text-white/80",   sub: "" },
                    { label: "Height", value: "168 cm", color: "text-white/80",   sub: "" },
                    { label: "Temp",   value: "37 °C",  color: "text-[#22c55e]", sub: "Normal" },
                    { label: "Pulse",  value: "70 bpm", color: "text-[#22c55e]", sub: "Normal" },
                  ].map(({ label, value, color, sub }) => (
                    <div key={label} className="px-1.5 py-1.5 text-center">
                      <p className={`text-[9px] font-bold ${color}`}>{value}</p>
                      <p className="text-[7px] text-white/30">{label}</p>
                      {sub && <p className="text-[6px] text-[#22c55e]/70">{sub}</p>}
                    </div>
                  ))}
                </div>
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
