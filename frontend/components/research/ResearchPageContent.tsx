"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, FileText, Orbit, Users, BrainCircuit, ShieldAlert, Cpu } from "lucide-react";

type Publication = {
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string;
  href: string;
  contribution: string;
  category: "Healthcare AI" | "Machine Learning" | "Explainable AI" | "Quantum" | "Optimization";
  status: "Published" | "Accepted" | "Preprint" | "Under Review" | "Under Process";
};

const publicationsData: Publication[] = [
  {
    title: "Integrated CNN Model for Multi-disease Classification Through Chest X-ray Images",
    authors: "D. Diwakar, D. Raj",
    journal: "ELCVIA Electronic Letters on Computer Vision and Image Analysis",
    year: "2026",
    doi: "10.5565/rev/elcvia.1804",
    href: "https://doi.org/10.5565/rev/elcvia.1804",
    contribution: "Presents an integrated convolutional neural network framework targeting simultaneous multi-disease classification from radiographs.",
    category: "Healthcare AI",
    status: "Published",
  },
  {
    title: "Conversational Framework for Mental Health Diagnosis",
    authors: "D. Diwakar, D. Raj, A. Prasad, G. Ali, M. ElAffendi",
    journal: "PeerJ Computer Science",
    year: "2026",
    doi: "10.7717/peerj-cs.3602",
    href: "https://peerj.com/articles/cs-3602/",
    contribution: "Links conversational collection with diagnostic classification in a structured workflow.",
    category: "Healthcare AI",
    status: "Published",
  },
  {
    title: "DistilBERT-based Text Classification for Automated Diagnosis of Mental Health Conditions",
    authors: "D. Diwakar, D. Raj",
    journal: "Microbial Data Intelligence and Computational Techniques for Sustainable Computing",
    year: "2024",
    doi: "10.1007/978-981-99-9621-6_6",
    href: "https://doi.org/10.1007/978-981-99-9621-6_6",
    contribution: "Explores lightweight transformer models for natural language diagnostics in remote mental health monitoring.",
    category: "Healthcare AI",
    status: "Published",
  },
  {
    title: "Recent Object Detection Techniques: A Survey",
    authors: "D. Diwakar, D. Raj",
    journal: "International Journal of Image, Graphics and Signal Processing (IJIGSP)",
    year: "2022",
    doi: "10.5815/ijigsp.2022.02.05",
    href: "https://doi.org/10.5815/ijigsp.2022.02.05",
    contribution: "Provides a systematic review of object detection architectures and their operational trade-offs.",
    category: "Machine Learning",
    status: "Published",
  },
  {
    title: "Interpretable Chest X-ray Localization with Principal Components",
    authors: "D. Diwakar, D. Raj, K. S. Kumar, G. Ali, A. Prasad",
    journal: "Engineering Applications of Artificial Intelligence",
    year: "2025",
    doi: "10.1016/j.engappai.2025.112358",
    href: "https://doi.org/10.1016/j.engappai.2025.112358",
    contribution: "Demonstrates chest X-ray localization with Principal Components for better clinical explainability.",
    category: "Explainable AI",
    status: "Published",
  },
  {
    title: "Decomposition Strategies for Constrained Quadratic Unconstrained Binary Optimization",
    authors: "DR. Diwakar, Prabhav, Santosh",
    journal: "",
    year: "2026",
    doi: "",
    href: "",
    contribution: "Proposes a novel decomposition approach for mapping QUBO instances onto hybrid classical-quantum solvers.",
    category: "Optimization",
    status: "Under Process",
  },
  {
    title: "Evaluating Small Variational Quantum Models Under Noise and Limited Data",
    authors: "DR. Diwakar, Prabhav, Santosh",
    journal: "",
    year: "2026",
    doi: "",
    href: "",
    contribution: "Establishes benchmarking parameters for variational circuits against compact classical baselines.",
    category: "Quantum",
    status: "Under Process",
  },
  {
    title: "Uncertainty Estimation and Calibration in Deep Clinical Intake Models",
    authors: "DR. Diwakar, Prabhav, Santosh",
    journal: "",
    year: "2026",
    doi: "",
    href: "",
    contribution: "Introduces temperature scaling for calibrating multi-language disease screening systems.",
    category: "Machine Learning",
    status: "Under Process",
  },
];

