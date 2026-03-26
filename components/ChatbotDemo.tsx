"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Terminal, Database } from "lucide-react";
import NurseChat from "./NurseChat";

export default function ChatbotDemo() {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const onListeningState = (event: Event) => {
      const custom = event as CustomEvent<{ listening?: boolean }>;
      setIsListening(Boolean(custom.detail?.listening));
    };

    window.addEventListener("nursechat-listening-state", onListeningState);

    return () => {
      window.removeEventListener("nursechat-listening-state", onListeningState);
    };
  }, []);

  function toggleSpeaking() {
    window.dispatchEvent(new Event("nursechat-toggle-listening"));
  }

  return (
    <section id="demo" className="py-24 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block"
            >
              Live Demo
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Auditory AI Chatbot</h2>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Experience the future of clinical intake firsthand. Speak to our interactive voice AI below and observe how it processes your symptoms in real-time.
            </p>

            <div className="space-y-4 text-muted-foreground text-sm">
              <p className="flex items-center gap-2 bg-muted p-3 border border-border rounded-xl">
                <Database className="w-4 h-4 text-primary" /> Conversations are securely temporarily stored in Firebase.
              </p>
              <p className="flex items-center gap-2 bg-muted p-3 border border-border rounded-xl">
                <Terminal className="w-4 h-4 text-primary" /> Replace the placeholder UI with your GitHub React code.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glassmorphism rounded-3xl p-2 relative shadow-2xl overflow-hidden min-h-[500px] flex flex-col"
            >
              <div className="bg-muted px-6 py-4 border-b border-border rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold text-foreground">ZeptAI Virtual Nurse</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">Status: Connected</div>
              </div>

              <div className="flex-1 bg-background rounded-2xl border border-border overflow-hidden">
                <NurseChat />
              </div>

              <div className="bg-muted p-4 border-t border-border rounded-b-2xl flex justify-center">
                <button
                  onClick={toggleSpeaking}
                  className={`font-bold py-3 px-8 rounded-full border transition-colors flex items-center gap-2 ${
                    isListening
                      ? "bg-primary text-white border-primary hover:bg-primary/90"
                      : "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                  }`}
                >
                  <Mic className="w-5 h-5" /> {isListening ? "Stop Speaking" : "Start Speaking"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
