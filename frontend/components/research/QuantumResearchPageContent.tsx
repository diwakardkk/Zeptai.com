"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Orbit,
  Cpu,
  HeartPulse,
  ShieldCheck,
  Building2,
  Layers,
  Code2,
  Zap,
  BarChart3,
  Sliders,
  Activity,
  FileCode,
  ShieldAlert,
  Network,
  Target,
  Sparkles,
  Lightbulb,
  Compass,
  CheckCircle2,
  Users
} from "lucide-react";

const coreResearchAreas = [
  {
    title: "Quantum Algorithms",
    icon: Cpu,
    color: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-[#224bc3]",
    description:
      "We are studying quantum algorithms that can support classification, optimization, representation learning, and healthcare intelligence tasks. This includes hybrid approaches where quantum circuits work together with classical machine learning models."
  },
  {
    title: "Quantum AI for Healthcare",
    icon: HeartPulse,
    color: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-[#2f8f07]",
    description:
      "Our research explores how Quantum AI can be applied to healthcare problems such as biomedical signal analysis, patient risk modeling, diagnostic assistance, and clinical decision support. We are especially interested in whether quantum models can improve learning from complex, noisy, or limited medical datasets."
  },
  {
    title: "Reliability of Quantum AI",
    icon: ShieldCheck,
    color: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
    description:
      "Healthcare systems require high trust, stability, and explainability. We are researching the reliability of Quantum AI models by evaluating consistency, robustness to noise, reproducibility, and comparison with classical AI systems."
  },
  {
    title: "Adoptability in Healthcare",
    icon: Building2,
    color: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600",
    description:
      "We study the practical adoption challenges of Quantum AI in healthcare, including hardware limitations, resource requirements, integration with existing AI pipelines, regulatory expectations, clinical usability, and cost-benefit analysis."
  },
  {
    title: "Variational Quantum Circuits",
    icon: Layers,
    color: "from-cyan-500/10 to-blue-500/10",
    iconColor: "text-cyan-600",
    description:
      "Variational Quantum Circuits are a key part of our research. We are investigating how VQCs can be used for classification, representation learning, and signal-based healthcare tasks, while analyzing trainability, circuit depth, noise sensitivity, and optimization behavior."
  },
  {
    title: "Quantum Encoding Methods",
    icon: Code2,
    color: "from-[#224bc3]/10 to-[#38ac06]/10",
    iconColor: "text-[#224bc3]",
    description:
      "Medical data must be transformed into quantum states before quantum processing can happen. We are researching different encoding methods such as angle encoding, amplitude encoding, basis encoding, and hybrid feature encoding to understand which techniques are most suitable for healthcare signals and structured medical data."
  },
  {
    title: "Quantum Resource Optimization",
    icon: Zap,
    color: "from-yellow-500/10 to-amber-500/10",
    iconColor: "text-amber-600",
    description:
      "Current quantum hardware has limited qubits, noise, and execution constraints. Our work studies how to reduce circuit complexity, optimize qubit usage, minimize gate depth, and design efficient quantum models that can run on near-term quantum devices."
  },
  {
    title: "Classical Benchmarking",
    icon: BarChart3,
    color: "from-[#38ac06]/10 to-emerald-500/10",
    iconColor: "text-[#2f8f07]",
    description:
      "Every quantum method must be tested against strong classical baselines. We compare quantum and hybrid models with classical machine learning and deep learning approaches to understand where quantum methods are competitive, where they are limited, and what improvements are still needed."
  }
];

const projectsInProgress = [
  {
    id: "01",
    title: "Variational Quantum Classifier for Healthcare Data",
    icon: Sliders,
    badge: "Algorithm Study",
    description:
      "We are developing Variational Quantum Classifier models for healthcare classification tasks. This research studies how parameterized quantum circuits can classify medical patterns and how their performance compares with classical machine learning models.",
    details:
      "Key focus areas include circuit architecture, feature encoding, optimizer selection, training stability, model accuracy, and robustness under noisy conditions."
  },
  {
    id: "02",
    title: "ECG Signal Representation in Quantum Systems",
    icon: Activity,
    badge: "Signal Intelligence",
    description:
      "This project explores how ECG signals can be represented and processed using quantum computing methods. ECG data contains temporal, frequency, and morphological patterns, making it an important candidate for studying quantum feature representation.",
    details:
      "The research investigates how ECG signals can be encoded into quantum states, how quantum circuits can extract useful patterns, and whether hybrid quantum-classical models can support arrhythmia detection or cardiac signal classification."
  },
  {
    id: "03",
    title: "Quantum Encoding Methods for Medical Data",
    icon: FileCode,
    badge: "Data Transformation",
    description:
      "We are comparing multiple quantum data encoding strategies to identify which methods are most effective for healthcare datasets. The project studies trade-offs between expressiveness, circuit depth, qubit requirement, training complexity, and model performance.",
    details:
      "Encoding methods under study include angle encoding, amplitude encoding, basis encoding, data re-uploading, and hybrid classical-quantum preprocessing."
  },
  {
    id: "04",
    title: "Quantum Resource Optimization",
    icon: Cpu,
    badge: "Hardware Readiness",
    description:
      "This research focuses on making quantum models more practical by reducing resource usage. We are studying circuit compression, gate reduction, qubit-efficient model design, and optimization techniques that make quantum algorithms more suitable for near-term hardware.",
    details:
      "The objective is to design quantum AI models that are not only accurate, but also efficient, scalable, and realistic to execute."
  },
  {
    id: "05",
    title: "Quantum AI Reliability in Healthcare",
    icon: ShieldAlert,
    badge: "Trust & Calibration",
    description:
      "We are investigating how reliable Quantum AI systems can be when applied to healthcare use cases. This includes evaluating model stability, sensitivity to quantum noise, repeatability of results, uncertainty estimation, and comparison with established classical AI models.",
    details:
      "This work is essential for understanding whether Quantum AI can be trusted in healthcare environments."
  },
  {
    id: "06",
    title: "Hybrid Quantum-Classical Healthcare Models",
    icon: Network,
    badge: "Hybrid Systems",
    description:
      "We are building hybrid models where classical neural networks or machine learning pipelines interact with quantum circuits. These models are designed to combine the strengths of classical computation with quantum representation and optimization methods.",
    details:
      "Potential applications include signal classification, patient data analysis, biomedical pattern recognition, and decision-support research."
  }
];

const researchObjectives = [
  "Develop quantum and hybrid quantum-classical algorithms for healthcare AI.",
  "Study Quantum AI reliability, robustness, and reproducibility.",
  "Explore ECG and biomedical signal representation in quantum systems.",
  "Compare quantum models with strong classical benchmarks.",
  "Optimize quantum circuit resources for near-term devices.",
  "Evaluate the adoptability of Quantum AI in real healthcare environments.",
  "Build research foundations for future clinical-grade quantum AI systems."
];

export default function QuantumResearchPageContent() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pt-32 pb-16 md:pt-36 md:pb-24">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[-8%] h-[22rem] w-[22rem] rounded-full bg-[#224bc3]/14 blur-[110px]" />
        <div className="absolute right-[-10%] top-[12%] h-[26rem] w-[26rem] rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,75,195,0.10),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(56,172,6,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.055)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:gap-20 lg:px-8">
        
        {/* Navigation & Hero Section */}
        <div>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#224bc3] hover:text-[#1b3a9d] transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Research Overview
          </Link>

          <section className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-white/78 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3] shadow-[0_18px_40px_-30px_rgba(34,75,195,0.5)] backdrop-blur-sm">
              <Orbit className="h-3.5 w-3.5" /> Quantum Computing &amp; AI Research
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              Quantum Computing
              <br />
              <span className="bg-gradient-to-r from-[#224bc3] via-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
                Research Direction
              </span>
            </h1>
            <p className="mt-5 text-lg leading-8 font-medium text-foreground/90 md:text-xl">
              Advancing quantum algorithms, Quantum AI, and practical healthcare applications through reliable, benchmarked, and resource-aware research.
            </p>
            
            <div className="mt-6 rounded-2xl border border-[#224bc3]/20 bg-white/80 p-4 sm:p-5 shadow-sm backdrop-blur-sm flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#224bc3] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-semibold leading-6 text-foreground/80 italic">
                &ldquo;Exploring how quantum computing can support the next generation of intelligent, scalable, and trustworthy healthcare systems.&rdquo;
              </p>
            </div>
          </section>
        </div>

        {/* Page Intro & Research Focus */}
        <section className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Page Intro Card */}
          <article className="rounded-[2.2rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#224bc3]/10 text-[#224bc3]">
                  <Compass className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Page Overview</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Our Quantum Computing Research direction focuses on developing and evaluating hybrid quantum-classical algorithms for real-world healthcare and AI problems. We are working on quantum algorithms, Quantum AI models, variational quantum methods, quantum optimization, and realistic benchmarking against classical machine learning approaches.
                </p>
                <p>
                  A major focus of this research is understanding the reliability, usability, and adoptability of Quantum AI in healthcare. Rather than treating quantum computing as a theoretical promise, our work studies where quantum methods may provide practical value, how they perform under noisy hardware constraints, and how they can be responsibly integrated into clinical and biomedical workflows.
                </p>
              </div>
            </div>
          </article>

          {/* Research Focus Card */}
          <article className="rounded-[2.2rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38ac06]/10 text-[#2f8f07]">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Research Focus</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  We are exploring quantum computing as a complementary layer to classical AI, especially for complex healthcare problems involving high-dimensional signals, optimization, pattern recognition, and decision support. Our research investigates how quantum models can represent medical data, how quantum circuits can be trained effectively, and how quantum resources can be optimized for realistic deployment.
                </p>
                <p>
                  The goal is not only to build quantum models, but to measure their usefulness. Every quantum approach is studied with classical baselines, performance metrics, interpretability considerations, and implementation constraints.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Core Research Areas (8 Items) */}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#224bc3]">
              Foundational Tracks
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Core Research Areas
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Eight key domains structuring our investigation into quantum computing and Quantum AI.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {coreResearchAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.title}
                  className="group rounded-[1.8rem] border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_-30px_rgba(20,32,72,0.25)] backdrop-blur-sm hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${area.color} ${area.iconColor} group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-foreground leading-snug">{area.title}</h3>
                    </div>
                    <p className="text-xs leading-6 text-muted-foreground">{area.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Research Projects Under Progress (6 Items) */}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#38ac06]/20 bg-[#38ac06]/[0.06] px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#2f8f07]">
              Active Initiatives
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Research Projects Under Progress
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Active projects investigating quantum algorithms, biomedical signal processing, and hybrid model reliability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsInProgress.map((proj) => {
              const Icon = proj.icon;
              return (
                <article
                  key={proj.title}
                  className="rounded-[2rem] border border-white/75 bg-white/85 p-6 shadow-[0_20px_48px_-36px_rgba(20,32,72,0.3)] backdrop-blur-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono text-xs font-extrabold text-[#224bc3] bg-[#224bc3]/10 px-2.5 py-1 rounded-lg">
                        PROJECT {proj.id}
                      </span>
                      <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {proj.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#224bc3]/10 text-[#224bc3]">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="text-base font-bold text-foreground leading-snug">{proj.title}</h3>
                    </div>

                    <p className="text-xs leading-6 text-muted-foreground">{proj.description}</p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/40">
                    <p className="text-[11px] leading-5 text-foreground/80 bg-muted/40 p-3 rounded-xl border border-border/20 font-medium">
                      <strong>Focus &amp; Scope:</strong> {proj.details}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Research Objectives & Why It Matters Split */}
        <section className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Research Objectives */}
          <article className="rounded-[2.2rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#224bc3]/10 text-[#224bc3]">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Research Objectives</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Where can quantum computing create measurable value?</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-foreground/85">
                {researchObjectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#38ac06] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Why This Research Matters */}
          <article className="rounded-[2.2rem] border border-[#224bc3]/20 bg-gradient-to-br from-white/90 via-white/80 to-[#224bc3]/[0.04] p-7 shadow-[0_24px_56px_-42px_rgba(20,32,72,0.3)] backdrop-blur-sm sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38ac06]/10 text-[#2f8f07]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Why This Research Matters</h2>
              </div>
              
              <p className="text-sm leading-7 text-muted-foreground mt-4">
                Healthcare data is complex, sensitive, and often difficult to model. Quantum computing offers new ways to represent information, search large solution spaces, and optimize difficult problems. While the technology is still early, careful research can help identify where quantum methods may become useful in future healthcare systems.
              </p>
              <p className="text-sm leading-7 text-muted-foreground mt-4">
                Our work is focused on responsible exploration. We study both the potential and the limitations of Quantum AI, ensuring that each method is tested, benchmarked, and evaluated for real-world feasibility.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#38ac06]/10 border border-[#38ac06]/20 p-4">
              <p className="text-xs font-semibold text-[#2f8f07]">
                ✔ Grounded in scientific rigor, transparent baselines, and practical readiness without overstating quantum advantage.
              </p>
            </div>
          </article>
        </section>

        {/* Long-Term Vision & Collaboration */}
        <section className="rounded-[2.2rem] border border-white/75 bg-gradient-to-br from-white/90 via-white/80 to-[#38ac06]/[0.05] p-8 shadow-[0_28px_64px_-46px_rgba(20,32,72,0.36)] backdrop-blur-sm sm:p-10 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-[#224bc3]/[0.06] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3]">
            Future Horizon
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Long-Term Vision
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground max-w-3xl mx-auto">
            Our long-term vision is to build a research foundation for reliable Quantum AI in healthcare. This includes quantum algorithms that can work with medical signals, hybrid models that can integrate with existing AI systems, and resource-efficient approaches that can adapt as quantum hardware improves.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground max-w-3xl mx-auto font-medium text-foreground/80">
            We believe the future of Quantum AI in healthcare will depend not only on algorithmic innovation, but also on trust, reliability, explainability, and practical adoption. Our research is designed around these principles.
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact?type=Research"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(95deg,#224bc3,#38ac06)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:-translate-y-0.5 transition"
            >
              Collaborate on Quantum Research <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

      </div>
    </section>
  );
}
