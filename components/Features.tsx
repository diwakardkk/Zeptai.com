"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Globe2, Activity, Clock, Users } from "lucide-react";

const features = [
  {
    title: "Conversational AI",
    description: "NLP-driven virtual assistant understands natural language and medical terminology, ensuring empathetic patient interaction.",
    icon: <Activity className="w-5 h-5 text-primary" />
  },
  {
    title: "Smart Triage",
    description: "Prioritizes critical cases by intelligently analyzing symptoms against an established medical knowledge base.",
    icon: <CheckCircle2 className="w-5 h-5 text-primary" />
  },
  {
    title: "Workload Reduction",
    description: "Reduces clinical documentation time by up to 40% with automated, ready-to-read EHR summaries.",
    icon: <Clock className="w-5 h-5 text-primary" />
  },
  {
    title: "Multi-Language Support",
    description: "Interacts seamlessly in multiple languages, making quality healthcare accessible without barriers.",
    icon: <Globe2 className="w-5 h-5 text-primary" />
  },
  {
    title: "Explainable AI (XAI)",
    description: "Transparent reasoning allows doctors to see exactly how the AI arrived at its pre-screening summary.",
    icon: <Shield className="w-5 h-5 text-primary" />
  },
  {
    title: "Seamless Integration",
    description: "Designed to operate independently or connect natively with existing hospital patient management systems.",
    icon: <Users className="w-5 h-5 text-primary" />
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Key Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful tools designed specifically for the rigorous demands of modern clinical environments.
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
