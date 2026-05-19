"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AudioLines,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Volume2,
} from "lucide-react";
import {
  API_RESPONSE_TIMEOUT_MS,
  HUMAN_RESPONSE_DELAY_MS,
  LISTENING_IDLE_TIMEOUT_MS,
  MAX_CONVERSATION_MS,
  MAX_TURNS_BEFORE_SUMMARY,
  MAX_VISIBLE_TURNS,
  SILENCE_THRESHOLD,
  SILENCE_TIMEOUT_MS,
} from "@/lib/conversation/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type VoiceState =
  | "idle"
  | "starting"
  | "listening"
  | "processing"
  | "speaking"
  | "paused"
  | "completed"
  | "error";

type EmotionLabel = "calm" | "listening" | "reassuring" | "concerned" | "urgent";

type Turn = {
  id: string;
  role: "patient" | "ai";
  text: string;
  emotion?: EmotionLabel;
  timestamp: number;
};

type SummaryPayload = {
  conversation_id?: string;
  summary?: {
    chief_complaint?: string | null;
    symptoms?: string | null;
    duration?: string | null;
    medical_history?: string | null;
    medications?: string | null;
    risk_notes?: string | null;
    suggested_review?: string | null;
    summary_text?: string | null;
  };
  analysis?: {
    key_findings?: string[];
    risk_level?: string;
    red_flags?: string[];
  };
};

type ChatStartResponse = {
  conversation_id: string;
  greeting?: string;
  state?: string;
  voice_mode?: boolean;
};

type ChatMessageResponse = {
  conversation_id: string;
  turn_id?: string | number;
  response?: string;
  next_question?: string;
  state?: string;
  is_emergency?: boolean;
};

// ─── State metadata ───────────────────────────────────────────────────────────

const STATE_META: Record<VoiceState, { label: string; badge: string; accent: string }> = {
  idle:       { label: "Ready",      badge: "Tap to begin",      accent: "#224bc3" },
  starting:   { label: "Connecting", badge: "Connecting...",      accent: "#224bc3" },
  listening:  { label: "Listening",  badge: "Listening...",       accent: "#38ac06" },
  processing: { label: "Processing", badge: "Understanding...",   accent: "#224bc3" },
  speaking:   { label: "Speaking",   badge: "Speaking...",        accent: "#224bc3" },
  paused:     { label: "Paused",     badge: "Paused",             accent: "#888"    },
  completed:  { label: "Done",       badge: "Session complete",   accent: "#38ac06" },
  error:      { label: "Error",      badge: "Try again",          accent: "#dc2626" },
};

const EMOTION_COLORS: Record<EmotionLabel, string> = {
  calm:        "#224bc3",
  listening:   "#38ac06",
  reassuring:  "#2f8f07",
  concerned:   "#d97706",
  urgent:      "#dc2626",
};

const EMOTION_LABELS: Record<EmotionLabel, string> = {
  calm:        "Calm",
  listening:   "Listening",
  reassuring:  "Reassuring",
  concerned:   "Concerned",
  urgent:      "Urgent",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ENV_API_BASE = process.env.NEXT_PUBLIC_NURSE_API_BASE;
const BARS = Array.from({ length: 20 }, (_, i) => i);

function getApiCandidates(): string[] {
  const candidates: string[] = [];
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    if (isLocal) {
      candidates.push("http://127.0.0.1:8000/api/v1", "http://127.0.0.1:8001/api/v1");
    } else {
      candidates.push("/api/nurse-proxy");
    }
  }
  if (ENV_API_BASE?.trim()) candidates.push(ENV_API_BASE.trim());
  return Array.from(new Set(candidates)).map((b) => b.replace(/\/$/, ""));
}

