"use client";

import { FormEvent, useState } from "react";

type CommentFormProps = {
  postSlug: string;
  onSubmitted: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CommentForm({ postSlug, onSubmitted }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (website.trim()) {
      setStatus("Spam submission blocked.");
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
      setStatus("Please fill name, email, mobile, and comment.");
      return;
    }

    if (!EMAIL_REGEX.test(payload.email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (payload.comment.length < 8) {
      setStatus("Comment should be at least 8 characters.");
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
        setStatus(result?.error ?? "Unable to submit comment.");
        return;
      }

      setName("");
      setEmail("");
      setMobile("");
      setComment("");
      setStatus("Comment submitted successfully.");
      onSubmitted();
    } catch {
      setStatus("Unable to submit comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <input
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Mobile"
        className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary"
      />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        rows={5}
        className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary"
      />

      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{status ?? "Stored per blog slug for easy moderation later."}</p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

