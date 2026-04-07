"use client";

import { motion } from "framer-motion";
import { Database, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react";

const pillars = [
  {
    title: "Privacy by Design",
    description: "ZeptAI minimizes data collection and captures only the information required for clinical intake workflows.",
    icon: ShieldCheck,
    accent: "text-[#2f8f07]",
    tone: "border-[#38ac06]/25 bg-[#38ac06]/10",
  },
  {
    title: "Data Handling & Storage",
    description: "Data is processed through structured pipelines and stored using secure cloud infrastructure with controlled access and retention practices.",
    icon: Database,
    accent: "text-[#224bc3]",
    tone: "border-[#224bc3]/25 bg-[#224bc3]/10",
  },
  {
    title: "Encryption & Access Control",
    description: "Data is protected using encrypted transmission (HTTPS/TLS) and controlled through role-based access mechanisms.",
    icon: LockKeyhole,
    accent: "text-[#224bc3]",
    tone: "border-[#224bc3]/25 bg-[#224bc3]/10",
  },
  {
    title: "Designed for Compliance",
    description: "ZeptAI is designed to align with healthcare data protection standards and supports integration into compliance-driven environments.",
    icon: FileCheck2,
    accent: "text-[#2f8f07]",
    tone: "border-[#38ac06]/25 bg-[#38ac06]/10",
  },
];

export default function SecurityPrivacy() {
  return (
    <section id="security-privacy" className="relative overflow-hidden border-y border-border bg-background py-8 md:py-9">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-6 h-44 w-44 rounded-full bg-[#38ac06]/10 blur-[80px]" />
        <div className="absolute right-[-12%] top-4 h-56 w-56 rounded-full bg-[#224bc3]/10 blur-[95px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card/90 p-4 shadow-[0_20px_48px_-38px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-5">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="inline-flex rounded-full border border-[#224bc3]/25 bg-card px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
                🔒 Security & Privacy
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Security & Privacy</h2>
              <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
                Built with healthcare data protection principles
              </p>

              <div className="mt-3 rounded-2xl border border-border bg-background/85 px-3.5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">🏥 Trust Signals</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#224bc3]/25 bg-[#224bc3]/10 px-2.5 py-1 text-[11px] font-semibold text-[#224bc3]">
                    DPIIT Recognized Startup (India)
                  </span>
                  <span className="rounded-full border border-[#38ac06]/25 bg-[#38ac06]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2f8f07]">
                    Research-Backed Healthcare AI
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-border bg-background/90 p-3"
                  >
                    <div className={`inline-flex items-center justify-center rounded-lg border p-1.5 ${item.tone}`}>
                      <Icon className={`h-3.5 w-3.5 ${item.accent}`} />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-5 text-foreground">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-background/80 px-3.5 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">📌 Transparency Note</p>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground md:text-sm">
              Healthcare compliance requirements vary across regions and use cases.
              <br />
              ZeptAI is designed for compliance-oriented deployment and supports customer-led legal, security, and
              infrastructure review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
