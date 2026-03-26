"use client";

import { motion } from "framer-motion";
import { Cpu, Server, Database, Code2 } from "lucide-react";

export default function Technology() {
  return (
    <section id="technology" className="py-24 bg-background border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built on State-of-the-Art Architecture</h2>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              ZeptAI leverages industry-leading infrastructure to guarantee speed, security, and medical-grade reliability.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: "Large Language Models", desc: "Advanced LLMs tailored for conversational empathy and medical reasoning.", icon: <Cpu className="w-5 h-5 text-primary" /> },
                { title: "LangChain Orchestration", desc: "Dynamic prompt management and memory retention across multi-turn clinical interviews.", icon: <Code2 className="w-5 h-5 text-blue-500" /> },
                { title: "FastAPI Backend", desc: "High-performance, asynchronous Python backend for real-time inference routing.", icon: <Server className="w-5 h-5 text-green-500" /> },
                { title: "Firebase Infrastructure", desc: "Secure, real-time database syncing, user authentication, and seamless scaling.", icon: <Database className="w-5 h-5 text-yellow-500" /> },
              ].map((tech, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1 bg-muted p-2 rounded-lg shrink-0 border border-border">
                    {tech.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{tech.title}</h4>
                    <p className="text-muted-foreground">{tech.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* SVG Diagram / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] w-full flex items-center justify-center p-8 glassmorphism rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5 rounded-3xl -z-10" />
            
            <div className="grid grid-cols-2 grid-rows-3 gap-4 w-full h-full relative z-10 p-4">
              <div className="col-span-2 row-span-1 border border-primary/30 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center font-bold text-lg shadow-lg">
                Patient Interface (Next.js)
              </div>
              
              <div className="col-span-1 row-span-1 border border-border rounded-xl bg-background/80 backdrop-blur flex items-center justify-center font-bold text-blue-500 text-center p-2 shadow-lg">
                LangChain Engine<br/>(Prompt Manager)
              </div>
              <div className="col-span-1 row-span-1 border border-border rounded-xl bg-background/80 backdrop-blur flex flex-col items-center justify-center font-bold text-yellow-500 shadow-lg gap-2">
                <Database className="w-6 h-6" /> Firebase
              </div>
              
              <div className="col-span-2 row-span-1 border border-green-500/30 rounded-xl bg-background/80 backdrop-blur flex gap-4 items-center justify-center font-bold text-green-500 shadow-lg">
                <Server className="w-6 h-6" /> FastAPI Microservices
              </div>
              
              {/* Connector Lines (Abstracted with pseudo elements) */}
              <div className="absolute top-1/3 left-1/2 w-0.5 h-8 bg-border -translate-x-1/2" />
              <div className="absolute bottom-1/3 left-1/2 w-0.5 h-8 bg-border -translate-x-1/2" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
