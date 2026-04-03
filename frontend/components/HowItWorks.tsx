"use client";

import { motion } from "framer-motion";
import { MessageSquare, Database, Brain, FileText, CalendarClock, Stethoscope } from "lucide-react";

const steps = [
  {
    title: "Patient Starts Voice Conversation",
    description: "The patient opens ZeptAI on the web and begins a guided, human-like audio conversation.",
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
  },
  {
    title: "AI Collects Clinical Context",
    description: "The system gathers symptoms, duration, history, medications, and key pre-consultation details.",
    icon: <Database className="w-6 h-6 text-primary" />,
  },
  {
    title: "Screening Logic Organizes Responses",
    description: "ZeptAI structures the conversation so patient concerns are captured clearly instead of remaining scattered.",
    icon: <Brain className="w-6 h-6 text-primary" />,
  },
  {
    title: "Doctor-Ready Summary Is Generated",
    description: "A report is prepared with the patient problem, conversation summary, history, and relevant context.",
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
  {
    title: "Vitals and Prior History Can Be Added",
    description: "On the doctor side, vitals, known history, and review notes can be added to enrich the final report.",
    icon: <CalendarClock className="w-6 h-6 text-primary" />,
  },
  {
    title: "Consultation Starts with Context",
    description: "Doctors spend less time on repetitive intake questions and more time on clinical decisions and care.",
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How ZeptAI Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A voice-based patient intake workflow that moves from guided conversation to doctor-ready clinical context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
          {/* Top Row */}
          {steps.slice(0, 3).map((step, index) => (
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

          {/* Middle Row - Video in Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-start-2 flex justify-center items-center"
          >
            <div className="w-full max-w-sm">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full rounded-xl border border-border"
              >
                <source src="/finalGIF.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Bottom Row */}
          {steps.slice(3, 6).map((step, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 3) * 0.1, duration: 0.5 }}
              className="glassmorphism rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 relative group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
              
              <div className="absolute top-6 right-6 text-8xl font-black text-white/5 select-none -z-10 group-hover:text-primary/10 transition-colors">
                {index + 4}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
