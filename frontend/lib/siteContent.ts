export type StatusTone = "blue" | "green" | "amber" | "slate";

export type StatusDescriptor = {
  label: string;
  tone: StatusTone;
};

export type ResearchPublication = {
  title: string;
  journal: string;
  year: string;
  doi: string;
  href: string;
  summary: string;
  status: StatusDescriptor;
};

export type ResearchTheme = {
  title: string;
  description: string;
  evidence: string;
  status: StatusDescriptor;
};

export type FocusArea = {
  title: string;
  description: string;
  href: string;
  status: StatusDescriptor;
};

export type CollaborationMode = {
  title: string;
  description: string;
};

export type ProjectEntry = {
  title: string;
  summary: string;
  href: string;
  status: StatusDescriptor;
  bullets: string[];
};

export const corePositioningStatement =
  "ZeptAI is a research-focused technology company working at the intersection of artificial intelligence, healthcare innovation, and quantum computing. We translate scientific research into responsible, usable and scalable digital systems.";

export const homeFocusAreas: FocusArea[] = [
  {
    title: "Healthcare AI Systems",
    description:
      "Voice and workflow-oriented software for patient intake, structured summaries, and reviewable care-team support.",
    href: "/projects/conversational-health-ai",
    status: { label: "Pilot-ready product", tone: "green" },
  },
  {
    title: "AI and Machine Learning Research",
    description:
      "Published work in conversational diagnosis pipelines and interpretable medical imaging provides the evidence base behind current product thinking.",
    href: "/research#publications",
    status: { label: "Published foundation", tone: "green" },
  },
  {
    title: "Quantum Computing Research",
    description:
      "ZeptAI is building capability in hybrid quantum-classical methods, realistic benchmarking, and algorithm exploration without overclaiming deployment or advantage.",
    href: "/research/quantum-computing",
    status: { label: "Ongoing direction", tone: "blue" },
  },
];

export const researchPublications: ResearchPublication[] = [
  {
    title: "Conversational Framework for Mental Health Diagnosis",
    journal: "PeerJ Computer Science",
    year: "2026",
    doi: "10.7717/peerj-cs.3602",
    href: "https://peerj.com/articles/cs-3602/",
    summary:
      "Peer-reviewed work on linking conversational collection with downstream diagnostic classification in a structured AI workflow.",
    status: { label: "Published", tone: "green" },
  },
  {
    title: "Interpretable Chest X-ray Localization with Principal Components",
    journal: "Engineering Applications of Artificial Intelligence",
    year: "2025",
    doi: "10.1016/j.engappai.2025.112358",
    href: "https://doi.org/10.1016/j.engappai.2025.112358",
    summary:
      "Published research in explainable medical imaging that strengthens ZeptAI's broader technical foundation beyond conversational systems.",
    status: { label: "Published", tone: "green" },
  },
];

export const researchThemes: ResearchTheme[] = [
  {
    title: "Conversational AI for health screening and intake",
    description:
      "Research and product work meet in conversational systems that capture context, structure information, and support the next clinical step.",
    evidence:
      "Grounded in published conversational AI research and translated into product workflows through the Projects track.",
    status: { label: "Published foundation", tone: "green" },
  },
  {
    title: "Explainable medical imaging and interpretability",
    description:
      "Interpretability is treated as a technical requirement, not a presentation layer. That carries into ZeptAI's broader approach to trustworthy systems.",
    evidence:
      "Supported by published work in chest X-ray localization and explainable model behavior.",
    status: { label: "Published foundation", tone: "green" },
  },
  {
    title: "Hybrid quantum-classical algorithms",
    description:
      "ZeptAI is actively building research capability in algorithmic methods that combine classical optimization with emerging quantum workflows.",
    evidence:
      "Current status is exploratory and research-led. No commercial utility or quantum advantage is claimed.",
    status: { label: "Ongoing research", tone: "blue" },
  },
  {
    title: "Quantum benchmarking and realistic evaluation",
    description:
      "The company is studying how future quantum methods should be benchmarked against classical baselines before any deployment claims are made.",
    evidence:
      "This is evidence-seeking work focused on rigor, not promotional performance claims.",
    status: { label: "Ongoing research", tone: "blue" },
  },
];

