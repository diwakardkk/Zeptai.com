"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Command } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse w-max"></span>
            Healthcare AI Research + Enterprise API
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground mb-6">
            Voice AI for Patient Intake <br className="hidden sm:block" /> and <span className="text-primary">Clinical Summaries</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
            ZeptAI helps clinics, hospitals, and telemedicine platforms collect symptoms, history, and pre-consultation context through human-like voice conversations, then turn that intake into doctor-ready summaries patients can share before the visit starts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Request Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#access"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-muted text-foreground font-bold hover:bg-muted/80 transition-all border border-border"
            >
              Explore API
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-muted text-foreground font-bold hover:bg-muted/80 transition-all border border-border"
            >
              <PlayCircle className="w-5 h-5" /> Try in Browser
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 mx-auto max-w-4xl relative"
        >
          <div className="glassmorphism rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-gradient-to-b from-white/5 to-transparent">
            <div className="bg-background rounded-xl overflow-hidden border border-border">
              <div className="h-8 bg-muted flex items-center px-4 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="p-8 sm:p-12 text-left">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Command className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-sm text-sm sm:text-base">
                    Hello, I&apos;m ZeptAI. I&apos;ll complete your intake conversation before the doctor joins. What symptoms are you facing today?
                  </div>
                </div>
                <div className="flex gap-4 justify-end mb-6">
                  <div className="bg-primary/20 text-foreground p-4 rounded-2xl rounded-tr-sm text-sm sm:text-base border border-primary/30 max-w-md">
                    I&apos;ve had fever and cough for three days, with mild chest discomfort. I also have a history of asthma and used my inhaler last night.
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <span className="text-sm font-medium">U</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
