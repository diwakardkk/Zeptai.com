"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, CircleAlert, MessageSquarePlus } from "lucide-react";

type CommentFormProps = {
  postSlug: string;
  onSubmitted: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type StatusTone = "success" | "error" | "neutral";

export default function CommentForm({ postSlug, onSubmitted }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ tone: StatusTone; message: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (website.trim()) {
      setStatus({ tone: "error", message: "Spam submission blocked." });
      return;
    }

    const payload = {
      postSlug,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      comment: comment.trim(),
    };

    if (!payload.name || !payload.email || !payload.mobile || !payload.comment) {
      setStatus({ tone: "error", message: "Please fill name, email, mobile, and comment." });
      return;
    }

    if (!EMAIL_REGEX.test(payload.email)) {
      setStatus({ tone: "error", message: "Please enter a valid email address." });
      return;
    }

    if (payload.comment.length < 8) {
      setStatus({ tone: "error", message: "Comment should be at least 8 characters." });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorMessage =
          typeof result?.details === "string"
            ? `${result?.error ?? "Unable to submit comment."} (${result.details})`
            : (result?.error ?? "Unable to submit comment.");
        setStatus({ tone: "error", message: errorMessage });
        return;
      }

      setName("");
      setEmail("");
      setMobile("");
      setComment("");
      setStatus({
        tone: "success",
        message: "Comment submitted. It will appear after moderation approval.",
      });
      setTimeout(() => setStatus(null), 5000);
      onSubmitted();
    } catch {
      setStatus({ tone: "error", message: "Unable to submit comment. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const fieldClassName =
    "w-full rounded-2xl border border-[#224bc3]/20 bg-card/95 px-4 py-3 text-sm text-foreground shadow-[0_8px_26px_rgba(9,9,9,0.04)] outline-none transition placeholder:text-muted-foreground hover:border-[#224bc3]/30 focus:border-[#224bc3]/45 focus:ring-4 focus:ring-[#38ac06]/15";

  const statusClassName =
    status?.tone === "success"
      ? "border-[#38ac06]/35 bg-[#38ac06]/12 text-[#15531b] dark:text-[#79d25c]"
      : status?.tone === "error"
        ? "border-[#224bc3]/35 bg-[#224bc3]/12 text-[#11214f] dark:text-[#98b7ff]"
        : "border-border bg-card/85 text-muted-foreground";

  return (
    <div className="rounded-[1.6rem] border border-border bg-[linear-gradient(160deg,hsl(var(--card)),rgba(34,75,195,0.06),rgba(56,172,6,0.06))] p-5 shadow-[0_16px_40px_rgba(9,9,9,0.08)] md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold tracking-tight text-foreground">Share Your Perspective</h4>
          <p className="mt-1 text-xs text-muted-foreground">Professional, respectful comments help everyone.</p>
        </div>
        <div className="hidden rounded-full border border-[#224bc3]/15 bg-card/90 p-2 text-[#224bc3] md:inline-flex">
          <MessageSquarePlus className="h-4 w-4" />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="comment-name" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Name
            </label>
            <input
              id="comment-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={fieldClassName}
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="comment-email" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Email
            </label>
            <input
              id="comment-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              type="email"
              className={fieldClassName}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="comment-mobile" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Mobile
          </label>
          <input
            id="comment-mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98765 43210"
            className={fieldClassName}
            required
            autoComplete="tel"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="comment-body" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Comment
          </label>
          <textarea
            id="comment-body"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts on this article..."
            rows={6}
            className={`${fieldClassName} resize-none leading-6`}
            required
          />
          <p className="text-xs text-muted-foreground">At least 8 characters. Keep it constructive and relevant.</p>
        </div>

        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role={status?.tone === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${statusClassName}`}
          >
            {status?.tone === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : status?.tone === "error" ? (
              <CircleAlert className="h-4 w-4" />
            ) : null}
            <span>{status?.message ?? "Comments are reviewed before becoming public."}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[linear-gradient(120deg,#38ac06_0%,#224bc3_100%)] px-6 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(34,75,195,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,75,195,0.45)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                Submitting...
              </span>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
