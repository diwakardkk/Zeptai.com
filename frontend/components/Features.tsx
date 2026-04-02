"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Globe2, Activity, Clock, Users } from "lucide-react";

const features = [
  {
    title: "Natural Voice Intake",
    description: "Patients speak normally while ZeptAI guides the intake with focused follow-up questions.",
    icon: <Activity className="w-5 h-5 text-primary" />
  },
  {
    title: "Structured Clinical Screening",
    description: "Symptoms, duration, history, and context are organized clearly for clinical review.",
    icon: <CheckCircle2 className="w-5 h-5 text-primary" />
  },
  {
    title: "Doctor-Ready Summaries",
    description: "Conversation output and review inputs come together in one concise summary and report.",
    icon: <Clock className="w-5 h-5 text-primary" />
  },
  {
    title: "Browser-Based Access",
    description: "Patients can access the working model instantly in the browser without downloading an app.",
    icon: <Globe2 className="w-5 h-5 text-primary" />
  },
  {
    title: "Research-Driven Design",
    description: "The product direction is informed by peer-reviewed research in healthcare AI and medical interpretability.",
    icon: <Shield className="w-5 h-5 text-primary" />
  },
  {
    title: "Enterprise API Integration",
    description: "Healthcare products can embed ZeptAI as an intake and screening layer inside existing workflows.",
    icon: <Users className="w-5 h-5 text-primary" />
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Core Product Capabilities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compact, workflow-focused capabilities for healthcare intake, patient screening, and doctor-facing summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-background border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
