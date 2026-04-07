"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle, Send } from "lucide-react";

type ContactProps = {
  variant?: "section" | "page";
};

export default function Contact({ variant = "section" }: ContactProps) {
  const isPage = variant === "page";
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(isPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.name || !formData.email || !formData.mobile || !formData.message) {
        throw new Error("All fields are required.");
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sourcePage: "home_demo_request",
          inquiryType: "demo_request",
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", mobile: "", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card/92 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#224bc3]/25 focus:border-[#224bc3]/30 transition";

  const successView = (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#38ac06]/14">
        <CheckCircle className="h-7 w-7 text-[#2f8f07]" />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-foreground">Request Sent Successfully</h3>
      <p className="mt-1 text-sm text-muted-foreground">Thanks, our team will connect with you shortly.</p>
      <button
        type="button"
        onClick={() => {
          setIsSuccess(false);
          setIsFormOpen(true);
        }}
        className="mt-4 inline-flex rounded-full border border-border bg-card/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground transition hover:border-[#224bc3]/30 hover:text-[#224bc3]"
      >
        Send Another
      </button>
    </motion.div>
  );

  const formView = (
    <form onSubmit={handleSubmit} className={isPage ? "space-y-3.5" : "space-y-4"}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            disabled={isSubmitting}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="Dr. John Doe"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={isSubmitting}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
            placeholder="john@hospital.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="mobile" className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
          Mobile
        </label>
        <input
          id="mobile"
          type="tel"
          required
          disabled={isSubmitting}
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className={inputClass}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          required
          disabled={isSubmitting}
          rows={isPage ? 4 : 4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your intake workflow..."
        />
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group w-full rounded-xl bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(34,75,195,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(34,75,195,0.84)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {isPage ? "Send Request" : "Request Demo"} <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        )}
      </button>
    </form>
  );

  if (isPage) {
    return (
      <section id="contact" className="relative overflow-hidden bg-background py-10 md:py-12">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-[-10%] top-6 h-48 w-48 rounded-full bg-[#38ac06]/10 blur-[85px]"
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-12%] top-6 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]"
            animate={{ opacity: [0.45, 0.82, 0.45] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42 }}
              className="rounded-3xl border border-border bg-card/88 p-5 shadow-[0_24px_52px_-42px_rgba(0,0,0,0.58)] backdrop-blur-sm md:p-6"
            >
              <p className="inline-flex rounded-full border border-[#224bc3]/25 bg-card/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
                Demo Request
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Talk to ZeptAI</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Tell us your workflow goals and we will share a focused demo for your care team.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Clinics", "Hospitals", "Telemedicine"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-card/88 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.44, delay: 0.06 }}
              className="rounded-3xl border border-border bg-card/94 p-4 shadow-[0_24px_52px_-42px_rgba(0,0,0,0.58)] md:p-5"
            >
              {isSuccess ? successView : formView}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border bg-background py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[-10%] top-8 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]"
          animate={{ opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-10%] top-8 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]"
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-border bg-card/88 p-5 shadow-[0_26px_56px_-42px_rgba(0,0,0,0.58)] backdrop-blur-sm md:p-7"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex rounded-full border border-[#224bc3]/25 bg-card/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
              Get Started
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Request a Demo</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">See how ZeptAI fits your workflow.</p>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(95deg,#38ac06,#224bc3)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_-20px_rgba(34,75,195,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(34,75,195,0.85)]"
            >
              {isFormOpen ? "Hide Form" : "Request Demo"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {(isFormOpen || isSuccess || !!error) && (
              <motion.div
                key="demo-form"
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-2xl border border-border bg-card/92 p-4 md:p-5">
                  {isSuccess ? successView : formView}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
