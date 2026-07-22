"use client";

import { useState, FormEvent } from "react";
import { AudioLines, Mic, ArrowRight, Sparkles, Mail, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function WorkingBotDemoCard() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function focusEmailInput() {
    document.getElementById("demo-email-input")?.focus();
  }

  async function handleDemoSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          sourcePage: "/projects/conversational-health-ai",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit request.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/85 p-5 sm:p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-md flex flex-col justify-between">
      {/* Background ambient glowing effects */}
      <div className="pointer-events-none absolute -left-10 top-2 h-36 w-36 rounded-full bg-[#38ac06]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-2 h-40 w-40 rounded-full bg-[#224bc3]/10 blur-3xl" />

      {/* Voice Interface Inner Light Panel */}
      <div className="relative rounded-2xl border border-border/70 bg-white/95 p-5 sm:p-7 shadow-sm backdrop-blur-sm">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
            <AudioLines className="h-4 w-4 text-[#224bc3]" />
            Voice Interface
          </p>
          <span className="rounded-full border border-border/80 bg-card/90 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            READY
          </span>
        </div>

        {/* Center Voice CTA Section */}
        <div className="my-7 flex flex-col items-center gap-3.5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#224bc3]">
            READY
          </p>

          <button
            type="button"
            onClick={focusEmailInput}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(34,75,195,0.45)] transition-all hover:scale-[1.02] hover:shadow-[0_16px_38px_-4px_rgba(34,75,195,0.6)] active:scale-[0.98]"
          >
            <Mic className="h-4.5 w-4.5 text-white" />
            <span>Start Conversation</span>
            <ArrowRight className="h-4.5 w-4.5 text-white transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Email Demo Access Form Section */}
      <div className="mt-4 rounded-2xl border border-border/70 bg-white/90 p-4 sm:p-5 shadow-sm">
        {!submitted ? (
          <form onSubmit={handleDemoSubmit} className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2f8f07] uppercase tracking-wider mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                Request Working Bot Demo
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                To experience the live working bot demo, please enter your email ID below to receive access credentials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="demo-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email ID..."
                  required
                  className="w-full rounded-xl border border-border/80 bg-white pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#224bc3] focus:ring-1 focus:ring-[#224bc3] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition disabled:opacity-50 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request Demo <Send className="h-3.5 w-3.5 ml-0.5" />
                  </>
                )}
              </button>
            </div>

            {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
          </form>
        ) : (
          <div className="py-2 text-center space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#38ac06]/15 text-[#2f8f07]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Demo Request Received!</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We have received your demo request for <span className="font-semibold text-foreground">{email}</span>. Access credentials will be emailed shortly.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