const quantumResearchCards = [
  {
    title: "Hybrid Quantum-Classical Optimization",
    status: "Ongoing Research",
    tone: "blue",
    description: "Designing adaptive workflows that formulate, decompose and solve constrained optimization problems using classical and quantum methods.",
  },
  {
    title: "Quantum Algorithms for Resilient Systems",
    status: "Concept and Benchmark Development",
    tone: "amber",
    description: "Studying quantum and quantum-inspired optimization for scheduling, allocation, network resilience and recovery planning.",
  },
  {
    title: "Reliable Quantum Machine Learning",
    status: "Experimental Research",
    tone: "green",
    description: "Evaluating small variational quantum models under noise, uncertainty and limited-data conditions against compact classical baselines.",
  },
  {
    title: "Quantum Resource and Readiness Assessment",
    status: "Method Development",
    tone: "slate",
    description: "Developing methods to estimate qubits, circuit depth, noise sensitivity, runtime and practical suitability before selecting a quantum solver.",
  },
];

const categories: ("All" | Publication["category"])[] = [
  "All",
  "Healthcare AI",
  "Machine Learning",
  "Explainable AI",
  "Quantum",
  "Optimization",
];

export default function ResearchPageContent() {
  const [activeFilter, setActiveFilter] = useState<"All" | Publication["category"]>("All");

  const filteredPublications = activeFilter === "All" 
    ? publicationsData 
    : publicationsData.filter(pub => pub.category === activeFilter);

  const getStatusClasses = (status: Publication["status"]) => {
    switch (status) {
      case "Published":
        return "border-[#38ac06]/20 bg-[#38ac06]/10 text-[#2f8f07]";
      case "Accepted":
        return "border-emerald-300/40 bg-emerald-50 text-emerald-700";
      case "Preprint":
        return "border-blue-300/40 bg-blue-50 text-blue-700";
      case "Under Review":
        return "border-amber-300/40 bg-amber-50 text-amber-700";
      case "Under Process":
        return "border-amber-300/40 bg-amber-50 text-amber-700";
      default:
        return "border-slate-300/40 bg-slate-50 text-slate-700";
    }
  };

  const getToneClasses = (tone: string) => {
    switch (tone) {
      case "green":
        return "border-[#38ac06]/20 bg-[#38ac06]/10 text-[#2f8f07]";
      case "amber":
        return "border-amber-300/45 bg-amber-500/10 text-amber-700";
      case "blue":
        return "border-[#224bc3]/20 bg-[#224bc3]/10 text-[#224bc3]";
      case "slate":
      default:
        return "border-slate-300/60 bg-slate-500/10 text-slate-700";
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pt-32 pb-14 md:pt-36 md:pb-18 lg:pb-20">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[-8%] h-[20rem] w-[20rem] rounded-full bg-[#224bc3]/14 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,75,195,0.10),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(56,172,6,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.055)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:gap-18 lg:px-8">
        
        {/* Research Hero */}
        <section className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-white/78 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3] shadow-[0_18px_40px_-30px_rgba(34,75,195,0.5)] backdrop-blur-sm">
            Scientific Discovery
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
            Scientific Inquiry &amp;
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#224bc3] via-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
              Research at ZeptAI
            </span>
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg lg:text-xl">
            We investigate artificial intelligence and quantum-computing methods that can address complex real-world problems. Our approach combines mathematical formulation, reproducible experimentation, strong classical baselines, responsible evaluation and pathways toward practical implementation.
          </p>
        </section>

        {/* Research Areas A & B */}
        <section className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Research Area A: AI and Healthcare */}
          <article className="rounded-[2.2rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_64px_-40px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3]">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-snug">
                  Artificial Intelligence and Healthcare
                </h2>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Our healthcare AI research focuses on improving how clinical and patient information is captured, organized, explained and used. The work emphasizes human oversight, reliability, privacy and clear limitations rather than autonomous diagnosis.
              </p>
              
              <ul className="mt-6 space-y-3 text-sm text-foreground/80">
                {[
                  "Conversational healthcare systems",
                  "Clinical information extraction and summarization",
                  "Trustworthy and explainable AI",
                  "Uncertainty estimation and calibrated prediction",
                  "Efficient AI for low-resource settings",
                  "Privacy-aware and human-in-the-loop systems",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#224bc3] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 pt-5 border-t border-border/40">
              <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#224bc3]">
                Explore Product Translation <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>

          {/* Research Area B: Quantum Computing */}
          <article className="rounded-[2.2rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_64px_-40px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#38ac06]/10 text-[#2f8f07]">
                  <Cpu className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-snug">
                  Quantum Computing
                </h2>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                ZeptAI is developing research capability in quantum computing with emphasis on hybrid quantum-classical methods. The objective is to identify problem structures where quantum algorithms may contribute practical value, while maintaining transparent comparison with strong classical methods.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/75">
                {[
                  "Quantum optimization (QUBO/Ising)",
                  "Variational algorithms & QAOA",
                  "Hybrid solver design",
                  "Targeted Quantum ML",
                  "Noise-aware mitigation",
                  "Resource estimation",
                  "Classical baselines",
                  "Applied healthcare & energy studies",
                ].map((theme) => (
                  <div key={theme} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#38ac06] shrink-0" />
                    <span>{theme}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Credibility Statement */}
            <div className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-500/10 p-4 flex gap-3 items-start">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs leading-5 text-amber-800 font-medium">
                <strong>Credibility Standard:</strong> Our research does not assume that quantum methods are always superior. Each study is designed to determine when quantum, classical or hybrid approaches are most appropriate.
              </p>
            </div>
          </article>
        </section>

        {/* Ongoing Quantum Research Cards */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              Active Studies
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ongoing Quantum Research
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These tracks represent research initiatives our team has active, ongoing programs around.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {quantumResearchCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_40px_-30px_rgba(20,32,72,0.25)] flex flex-col justify-between"
              >
                <div>
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${getToneClasses(card.tone)}`}>
                    {card.status}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground leading-6">{card.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="rounded-[2rem] border border-white/75 bg-white/84 p-6 shadow-[0_28px_64px_-46px_rgba(20,32,72,0.44)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3]">
                <FileText className="h-3.5 w-3.5" />
                Publications
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Published Research &amp; References
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                We never place manuscripts under review inside the published category. We do not display journal impact factors as the main evidence of quality.
              </p>
            </div>
            <Link href="/research/publications" className="inline-flex items-center gap-2 text-sm font-semibold text-[#224bc3]">
              Full Index <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeFilter === cat
                    ? "bg-[#224bc3] text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Publications Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPublications.map((paper) => (
              <article
                key={paper.title}
                className="rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_-36px_rgba(20,32,72,0.22)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${getStatusClasses(paper.status)}`}>
                      {paper.status}
                    </span>
                    {paper.doi && (
                      <span className="text-[10px] font-semibold text-muted-foreground font-mono">doi:{paper.doi}</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">{paper.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">{paper.authors}</p>
                  {paper.journal && (
                    <p className="mt-2 text-xs font-semibold text-foreground/80">{paper.journal} • {paper.year}</p>
                  )}
                  <p className="mt-3 text-xs leading-5 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/20">
                    <strong>Contribution:</strong> {paper.contribution}
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-border/30 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {paper.category}
                  </span>
                  {paper.href && (
                    <a
                      href={paper.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#224bc3] hover:underline"
                    >
                      Open reference <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Research Collaboration Block */}
        <section className="rounded-[2rem] border border-white/75 bg-gradient-to-br from-card/80 via-background/90 to-[#224bc3]/5 p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.32)] backdrop-blur-sm sm:p-9 text-center max-w-4xl mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#224bc3]/10 text-[#224bc3] mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Collaborate on Research
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground max-w-2xl mx-auto">
            We are open to joint research, grant proposals, benchmark development, student projects, academic-industry translation and international collaboration in AI, healthcare technology and quantum computing.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/contact?type=Research"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:-translate-y-0.5 transition"
            >
              Start Collaboration Form <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}