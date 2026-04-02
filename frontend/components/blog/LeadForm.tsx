"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  sourcePage: string;
};

export default function LeadForm({ sourcePage }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      setStatus("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
          sourcePage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error ?? "Unable to submit.");
        return;
      }

      setName("");
      setEmail("");
      setMobile("");
      setStatus("Thanks, our team will connect shortly.");
    } catch {
      setStatus("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-semibold">Get Product Updates</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <input
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Mobile"
        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Join Updates"}
      </button>
      <p className="text-xs text-muted-foreground">{status ?? "We only send relevant product and research updates."}</p>
    </form>
  );
}

