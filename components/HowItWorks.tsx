"use client";

import { motion } from "framer-motion";
import { MessageSquare, Database, Brain, FileText, CalendarClock, Stethoscope } from "lucide-react";

const steps = [
  {
    title: "Patient Starts Conversation",
    description: "Easy, private interaction with our virtual assistant before seeing a doctor.",
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
  },
  {
    title: "Smart Data Collection",
    description: "AI asks relevant follow-up questions to gather key medical history and symptoms.",
    icon: <Database className="w-6 h-6 text-primary" />,
  },
  {
    title: "AI-Powered Analysis",
    description: "Our LLM-powered engine summarizes and correlates symptoms efficiently.",
    icon: <Brain className="w-6 h-6 text-primary" />,
  },
  {
    title: "Report Shared with Doctor",
    description: "A comprehensive pre-screening summary is securely delivered to the physician.",
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
  {
    title: "Appointment Generation",
    description: "Instantly generates visit tokens or schedules appointments automatically.",
    icon: <CalendarClock className="w-6 h-6 text-primary" />,
  },
  {
    title: "Doctor Responds Efficiently",
    description: "Physicians save critical consultation time and focus strictly on treatment.",
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A seamless bridge between patient intake and doctor consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connector Line (visible on large screens) */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glassmorphism rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 relative group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
              
              <div className="absolute top-6 right-6 text-8xl font-black text-white/5 select-none -z-10 group-hover:text-primary/10 transition-colors">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