async function resolveApiBase(): Promise<string> {
  const candidates = getApiCandidates();
  if (!candidates.length) throw new Error("Conversation service is not configured.");
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/health`, { method: "GET" });
      if (res.ok) return base;
    } catch {
      // try next
    }
  }
  throw new Error("Conversation service is temporarily unavailable. Please try again.");
}

async function parseJsonOrThrow(r: Response): Promise<Record<string, unknown>> {
  const raw = await r.text();
  let data: unknown = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* keep raw */ }
  if (!r.ok) {
    const msg =
      data && typeof data === "object" && "detail" in data
        ? String((data as Record<string, unknown>).detail)
        : data && typeof data === "object" && "error" in data
        ? String((data as Record<string, unknown>).error)
        : raw || `HTTP ${r.status}`;
    throw new Error(msg);
  }
  return (data ?? {}) as Record<string, unknown>;
}

function stripQuestionLabels(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*q\d+\s*[:.)-]?\s*/i, ""))
    .filter((line) => line.trim().length > 0)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function mergeBotText(response: string, next: string): string {
  const r = stripQuestionLabels(response || "");
  const n = stripQuestionLabels(next || "");
  if (!n) return r;
  if (!r) return n;
  if (r === n) return r;
  return `${r}\n\n${n}`;
}

function detectLanguage(text: string): string {
  return /[\u0900-\u097F]/.test(text) ? "hi" : "en";
}

function inferEmotionFromText(text: string): EmotionLabel {
  if (/emergency|call 911|ambulance|chest pain|can't breathe|unconscious/i.test(text)) return "urgent";
  if (/sorry|understand|difficult|must be|must feel/i.test(text)) return "reassuring";
  if (/concern|worry|careful|monitor|watch/i.test(text)) return "concerned";
  if (/hello|hi |welcome|thank you|great/i.test(text)) return "listening";
  return "calm";
}

function nanoid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VoiceInteractionPanel() {
  const [state, setState] = useState<VoiceState>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionLabel, setConnectionLabel] = useState("Not connected");
  const [micVolume, setMicVolume] = useState(0);
  const [aiVolume, setAiVolume] = useState(0);

  // Session refs
  const sessionIdRef = useRef<string | null>(null);
  const apiBaseRef = useRef<string | null>(null);
  const latestTurnIdRef = useRef<string | null>(null);
  const sessionLanguageRef = useRef<string | null>(null);
  const turnCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isProcessingRef = useRef(false);

  // Audio refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const aiAnalyserRef = useRef<AnalyserNode | null>(null);
  const rafMicRef = useRef<number | null>(null);
  const rafAiRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const humanDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);
  const playingUrlRef = useRef<string | null>(null);

  type RecognitionInstance = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((e: { results: { length: number; [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
    onerror: ((e: { error: string }) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  };
  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const transcriptRef = useRef("");

  const meta = STATE_META[state];
  const isRunning = state === "starting" || state === "listening" || state === "processing" || state === "speaking";
  const visibleTurns = useMemo(() => turns.slice(-MAX_VISIBLE_TURNS), [turns]);

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  const clearAllTimers = useCallback(() => {
    [silenceTimerRef, idleTimerRef, sessionTimerRef, humanDelayTimerRef].forEach((r) => {
      if (r.current !== null) { clearTimeout(r.current); r.current = null; }
    });
  }, []);

  const stopMicVisualizer = useCallback(() => {
    if (rafMicRef.current !== null) { cancelAnimationFrame(rafMicRef.current); rafMicRef.current = null; }
    setMicVolume(0);
  }, []);

  const stopAiVisualizer = useCallback(() => {
    if (rafAiRef.current !== null) { cancelAnimationFrame(rafAiRef.current); rafAiRef.current = null; }
    setAiVolume(0);
  }, []);

  const stopMicStream = useCallback(() => {
    stopMicVisualizer();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (micAnalyserRef.current) {
      try { micAnalyserRef.current.disconnect(); } catch { /* ignore */ }
      micAnalyserRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    transcriptRef.current = "";
  }, [stopMicVisualizer]);

  const stopAiAudio = useCallback(() => {
    stopAiVisualizer();
    if (playingAudioRef.current) {
      playingAudioRef.current.pause();
      playingAudioRef.current.onended = null;
      playingAudioRef.current.onerror = null;
      playingAudioRef.current = null;
    }
    if (playingUrlRef.current) { URL.revokeObjectURL(playingUrlRef.current); playingUrlRef.current = null; }
    if (aiAnalyserRef.current) {
      try { aiAnalyserRef.current.disconnect(); } catch { /* ignore */ }
      aiAnalyserRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [stopAiVisualizer]);

  const abortInFlight = useCallback(() => {
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    isProcessingRef.current = false;
  }, []);

  const fullCleanup = useCallback(() => {
    clearAllTimers();
    abortInFlight();
    stopMicStream();
    stopAiAudio();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {/* ignore */});
      audioContextRef.current = null;
    }
  }, [clearAllTimers, abortInFlight, stopMicStream, stopAiAudio]);

  useEffect(() => () => fullCleanup(), [fullCleanup]);

  // ─── API helpers ───────────────────────────────────────────────────────────

  const fetchWithAbort = useCallback(
    async (url: string, init: RequestInit, timeoutMs = API_RESPONSE_TIMEOUT_MS): Promise<Response> => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const tid = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { ...init, signal: controller.signal });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError")
          throw new Error("Request timed out. Please try again.");
        throw err;
      } finally {
        clearTimeout(tid);
        if (abortControllerRef.current === controller) abortControllerRef.current = null;
      }
    },
    [],
  );

  const ensureSession = useCallback(async (): Promise<{ base: string; cid: string }> => {
    if (apiBaseRef.current && sessionIdRef.current)
      return { base: apiBaseRef.current, cid: sessionIdRef.current };
    const base = apiBaseRef.current ?? (await resolveApiBase());
    apiBaseRef.current = base;
    const r = await fetchWithAbort(`${base}/chat/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "en", voice_mode: false }),
    });
    const data = (await parseJsonOrThrow(r)) as unknown as ChatStartResponse;
    const cid = data.conversation_id;
    if (!cid) throw new Error("Missing conversation_id from backend.");
    sessionIdRef.current = cid;
    return { base, cid };
  }, [fetchWithAbort]);

  // ─── AI TTS & visualizer ──────────────────────────────────────────────────

  const startAiVisualizer = useCallback(() => {
    const analyser = aiAnalyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) { const v = data[i] - 128; sum += v * v; }
      setAiVolume(Math.min(255, Math.sqrt(sum / data.length) * 6));
      rafAiRef.current = requestAnimationFrame(loop);
    };
    rafAiRef.current = requestAnimationFrame(loop);
  }, []);

  const speakWithElevenLabs = useCallback(async (text: string): Promise<void> => {
    stopAiAudio();
    const response = await fetch("/api/tts/elevenlabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      let msg = `ElevenLabs TTS failed (${response.status}).`;
      try { const d = (await response.json()) as { error?: string }; if (d.error) msg = d.error; } catch { /* ignore */ }
      throw new Error(msg);
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error("ElevenLabs returned empty audio.");

    const url = URL.createObjectURL(blob);
    playingUrlRef.current = url;

    if (!audioContextRef.current || audioContextRef.current.state === "closed")
      audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    aiAnalyserRef.current = analyser;
    analyser.connect(ctx.destination);
    startAiVisualizer();

    const audio = new Audio(url);
    playingAudioRef.current = audio;
    const src = ctx.createMediaElementSource(audio);
    src.connect(analyser);

    return new Promise<void>((resolve) => {
      const finalize = () => {
        audio.onended = null;
        audio.onerror = null;
        if (playingAudioRef.current === audio) playingAudioRef.current = null;
        if (playingUrlRef.current === url) { URL.revokeObjectURL(url); playingUrlRef.current = null; }
        stopAiVisualizer();
        resolve();
      };
      audio.onended = finalize;
      audio.onerror = finalize;
      audio.play().catch(finalize);
    });
  }, [startAiVisualizer, stopAiAudio, stopAiVisualizer]);

  const speakWithBrowser = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      window.speechSynthesis.speak(utt);
    });
  }, []);

  const speakAssistant = useCallback(async (text: string): Promise<void> => {
    const clean = text.trim();
    if (!clean) return;
    try {
      await speakWithElevenLabs(clean);
    } catch (err) {
      const reason = err instanceof Error ? err.message.toLowerCase() : "";
      if (reason.includes("quota")) setError("ElevenLabs quota exceeded — using browser voice.");
      await speakWithBrowser(clean);
    }
  }, [speakWithBrowser, speakWithElevenLabs]);

  // ─── Mic visualizer ────────────────────────────────────────────────────────

  const startMicVisualizer = useCallback((stream: MediaStream) => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed")
      audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    micAnalyserRef.current = analyser;
    const src = ctx.createMediaStreamSource(stream);
    src.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) { const v = data[i] - 128; sum += v * v; }
      setMicVolume(Math.min(255, Math.sqrt(sum / data.length) * 6));
      rafMicRef.current = requestAnimationFrame(loop);
    };
    rafMicRef.current = requestAnimationFrame(loop);
  }, []);

  // ─── Turn processing ────────────────────────────────────────────────────────

  // forward-declared via ref to avoid stale closures
  const runAssistantTurnRef = useRef<(text: string) => Promise<void>>(async () => {});

  const runAssistantTurn = useCallback(async (userText: string) => {
    const text = userText.trim();
    if (!text || isProcessingRef.current) return;
    isProcessingRef.current = true;

    if (!sessionLanguageRef.current) sessionLanguageRef.current = detectLanguage(text);

    const turnId = nanoid();
    latestTurnIdRef.current = turnId;

    setTurns((prev) => [...prev, { id: nanoid(), role: "patient", text, timestamp: Date.now() }]);
    setState("processing");
    setError(null);

    try {
      const { base, cid } = await ensureSession();
      const r = await fetchWithAbort(
        `${base}/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: cid,
            message: text,
            language: sessionLanguageRef.current ?? "en",
          }),
        },
        API_RESPONSE_TIMEOUT_MS,
      );
      const data = (await parseJsonOrThrow(r)) as unknown as ChatMessageResponse;

      // Deduplication — discard stale
      if (latestTurnIdRef.current !== turnId) { isProcessingRef.current = false; return; }

      const reply = String(data.response ?? "I could not generate a response.");
      const nextQ = typeof data.next_question === "string" ? data.next_question.trim() : "";
      const spokenText = mergeBotText(reply, nextQ);
      const emotion = inferEmotionFromText(spokenText);

      setTurns((prev) => [...prev, { id: nanoid(), role: "ai", text: spokenText, emotion, timestamp: Date.now() }]);
      turnCountRef.current += 1;

      const backendDone = data.state === "completed" || data.state === "end";
      const turnLimitReached = turnCountRef.current >= MAX_TURNS_BEFORE_SUMMARY;
      isProcessingRef.current = false;

      setState("speaking");
      await speakAssistant(spokenText);

      if (backendDone || turnLimitReached) {
        setState("completed");
        setConnectionLabel("Session complete");
        void fetchSummary(cid);
        return;
      }

      setState("listening");
      idleTimerRef.current = setTimeout(() => {
        stopMicStream();
        setState("paused");
        setError("No response detected for 90 seconds. Tap to resume.");
      }, LISTENING_IDLE_TIMEOUT_MS);

      void startMicCapture();
    } catch (err) {
      isProcessingRef.current = false;
      stopMicStream();
      setState("error");
      setError(err instanceof Error ? err.message : "Service temporarily unavailable. Please try again.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensureSession, fetchWithAbort, speakAssistant, stopMicStream]);

  // keep ref fresh
  useEffect(() => { runAssistantTurnRef.current = runAssistantTurn; }, [runAssistantTurn]);

  const fetchSummary = useCallback(async (cid: string) => {
    try {
      const base = apiBaseRef.current;
      if (!base) return;
      const r = await fetch(`${base}/chat/summary/${cid}`, { method: "GET" });
      if (!r.ok) return;
      const data = (await r.json()) as SummaryPayload;
      setSummary(data);
      setShowSummary(true);
    } catch { /* summary is optional */ }
  }, []);

  // ─── Mic capture ───────────────────────────────────────────────────────────

  const startMicCapture = useCallback(async () => {
    stopMicStream();
    transcriptRef.current = "";

    type SpeechCtor = new () => RecognitionInstance;
    const SpeechRecognitionCtor =
      (window as Window & { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor })
        .SpeechRecognition ??
      (window as Window & { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor })
        .webkitSpeechRecognition ??
      null;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState("error");
      setError("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
      return;
    }

    mediaStreamRef.current = stream;
    startMicVisualizer(stream);

    if (!audioContextRef.current || audioContextRef.current.state === "closed")
      audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;
    const silenceAnalyser = ctx.createAnalyser();
    silenceAnalyser.fftSize = 256;
    const silenceData = new Uint8Array(silenceAnalyser.fftSize);
    const silenceSrc = ctx.createMediaStreamSource(stream);
    silenceSrc.connect(silenceAnalyser);

    const armSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        humanDelayTimerRef.current = setTimeout(() => {
          const captured = transcriptRef.current.trim();
          stopMicStream();
          if (captured) {
            void runAssistantTurnRef.current(captured);
          } else {
            setState("paused");
            setError("No speech detected. Tap the button to continue.");
          }
        }, HUMAN_RESPONSE_DELAY_MS);
      }, SILENCE_TIMEOUT_MS);
    };

    const pollSilence = () => {
      silenceAnalyser.getByteTimeDomainData(silenceData);
      let sum = 0;
      for (let i = 0; i < silenceData.length; i++) { const v = silenceData[i] - 128; sum += v * v; }
      const rms = Math.sqrt(sum / silenceData.length);
      if (rms >= SILENCE_THRESHOLD) {
        // voice detected — reset silence timer
        armSilenceTimer();
        if (humanDelayTimerRef.current) { clearTimeout(humanDelayTimerRef.current); humanDelayTimerRef.current = null; }
      }
      if (mediaStreamRef.current) requestAnimationFrame(pollSilence);
    };

    armSilenceTimer();
    requestAnimationFrame(pollSilence);

    if (SpeechRecognitionCtor) {
      const recog = new SpeechRecognitionCtor();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = sessionLanguageRef.current === "hi" ? "hi-IN" : "en-US";

      recog.onresult = (event) => {
        const results = event.results;
        let transcript = "";
        for (let i = 0; i < results.length; i++) {
          const seg = results[i]?.[0]?.transcript;
          if (seg) transcript += seg;
        }
        const clean = transcript.trim();
        if (clean) {
          transcriptRef.current = clean;
          armSilenceTimer();
          if (humanDelayTimerRef.current) { clearTimeout(humanDelayTimerRef.current); humanDelayTimerRef.current = null; }
        }
      };

      recog.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setState("error");
          setError("Microphone access was denied. Please allow microphone access in your browser settings.");
        }
      };

      recog.onend = () => { recognitionRef.current = null; };

      try { recog.start(); recognitionRef.current = recog; } catch { /* ignore — silence detection still works */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMicVisualizer, stopMicStream]);

  // ─── Session lifecycle ────────────────────────────────────────────────────

  const startConversation = useCallback(async () => {
    if (isRunning) return;
    fullCleanup();
    setTurns([]);
    setSummary(null);
    setShowSummary(false);
    setError(null);
    turnCountRef.current = 0;
    sessionIdRef.current = null;
    apiBaseRef.current = null;
    latestTurnIdRef.current = null;
    sessionLanguageRef.current = null;
    isProcessingRef.current = false;
    setConnectionLabel("Connecting...");
    setState("starting");

    try {
      const base = await resolveApiBase();
      apiBaseRef.current = base;
      setConnectionLabel("Connected");

      const r = await fetchWithAbort(`${base}/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "en", voice_mode: false }),
      });
      const data = (await parseJsonOrThrow(r)) as unknown as ChatStartResponse;
      if (!data.conversation_id) throw new Error("Missing conversation_id from backend.");
      sessionIdRef.current = data.conversation_id;

      const greeting = typeof data.greeting === "string" ? stripQuestionLabels(data.greeting) : "";
      if (greeting) {
        setTurns([{ id: nanoid(), role: "ai", text: greeting, emotion: "listening", timestamp: Date.now() }]);
        setState("speaking");
        await speakAssistant(greeting);
      }

      setState("listening");
      setConnectionLabel("Connected");

      sessionTimerRef.current = setTimeout(() => {
        stopMicStream();
        stopAiAudio();
        setState("completed");
        setConnectionLabel("Session ended");
        const cid = sessionIdRef.current;
        if (cid) void fetchSummary(cid);
      }, MAX_CONVERSATION_MS);

      idleTimerRef.current = setTimeout(() => {
        stopMicStream();
        setState("paused");
        setError("No response detected for 90 seconds. Tap to resume.");
      }, LISTENING_IDLE_TIMEOUT_MS);

      await startMicCapture();
    } catch (err) {
      setState("error");
      setConnectionLabel("Connection error");
      setError(err instanceof Error ? err.message : "Service temporarily unavailable. Please try again.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSummary, fetchWithAbort, fullCleanup, isRunning, speakAssistant, startMicCapture, stopAiAudio, stopMicStream]);

  const stopConversation = useCallback(() => {
    fullCleanup();
    setState(showSummary ? "completed" : "paused");
    setConnectionLabel(showSummary ? "Session complete" : "Paused");
  }, [fullCleanup, showSummary]);

  const resumeConversation = useCallback(async () => {
    if (state !== "paused") return;
    setError(null);
    setState("listening");
    idleTimerRef.current = setTimeout(() => {
      stopMicStream();
      setState("paused");
      setError("No response detected for 90 seconds.");
    }, LISTENING_IDLE_TIMEOUT_MS);
    await startMicCapture();
  }, [startMicCapture, state, stopMicStream]);

  // ─── Visualizer values ────────────────────────────────────────────────────

  const waveVolume = state === "listening" ? micVolume : state === "speaking" ? aiVolume : 0;
  const waveBase = 10;
  const waveVariance = Math.min(28, waveBase + waveVolume / 8);
  const waveAccent = state === "listening" ? "#38ac06" : "#224bc3";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-border bg-card/88 p-3 shadow-[0_26px_54px_-38px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="pointer-events-none absolute -left-10 top-2 h-28 w-28 rounded-full bg-[#38ac06]/12 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 bottom-2 h-32 w-32 rounded-full bg-[#224bc3]/12 blur-2xl" />

      <div className="relative rounded-2xl border border-border bg-card/95 p-4 sm:p-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
            <AudioLines className="h-3.5 w-3.5" />
            Voice Intake
          </p>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {connectionLabel}
          </span>
        </div>

        {/* Waveform visualizer */}
        <div className="mt-4 flex h-12 w-full items-end justify-center gap-0.5">
          {BARS.map((bar) => {
            const midpoint = Math.abs(10 - bar);
            const peak = Math.max(4, waveVariance + waveBase - midpoint);
            const resting = Math.max(4, waveBase - midpoint / 2);
            return (
              <motion.span
                key={bar}
                className="w-1.5 rounded-full"
                style={{ backgroundColor: waveAccent }}
                animate={
                  isRunning
                    ? { height: [resting, peak, resting], opacity: [0.35, 1, 0.35] }
                    : { height: resting, opacity: 0.22 }
                }
                transition={
                  isRunning
                    ? { duration: 0.7 + (bar % 4) * 0.07, repeat: Infinity, ease: "easeInOut", delay: (bar % 5) * 0.05 }
                    : { duration: 0.3 }
                }
              />
            );
          })}
        </div>

        {/* Status label */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {state === "listening"  && <Mic        className="h-3.5 w-3.5 text-[#38ac06]"  aria-hidden />}
          {state === "processing" && <Loader2    className="h-3.5 w-3.5 animate-spin text-[#224bc3]" aria-hidden />}
          {state === "speaking"   && <Volume2    className="h-3.5 w-3.5 text-[#224bc3]"  aria-hidden />}
          {state === "error"      && <AlertCircle className="h-3.5 w-3.5 text-destructive" aria-hidden />}
          {state === "completed"  && <CheckCircle2 className="h-3.5 w-3.5 text-[#38ac06]" aria-hidden />}
          <p className="text-xs font-semibold uppercase tracking-[0.13em]" style={{ color: meta.accent }}>
            {meta.badge}
          </p>
        </div>

        {/* Main CTA */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {(state === "idle" || state === "error") && (
            <button
              type="button"
              aria-label="Start conversation"
              onClick={() => void startConversation()}
              className="group inline-flex w-full max-w-[280px] items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_32px_-14px_rgba(34,75,195,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(34,75,195,0.95)]"
            >
              <PlayCircle className="h-4 w-4 shrink-0" />
              <span>Start Conversation</span>
            </button>
          )}

          {state === "starting" && (
            <button
              type="button"
              aria-label="Connecting"
              disabled
              className="inline-flex w-full max-w-[280px] cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-6 py-4 text-sm font-bold text-white opacity-70"
            >
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              <span>Connecting...</span>
            </button>
          )}

          {isRunning && state !== "starting" && (
            <button
              type="button"
              aria-label="Stop conversation"
              onClick={stopConversation}
              className="inline-flex w-full max-w-[280px] items-center justify-center gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-4 text-sm font-bold text-destructive transition hover:-translate-y-0.5 hover:bg-destructive/15"
            >
              <MicOff className="h-4 w-4 shrink-0" />
              <span>Stop</span>
            </button>
          )}

          {state === "paused" && (
            <button
              type="button"
              aria-label="Resume conversation"
              onClick={() => void resumeConversation()}
              className="inline-flex w-full max-w-[280px] items-center justify-center gap-2.5 rounded-2xl border border-[#224bc3]/40 bg-[#224bc3]/10 px-6 py-4 text-sm font-bold text-[#224bc3] transition hover:-translate-y-0.5 hover:bg-[#224bc3]/15"
            >
              <PauseCircle className="h-4 w-4 shrink-0" />
              <span>Resume</span>
            </button>
          )}

          {state === "completed" && (
            <button
              type="button"
              aria-label="Start new conversation"
              onClick={() => void startConversation()}
              className="inline-flex w-full max-w-[280px] items-center justify-center gap-2.5 rounded-2xl border border-[#38ac06]/40 bg-[#38ac06]/10 px-6 py-4 text-sm font-bold text-[#2f8f07] transition hover:-translate-y-0.5 hover:bg-[#38ac06]/15"
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              <span>New Conversation</span>
            </button>
          )}
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation turns */}
        <AnimatePresence>
          {visibleTurns.length > 0 && (
            <motion.div
              key="turns"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 max-h-[220px] space-y-2 overflow-y-auto pr-1"
            >
              {visibleTurns.map((turn) => (
                <motion.div
                  key={turn.id}
                  initial={{ opacity: 0, x: turn.role === "patient" ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${turn.role === "patient" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-4 ${
                      turn.role === "patient"
                        ? "border border-border bg-background text-foreground"
                        : "border border-[#224bc3]/20 bg-[#224bc3]/10 text-foreground"
                    }`}
                  >
                    {turn.role === "ai" && turn.emotion && (
                      <p
                        className="mb-1 text-[9px] font-semibold uppercase tracking-[0.1em]"
                        style={{ color: EMOTION_COLORS[turn.emotion] }}
                      >
                        {EMOTION_LABELS[turn.emotion]}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{turn.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary box */}
        <AnimatePresence>
          {showSummary && summary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 max-h-[340px] overflow-y-auto rounded-xl border border-[#224bc3]/20 bg-[linear-gradient(180deg,rgba(34,75,195,0.06),rgba(56,172,6,0.05))] p-3"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#224bc3]">
                Intake Summary
              </p>

              <div className="mt-2.5 space-y-2">
                {(
                  [
                    ["Chief Complaint", summary.summary?.chief_complaint],
                    ["Symptoms",        summary.summary?.symptoms],
                    ["Duration",        summary.summary?.duration],
                    ["Medical History", summary.summary?.medical_history],
                    ["Medications",     summary.summary?.medications],
                    ["Risk Notes",      summary.summary?.risk_notes],
                    ["Suggested Review",summary.summary?.suggested_review],
                  ] as [string, string | null | undefined][]
                )
                  .filter(([, v]) => Boolean(v?.trim()))
                  .map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-[#224bc3]/20 bg-background/85 p-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#224bc3]/85">{label}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-foreground">{value}</p>
                    </div>
                  ))}

                {summary.summary?.summary_text?.trim() && (
                  <div className="rounded-lg border border-[#38ac06]/20 bg-background/85 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2f8f07]/90">Summary</p>
                    <p className="mt-0.5 max-h-20 overflow-y-auto pr-1 text-[11px] leading-4 text-foreground/95">
                      {summary.summary.summary_text}
                    </p>
                  </div>
                )}

                {(summary.analysis?.key_findings ?? []).length > 0 && (
                  <div className="rounded-lg border border-[#224bc3]/20 bg-background/85 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#224bc3]/90">Key Findings</p>
                    <ul className="mt-1 space-y-1 text-[11px] leading-4 text-foreground/95">
                      {(summary.analysis?.key_findings ?? [])
                        .filter((f): f is string => typeof f === "string")
                        .slice(0, 4)
                        .map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#38ac06]" />
                            {f}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-50/50 p-2 dark:bg-amber-900/10">
                <p className="text-[10px] leading-4 text-amber-700 dark:text-amber-400">
                  <strong>Note:</strong> ZeptAI supports intake and summarization. It does not replace
                  clinical diagnosis. For detailed demo including patient vitals and production onboarding,{" "}
                  <Link href="/contact" className="font-semibold underline underline-offset-2">
                    contact our team
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
