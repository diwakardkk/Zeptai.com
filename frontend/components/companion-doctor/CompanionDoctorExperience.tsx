"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Languages,
  MessageSquareText,
  Mic,
  Play,
  RotateCcw,
  ShieldCheck,
  Square,
  Star,
  ThumbsDown,
  ThumbsUp,
  Waves,
  X,
} from "lucide-react";
import { submitCompanionFeedback } from "@/lib/companion-doctor/api";
import { useCompanionDoctor } from "@/hooks/companion-doctor/useCompanionDoctor";
import { CompanionFeedbackDraft, CompanionLanguage, CompanionMode } from "@/types/companion-doctor";

type CompanionDoctorExperienceProps = {
  initialMode: CompanionMode;
};

const STATUS_STYLES = {
  idle: "border-border bg-card text-muted-foreground",
  listening: "border-[#38ac06]/30 bg-[#38ac06]/10 text-[#2f8f07]",
  thinking: "border-[#224bc3]/30 bg-[#224bc3]/10 text-[#224bc3]",
  speaking: "border-[#224bc3]/30 bg-[#224bc3]/10 text-[#224bc3]",
} as const;

const LANGUAGE_LABELS: Record<CompanionLanguage, string> = {
  auto: "Auto",
  en: "English",
  hi: "Hindi",
  mixed: "Hinglish",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</p>;
}

