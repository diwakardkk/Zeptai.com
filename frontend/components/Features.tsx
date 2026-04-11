"use client";

import { motion } from "framer-motion";
import { Activity, AudioLines, CheckCircle2, Microscope } from "lucide-react";

const capabilities = [
  {
    title: "Research-Led Foundation",
    description:
      "Built on healthcare AI research and practical workflow understanding.",
    icon: Microscope,
    accent: "text-[#224bc3]",
  },
  {
    title: "Live System",
    description:
      "Real-time interaction designed for actual care delivery environments.",
    icon: Activity,
    accent: "text-[#2f8f07]",
  },
  {
    title: "Voice Intake",
    description:
      "Guided patient conversation for symptom capture and history collection.",
    icon: AudioLines,
    accent: "text-[#2f8f07]",
  },
  {
    title: "Clinical Screening",
    description:
      "Structured symptoms, context, and intake signals for better decision support.",
    icon: CheckCircle2,
    accent: "text-[#224bc3]",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="core-capabilities-heading"
      className="relative overflow-hidden bg-background py-10 md:py-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-6 h-44 w-44 rounded-full bg-[#38ac06]/10 blur-[80px]" />
        <div className="absolute right-[-10%] top-8 h-56 w-56 rounded-full bg-[#224bc3]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="core-capabilities-heading"
            className="text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Core Product Capabilities
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            From voice intake to structured clinical output.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-7">
          {capabilities.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -1 }}
                className="p-0.5"
              >
                <div>
                  <div className={`inline-flex h-6 w-6 items-center justify-center ${item.accent}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-2 text-base font-semibold leading-6 text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
