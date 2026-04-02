"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Sparkles } from "lucide-react";

export default function Research() {
  const papers = [
    {
      title: "AI-powered conversational framework for mental health diagnosis",
      journal: "PeerJ Computer Science",
      year: "2026",
      impactFactor: "3.8",
      href: "https://peerj.com/articles/cs-3602/",
      doi: "10.7717/peerj-cs.3602",
      summary:
        "Hybrid conversational AI pipeline combining GPT-powered dialogue and deep learning classification for scalable mental health screening.",
      highlights: ["96.27% accuracy", "ROC-AUC > 0.91", "1.67 ms inference"],
    },
    {
      title:
        "Interpretable chest X-ray localization using principal component-based feature selection in deep learning",
      journal: "Engineering Applications of Artificial Intelligence",
      year: "2025",
      impactFactor: "8.0",
      href: "https://doi.org/10.1016/j.engappai.2025.112358",
      doi: "10.1016/j.engappai.2025.112358",
      summary:
        "Explainable medical imaging research focused on interpretable deep learning for chest X-ray localization and trustworthy clinical AI deployment.",
      highlights: ["Q1 journal", "Explainable AI", "Clinical imaging focus"],
    },
  ];

  return (
    <section
      id="research"
      className="relative overflow-hidden bg-secondary/20 py-24"
      aria-label="Healthcare AI research publications and journal impact"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Research and Scientific Authority
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Peer-Reviewed AI Research Behind ZeptAI
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            ZeptAI is shaped by published healthcare AI research in conversational diagnosis and interpretable medical imaging.
            That research foundation informs how we design enterprise intake APIs, web-based patient conversations, and doctor-ready summaries that fit real clinical workflows.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-center">
            <p className="text-2xl font-bold text-primary">2</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Published Papers</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-center">
            <p className="text-2xl font-bold text-primary">Q1</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Journal Tier</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-center">
            <p className="text-2xl font-bold text-primary">8.0</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Max Impact Factor</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-center">
            <p className="text-2xl font-bold text-primary">96.27%</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reported Accuracy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {papers.map((paper, index) => (
            <motion.article
              key={paper.doi}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background/95 p-7 shadow-sm"
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-80" />

              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <BookOpen className="h-3.5 w-3.5" />
                  Published Research
                </div>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {paper.year}
                </span>
              </div>

              <h3 className="text-xl font-bold leading-snug md:text-2xl">{paper.title}</h3>

              <p className="mt-3 text-sm font-medium text-foreground/80">
                {paper.journal} · Impact Factor: {paper.impactFactor}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{paper.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {paper.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <FileText className="h-4 w-4" />
                  Read Paper
                  <ExternalLink className="h-4 w-4" />
                </a>

                <p className="text-xs text-muted-foreground">
                  DOI:{" "}
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {paper.doi}
                  </a>
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Journal impact factors shown are latest publicly reported values and may change with annual updates.
        </p>
      </div>
    </section>
  );
}