export default function CompanionDoctorExperience({ initialMode }: CompanionDoctorExperienceProps) {
  const {
    mode,
    changeMode,
    status,
    languagePreference,
    setLanguagePreference,
    detectedLanguage,
    conversation,
    draftTranscript,
    setDraftTranscript,
    liveTranscript,
    assistantText,
    sessionId,
    remainingTurns,
    privacyNote,
    nonEmergencyNotice,
    error,
    setError,
    editBeforeSend,
    setEditBeforeSend,
    isInitializing,
    micDenied,
    feedbackOpen,
    setFeedbackOpen,
    accessLocked,
    upgradeUrl,
    startVoiceConversation,
    sendDraftTranscript,
    stopSpeaking,
    replayAssistantAudio,
    restartSession,
    endConversation,
  } = useCompanionDoctor(initialMode);

  const [feedback, setFeedback] = useState<CompanionFeedbackDraft>({
    rating: 0,
    sentiment: null,
    text: "",
    consentToShare: false,
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const isVoiceMode = mode === "voice";

  const transcriptPlaceholder = isVoiceMode
    ? "When you speak, your refined transcript will appear here."
    : "Type what you want to ask in English, Hindi, or Hinglish.";

  const handleFeedbackSubmit = async () => {
    if (!feedback.rating) {
      setFeedbackMessage("Please choose a rating before sending feedback.");
      return;
    }

    setFeedbackSubmitting(true);
    setFeedbackMessage(null);
    try {
      const response = await submitCompanionFeedback({
        ...feedback,
        sessionId,
      });
      setFeedbackMessage(response.message);
    } catch (feedbackError) {
      setFeedbackMessage(
        feedbackError instanceof Error ? feedbackError.message : "Unable to submit feedback right now.",
      );
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-8 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]" />
        <div className="absolute right-[-12%] top-8 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-card/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy-first Companion Demo
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-[3rem]">
            Calm Voice Support for Everyday Health Questions
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
            This is a supportive AI health companion, not a doctor and not an emergency service.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4 rounded-[28px] border border-border bg-card/92 p-5 shadow-[0_28px_56px_-44px_rgba(0,0,0,0.56)] backdrop-blur-sm md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[status]}`}>
                {status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#224bc3]">
                <Languages className="h-3.5 w-3.5" />
                {LANGUAGE_LABELS[detectedLanguage]}
              </span>
              <span className="rounded-full border border-[#38ac06]/25 bg-[#38ac06]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#2f8f07]">
                {accessLocked ? "Free credits consumed" : `Free demo with limited usage ${remainingTurns !== null ? `• ${remainingTurns} turns left` : ""}`}
              </span>
            </div>

            <div className="rounded-[24px] border border-border bg-background/85 p-5 text-center">
              <button
                type="button"
                onClick={() => {
                  if (mode === "voice") {
                    void startVoiceConversation();
                    return;
                  }
                  changeMode("voice");
                  setError(null);
                }}
                className="group relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,75,195,0.24),rgba(56,172,6,0.18))] text-[#224bc3] shadow-[0_20px_44px_-26px_rgba(34,75,195,0.72)] transition hover:-translate-y-0.5"
              >
                <motion.span
                  className="absolute inset-0 rounded-full border border-[#224bc3]/25"
                  animate={{ scale: status === "listening" || status === "speaking" ? [1, 1.12, 1] : 1, opacity: status === "idle" ? 0.45 : [0.35, 0.8, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                {status === "speaking" ? <Waves className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
              </button>
              <p className="mt-4 text-lg font-semibold text-foreground">
                {mode === "voice" ? "Tap once to begin voice conversation" : "Voice mode ready when you are"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                While you&apos;re speaking, the assistant stays silent. If you interrupt during playback, it stops immediately and listens again.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  changeMode("voice");
                  void startVoiceConversation();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#224bc3]/25 bg-card px-4 py-3 text-sm font-semibold text-[#224bc3] transition hover:bg-[#224bc3]/10"
              >
                <Mic className="h-4 w-4" />
                Voice Conversation
              </button>
              <button
                type="button"
                onClick={() => changeMode("text")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:border-[#38ac06]/30 hover:text-[#2f8f07]"
              >
                <MessageSquareText className="h-4 w-4" />
                Text Mode
              </button>
            </div>

            <div className="rounded-[24px] border border-border bg-background/75 p-4">
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>Language Preference</FieldLabel>
                <select
                  value={languagePreference}
                  onChange={(event) => setLanguagePreference(event.target.value as CompanionLanguage)}
                  className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-[#224bc3]/35"
                >
                  <option value="auto">Auto</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              {!isVoiceMode ? (
                <label className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={editBeforeSend}
                    onChange={(event) => setEditBeforeSend(event.target.checked)}
                    className="h-4 w-4 rounded border-border text-[#224bc3] focus:ring-[#224bc3]/30"
                  />
                  Allow transcript edits before sending
                </label>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={stopSpeaking}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#224bc3]/30 hover:text-[#224bc3]"
              >
                <Square className="h-4 w-4" />
                Stop Speaking
              </button>
              <button
                type="button"
                onClick={() => void replayAssistantAudio()}
                disabled={!assistantText.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#224bc3]/30 hover:text-[#224bc3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="h-4 w-4" />
                Play Reply Audio
              </button>
              <button
                type="button"
                onClick={() => void restartSession()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#38ac06]/30 hover:text-[#2f8f07]"
              >
                <RotateCcw className="h-4 w-4" />
                Restart Session
              </button>
              <button
                type="button"
                onClick={() => void endConversation()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <X className="h-4 w-4" />
                End Conversation
              </button>
            </div>

            <div className="space-y-2 rounded-[24px] border border-border bg-background/85 p-4 text-sm leading-6 text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-[#2f8f07]" />
                {privacyNote}
              </p>
              <p>{nonEmergencyNotice}</p>
              {micDenied ? <p>Microphone permission is unavailable, so text mode is ready as fallback.</p> : null}
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] border border-border bg-card/95 p-5 shadow-[0_28px_56px_-44px_rgba(0,0,0,0.56)] md:p-6">
            <div className={`grid gap-4 ${isVoiceMode ? "lg:grid-cols-1" : "lg:grid-cols-[0.95fr_1.05fr]"}`}>
              {!isVoiceMode ? (
                <div className="rounded-[24px] border border-border bg-background/85 p-4">
                  <FieldLabel>Live Transcript</FieldLabel>
                  <div className="mt-3 min-h-28 rounded-2xl border border-border bg-card/92 p-4 text-sm leading-6 text-foreground">
                    {liveTranscript ? liveTranscript : <span className="text-muted-foreground">{transcriptPlaceholder}</span>}
                  </div>
                  <textarea
                    value={draftTranscript}
                    onChange={(event) => setDraftTranscript(event.target.value)}
                    rows={6}
                    placeholder={transcriptPlaceholder}
                    className="mt-3 w-full rounded-2xl border border-border bg-card/92 px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#224bc3]/30"
                  />
                  <button
                    type="button"
                    onClick={() => void sendDraftTranscript()}
                    disabled={!draftTranscript.trim() || isInitializing}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send to Companion
                  </button>
                </div>
              ) : null}

              <div className="rounded-[24px] border border-border bg-background/85 p-4">
                <FieldLabel>Assistant Reply</FieldLabel>
                <div className="mt-3 min-h-52 rounded-2xl border border-border bg-card/92 p-4 text-sm leading-7 text-foreground">
                  {assistantText ? assistantText : <span className="text-muted-foreground">The companion reply will appear here.</span>}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-background/85 p-4">
              <FieldLabel>Conversation Flow</FieldLabel>
              <div className="mt-3 max-h-[22rem] space-y-3 overflow-auto pr-1">
                {conversation.length ? (
                  conversation.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                        item.role === "assistant"
                          ? "border-[#224bc3]/15 bg-[#224bc3]/5"
                          : "border-[#38ac06]/15 bg-[#38ac06]/5"
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.role === "assistant" ? "Assistant" : "You"}
                      </p>
                      <p className="mt-1 text-foreground">{item.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                    The session stays ephemeral. You can start with voice or type directly.
                  </p>
                )}
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {accessLocked ? (
              <div className="rounded-[24px] border border-[#224bc3]/20 bg-[linear-gradient(180deg,rgba(34,75,195,0.06),rgba(56,172,6,0.06))] p-4">
                <FieldLabel>Upgrade</FieldLabel>
                <p className="mt-2 text-base font-semibold text-foreground">Free companion credits consumed</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This device has already used the free companion demo. Choose a plan to continue using the companion.
                </p>
                <Link
                  href={upgradeUrl}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  View Pricing
                </Link>
              </div>
            ) : null}

            {feedbackOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] border border-border bg-[linear-gradient(180deg,rgba(34,75,195,0.05),rgba(56,172,6,0.08))] p-4"
              >
                <FieldLabel>Session Feedback</FieldLabel>
                <p className="mt-2 text-base font-semibold text-foreground">How accurate or helpful did this feel?</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedback((current) => ({ ...current, rating }))}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                        feedback.rating === rating
                          ? "border-[#224bc3]/30 bg-[#224bc3]/10 text-[#224bc3]"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      <Star className="h-4 w-4" />
                      {rating}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedback((current) => ({ ...current, sentiment: "up" }))}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      feedback.sentiment === "up"
                        ? "border-[#38ac06]/30 bg-[#38ac06]/10 text-[#2f8f07]"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback((current) => ({ ...current, sentiment: "down" }))}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      feedback.sentiment === "down"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Needs work
                  </button>
                </div>

                <textarea
                  value={feedback.text}
                  onChange={(event) => setFeedback((current) => ({ ...current, text: event.target.value }))}
                  rows={4}
                  placeholder="Optional feedback"
                  className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#224bc3]/30"
                />

                <label className="mt-3 flex items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={feedback.consentToShare}
                    onChange={(event) => setFeedback((current) => ({ ...current, consentToShare: event.target.checked }))}
                    className="mt-1 h-4 w-4 rounded border-border text-[#224bc3] focus:ring-[#224bc3]/30"
                  />
                  I consent to share this feedback. Without consent, this privacy-first demo keeps feedback unstored.
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleFeedbackSubmit()}
                    disabled={feedbackSubmitting}
                    className="rounded-full bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {feedbackSubmitting ? "Sending..." : "Send Feedback"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(false)}
                    className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#224bc3]/30 hover:text-[#224bc3]"
                  >
                    Close
                  </button>
                </div>

                {feedbackMessage ? (
                  <p className="mt-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                    {feedbackMessage}
                  </p>
                ) : null}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}