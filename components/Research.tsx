"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Microscope } from "lucide-react";

export default function Research() {
  return (
    <section id="research" className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wider uppercase text-sm"
          >
            Scientific Credibility
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4">Backed by Rigorous Research</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our foundations lie in peer-reviewed science, guaranteeing performance that meets clinical standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-background border border-border p-8 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
            <BookOpen className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-4">SCIE Q1 Publications</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our core algorithms and models have been documented, reviewed, and published in top-tier SCIE Q1 medical intelligence journals, ensuring maximum scientific validity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background border border-border p-8 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors" />
            <Microscope className="w-10 h-10 text-blue-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">AI in Medical Imaging</h3>
            <p className="text-muted-foreground leading-relaxed">
              Beyond conversational AI, our team possesses deep roots in multi-modal medical AI, processing complex medical imaging to provide holistic diagnostics support.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
