"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Loader2,
  Mic,
  RefreshCcw,
  Send,
  Sparkles,
  UserRound,
  Volume2,
} from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

type ReportPayload = {
  generated_at?: string;
  summary?: {
    summary_text?: string;
    chief_complaint?: string | null;
    duration?: string | null;
  };
  analysis?: {
    risk_level?: string;
    key_findings?: string[];
    recommended_actions?: string[];
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

type AssistantState = "idle" | "bot_speaking" | "listening" | "processing" | "report_ready";

type BrowserSpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

const ENV_API_BASE = process.env.NEXT_PUBLIC_NURSE_API_BASE;

function getApiCandidates() {
  const candidates = [] as string[];

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";

    if (isLocalHost) {
      candidates.push("http://127.0.0.1:8000/api/v1", "http://127.0.0.1:8001/api/v1");
    } else {
      // Prefer same-origin server proxy for stability in production.
      candidates.push('/api/nurse-proxy');
    }

    if (host === "zeptai.com" || host.endsWith(".zeptai.com")) {
      candidates.push("https://api.zeptai.com/api/v1");
    }
  }

  if (ENV_API_BASE) candidates.push(ENV_API_BASE);

  return Array.from(new Set(candidates)).map((base) => base.replace(/\/$/, ""));
}

function getBrowserSpeechWindow() {
  return window as BrowserSpeechWindow;
}

async function resolveApiBase() {
  const candidates = getApiCandidates();

  for (const base of candidates) {
    try {
      const health = await fetch(`${base}/health`, { method: "GET" });
      if (health.ok) {
        return base;
      }
    } catch {
      // Try next candidate on transient failure.
      // eslint-disable-next-line no-console
      console.debug('health check failed for', base);
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
    // Keep raw for error surface.
  }

  if (!r.ok) {
    const msgFromJson =
      data && typeof data === "object" && "detail" in data
        ? String((data as Record<string, unknown>).detail)
        : raw || `HTTP ${r.status}`;
    throw new Error(msgFromJson);
  }

  return data as Record<string, unknown>;
}

function stripQuestionIds(text: string) {
  return text
    .split(/\r?\n/)
    .filter((line) => !/^q\d+\s*$/i.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function mergeBotText(responseText: string, nextQuestionText: string) {
  const cleanResponse = stripQuestionIds(responseText || "");
  const cleanNext = stripQuestionIds(nextQuestionText || "");

  if (!cleanNext) return cleanResponse;
  if (!cleanResponse) return cleanNext;
  if (cleanResponse === cleanNext) return cleanResponse;

  return `${cleanResponse}\n\n${cleanNext}`;
}

function getRecognitionCtor() {
  const speechWindow = getBrowserSpeechWindow();
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export default function NurseChat() {
  const [apiBase, setApiBase] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [reportOnly, setReportOnly] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef("");
  const shouldAutoSendRef = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const sendMessage = useCallback(
    async (overrideInput?: string) => {
      const userText = (overrideInput ?? input).trim();
      if (!userText) return;
      if (loading || reportLoading) return;

      if (!conversationId || !apiBase) {
        setError("Conversation is not initialized yet. Please wait or refresh.");
        return;
      }

      if (isListening) {
        shouldAutoSendRef.current = false;
        stopListening();
      }

      setMessages((m) => [...m, { from: "user", text: userText }]);
      setInput("");

      try {
        setLoading(true);
        setError(null);

        const r = await fetch(`${apiBase}/chat/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-conversation-id": conversationId,
          },
          body: JSON.stringify({ conversation_id: conversationId, message: userText }),
        });

        const data = await parseJsonOrThrow(r);
        const reply = String(data.response ?? "I could not generate a response.");
        const nextQuestion =
          data.next_question && typeof data.next_question === "string"
            ? data.next_question.trim()
            : "";

        const combined = mergeBotText(reply, nextQuestion);

        setMessages((m) => [...m, { from: "bot", text: combined || "I could not generate a response." }]);
      } catch (err: unknown) {
          console.error(err);
          setError("Service temporarily unavailable. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [apiBase, conversationId, input, isListening, loading, reportLoading, stopListening],
  );

  const startListening = useCallback(() => {
    if (reportOnly) {
      setError("Voice input is disabled in report view.");
      return;
    }

    if (loading || reportLoading) {
      setError("Please wait until the assistant finishes processing.");
      return;
    }

    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Speech recognition is not supported in this browser. Use Chrome or Edge.");
      return;
    }

    transcriptRef.current = "";
    shouldAutoSendRef.current = true;

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
        setInput(clean);
      }
    };

    recognition.onerror = (event: any) => {
      const reason = event?.error ? String(event.error) : "unknown_error";
      shouldAutoSendRef.current = false;
      setError(`Voice input error: ${reason}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      const captured = transcriptRef.current.trim();
      const shouldAutoSend = shouldAutoSendRef.current;
      transcriptRef.current = "";
      shouldAutoSendRef.current = false;

      if (shouldAutoSend && captured && !reportOnly) {
        void sendMessage(captured);
      }
    };

    recognitionRef.current = recognition;
    setError(null);
    setIsListening(true);
    recognition.start();
  }, [loading, reportLoading, reportOnly, sendMessage]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  }, [isListening, startListening, stopListening]);

  const startConversation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const base = await resolveApiBase();
      setApiBase(base);

      const r = await fetch(`${base}/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "en", voice_mode: false }),
      });

      const data = await parseJsonOrThrow(r);
      const cid = String(data.conversation_id ?? "");

      if (!cid) {
        throw new Error("Missing conversation_id in /chat/start response");
      }

      const greeting = stripQuestionIds(String(data.greeting ?? "Hello! How can I help today?"));

      setConversationId(cid);
      setMessages([{ from: "bot", text: greeting }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void startConversation();

    return () => {
      stopListening();
    };
  }, [startConversation, stopListening]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("nursechat-listening-state", { detail: { listening: isListening } }));
  }, [isListening]);

  const lastMessage = messages[messages.length - 1];

  const assistantState: AssistantState = useMemo(() => {
    if (reportOnly && report) return "report_ready";
    if (reportLoading || loading) return "processing";
    if (isListening) return "listening";
    if (lastMessage?.from === "bot") return "bot_speaking";
    return "idle";
  }, [isListening, lastMessage?.from, loading, report, reportLoading, reportOnly]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nursechat-assistant-state", {
        detail: { state: assistantState, listening: isListening },
      }),
    );
  }, [assistantState, isListening]);

  useEffect(() => {
    const onToggleListening = () => {
      toggleListening();
    };

    window.addEventListener("nursechat-toggle-listening", onToggleListening);
    return () => {
      window.removeEventListener("nursechat-toggle-listening", onToggleListening);
    };
  }, [toggleListening]);

  useEffect(() => {
    const node = scrollAreaRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [error, loading, messages, reportOnly]);

  const statusText = useMemo(() => {
    if (loading) return "Connecting...";
    if (conversationId) return `Conversation: ${conversationId.slice(0, 8)}...`;
    return "Not connected";
  }, [loading, conversationId]);

  const assistantMeta = useMemo(() => {
    if (assistantState === "listening") {
      return {
        label: "Listening to patient",
        chipClass: "border-[#38ac06]/40 bg-[#38ac06]/15 text-[#2f8f07]",
      };
    }

    if (assistantState === "processing") {
      return {
        label: "Processing response",
        chipClass: "border-[#224bc3]/35 bg-[#224bc3]/12 text-[#224bc3]",
      };
    }

    if (assistantState === "bot_speaking") {
      return {
        label: "Bot turn",
        chipClass: "border-[#224bc3]/30 bg-[#224bc3]/10 text-[#224bc3]",
      };
    }

    if (assistantState === "report_ready") {
      return {
        label: "Report ready",
        chipClass: "border-[#38ac06]/35 bg-[#38ac06]/15 text-[#2f8f07]",
      };
    }

    return {
      label: "Ready",
      chipClass: "border-border bg-card/90 text-muted-foreground",
    };
  }, [assistantState]);

  async function generateReport() {
    if (!conversationId || !apiBase) {
      setError("Start a conversation first to generate report.");
      return;
    }

    try {
      setReportLoading(true);
      setError(null);

      const r = await fetch(`${apiBase}/report/full/${conversationId}`, {
        method: "GET",
      });

      const data = await parseJsonOrThrow(r);
      setReport(data as ReportPayload);
      setMessages([]);
      setInput("");
      setReportOnly(true);
      stopListening();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setReportLoading(false);
    }
  }

  function startNewConversation() {
    setMessages([]);
    setConversationId(null);
    setReport(null);
    setReportOnly(false);
    setInput("");
    setError(null);
    stopListening();
    void startConversation();
  }

  const isOrbActive = assistantState === "listening" || assistantState === "processing" || assistantState === "bot_speaking";

  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_right,rgba(34,75,195,0.1),transparent_40%),radial-gradient(circle_at_top_left,rgba(56,172,6,0.12),transparent_38%)]">
      <div className="border-b border-border bg-card/88 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#38ac06]/50 to-[#224bc3]/50"
                animate={
                  isOrbActive
                    ? { scale: [1, 1.35, 1], opacity: [0.42, 0.12, 0.42] }
                    : { scale: 1, opacity: 0.18 }
                }
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative inline-flex h-5 w-5 rounded-full bg-gradient-to-br from-[#38ac06] to-[#224bc3]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">ZeptAI Intake Assistant</p>
              <p className="text-xs text-muted-foreground">{statusText}</p>
            </div>
          </div>

          <span className={`rounded-full border px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] ${assistantMeta.chipClass}`}>
            {assistantMeta.label}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {apiBase && <span className="rounded-full border border-border bg-card/90 px-2.5 py-1">API: {apiBase}</span>}
          <span className="rounded-full border border-border bg-card/90 px-2.5 py-1">
            Turn: {isListening ? "Patient" : lastMessage?.from === "bot" ? "Assistant" : "Waiting"}
          </span>
        </div>

        <AnimatePresence>
          {assistantState === "listening" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 flex items-center gap-1.5"
            >
              {[0, 1, 2, 3, 4].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#38ac06] to-[#224bc3]"
                  animate={{ height: [8, 18, 9, 16, 8] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: bar * 0.08 }}
                />
              ))}
              <span className="ml-1 text-[11px] text-muted-foreground">Listening for your response...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 py-4">
        {reportOnly && report ? (
          <div className="space-y-4 rounded-2xl border border-[#224bc3]/20 bg-card/92 p-4 shadow-[0_18px_45px_-35px_rgba(34,75,195,0.65)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#38ac06]/15 text-[#2f8f07]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Clinical Intake Report</p>
                  <p className="text-xs text-muted-foreground">Structured summary generated successfully</p>
                </div>
              </div>
              {report.generated_at && (
                <div className="text-[11px] text-muted-foreground">
                  {new Date(report.generated_at).toLocaleString()}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/85 p-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Chief Complaint</div>
                <div className="mt-1 text-sm text-foreground/85">{report.summary?.chief_complaint || "Not available"}</div>
              </div>
              <div className="rounded-xl border border-border bg-background/85 p-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Risk Level</div>
                <div className="mt-1 text-sm font-medium text-foreground/85">{report.analysis?.risk_level || "Not available"}</div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/85 p-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Summary</div>
              <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-foreground/85">
                {report.summary?.summary_text || "Not available"}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/85 p-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Key Findings</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-foreground/85">
                  {(report.analysis?.key_findings || []).length > 0 ? (
                    report.analysis?.key_findings?.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li>Not available</li>
                  )}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-background/85 p-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Red Flags</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-foreground/85">
                  {(report.analysis?.red_flags || []).length > 0 ? (
                    report.analysis?.red_flags?.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li>Not available</li>
                  )}
                </ul>
              </div>
            </div>

            <button
              onClick={startNewConversation}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-muted"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> New Conversation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                  m.from === "bot"
                    ? "border border-border bg-card/92 text-foreground/85"
                    : "ml-auto bg-gradient-to-br from-[#224bc3] to-[#1d3ea1] text-white"
                }`}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] opacity-80">
                  {m.from === "bot" ? <Bot className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                  {m.from === "bot" ? "ZeptAI Assistant" : "Patient"}
                </div>
                {m.text}
              </motion.div>
            ))}

            {loading && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#224bc3]/20 bg-card/90 px-3 py-2 text-xs text-[#224bc3]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Assistant is processing...
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                Error: {error}
              </div>
            )}
          </div>
        )}
      </div>

      {!reportOnly && (
        <div className="border-t border-border bg-card/90 p-3 backdrop-blur-sm">
          <div className="mb-2 flex flex-wrap gap-2">
            <button
              onClick={generateReport}
              disabled={reportLoading || !conversationId || loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-muted disabled:opacity-50"
            >
              {reportLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {reportLoading ? "Generating report..." : "Generate Report"}
            </button>

            <button
              onClick={startNewConversation}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-muted disabled:opacity-50"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> New Conversation
            </button>

            <button
              onClick={toggleListening}
              disabled={loading || reportLoading || !conversationId}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                isListening
                  ? "border-[#38ac06]/40 bg-[#38ac06]/15 text-[#2f8f07]"
                  : "border-[#224bc3]/35 bg-[#224bc3]/10 text-[#224bc3]"
              }`}
            >
              {isListening ? <Volume2 className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              {isListening ? "Stop Listening" : "Voice Reply"}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void sendMessage()}
              placeholder={isListening ? "Listening... say your symptoms" : "Describe your symptoms..."}
              className="flex-1 rounded-2xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#224bc3]/40 focus:ring-2 focus:ring-[#224bc3]/20"
            />
            <button
              onClick={() => void sendMessage()}
              disabled={loading || !conversationId || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#38ac06] to-[#224bc3] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(34,75,195,0.85)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </div>
      )}

      {reportOnly && (
        <div className="border-t border-border bg-card/90 p-3 text-xs text-muted-foreground">
          Report view is active. Start a new conversation to run another live intake.
        </div>
      )}
    </div>
  );
}