export const quantumResearchDirections: ResearchTheme[] = [
  {
    title: "Optimization-oriented hybrid workflows",
    description:
      "Exploring whether hybrid quantum-classical methods can contribute meaningfully to constrained optimization problems relevant to future digital systems.",
    evidence:
      "Work is ongoing and should be treated as research capability development, not proven deployment value.",
    status: { label: "Ongoing", tone: "blue" },
  },
  {
    title: "Benchmarking against strong classical baselines",
    description:
      "Any future quantum proposition must be evaluated against credible classical methods, realistic compute assumptions, and reproducible measurements.",
    evidence:
      "This is a methodological requirement ZeptAI treats as core to responsible quantum research.",
    status: { label: "Ongoing", tone: "blue" },
  },
  {
    title: "Use-case selection and problem framing",
    description:
      "ZeptAI is identifying where quantum methods might eventually matter and where they likely do not, so research remains grounded in practical relevance.",
    evidence:
      "This direction is conceptual and screening-oriented rather than productized.",
    status: { label: "Conceptual screening", tone: "slate" },
  },
];

export const collaborationModes: CollaborationMode[] = [
  {
    title: "Academic collaboration",
    description:
      "ZeptAI welcomes research collaboration on healthcare AI, explainability, evaluation, and emerging quantum methods.",
  },
  {
    title: "Industry pilots",
    description:
      "Healthcare teams can engage around workflow pilots, structured intake systems, and human-reviewed deployment experiments.",
  },
  {
    title: "International research dialogue",
    description:
      "The company is open to cross-border technical exchange where methods, evidence standards, and practical constraints are discussed transparently.",
  },
];

export const projectEntries: ProjectEntry[] = [
  {
    title: "Conversational Health AI",
    summary:
      "A voice and text product track for supportive health conversations, structured patient intake, and workflow-aware information capture.",
    href: "/projects/conversational-health-ai",
    status: { label: "Pilot-ready product", tone: "green" },
    bullets: [
      "Voice and text interaction modes",
      "Structured transcript and summary flow",
      "Human-reviewed deployment framing",
    ],
  },
  {
    title: "Structured Clinical Summary Pipeline",
    summary:
      "Transforms conversational input into reviewable notes and downstream-ready clinical structure rather than leaving teams with raw transcripts.",
    href: "/projects",
    status: { label: "Prototype", tone: "amber" },
    bullets: [
      "Information extraction and organization",
      "Review-focused output shape",
      "Designed to support, not replace, clinicians",
    ],
  },
  {
    title: "Safety and feedback instrumentation",
    summary:
      "Operational controls for privacy messaging, turn limits, feedback capture, and usage review across product interactions.",
    href: "/projects",
    status: { label: "Ongoing system work", tone: "blue" },
    bullets: [
      "User feedback loops",
      "Clear non-emergency framing",
      "Human oversight and deployment controls",
    ],
  },
];

export const projectCapabilities = [
  "Capture information through voice or typed interaction",
  "Support English, Hindi, and mixed-language usage",
  "Keep outputs structured for downstream review",
  "Operate with explicit privacy and non-emergency messaging",
  "Preserve human validation as part of the workflow",
  "Enable feedback collection for iterative improvement",
];

export const projectDeploymentPrinciples = [
  {
    title: "Product, not company identity",
    description:
      "The conversational healthcare system is an important ZeptAI product track, but it does not define the full identity of the company.",
  },
  {
    title: "Human review stays central",
    description:
      "Outputs are designed for inspection, validation, and downstream use by people rather than autonomous clinical decision-making.",
  },
  {
    title: "Transparent status labelling",
    description:
      "ZeptAI separates deployed product work, prototypes, and ongoing research so visitors can understand what is operational today and what is still developing.",
  },
];

export function getStatusBadgeClasses(tone: StatusTone) {
  switch (tone) {
    case "green":
      return "border-[#38ac06]/25 bg-[#38ac06]/10 text-[#2f8f07]";
    case "amber":
      return "border-amber-300/40 bg-amber-50 text-amber-700";
    case "slate":
      return "border-slate-300/60 bg-slate-100 text-slate-700";
    case "blue":
    default:
      return "border-[#224bc3]/25 bg-[#224bc3]/10 text-[#224bc3]";
  }
}