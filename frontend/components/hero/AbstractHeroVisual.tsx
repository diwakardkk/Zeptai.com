"use client";

import { motion } from "framer-motion";

export default function AbstractHeroVisual() {
  return (
    <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-white/[0.01] dark:from-white/[0.02] dark:to-transparent rounded-[38px] border border-border/40 p-4 shadow-[0_20px_50px_rgba(20,32,72,0.06)] overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#224bc3]/[0.06] dark:bg-[#224bc3]/[0.08] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-48 h-48 rounded-full bg-[#38ac06]/[0.05] dark:bg-[#38ac06]/[0.07] blur-[90px] pointer-events-none" />

      <svg
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[480px] sm:max-w-none text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
      >
        {/* ================= BACKGROUND STREAMS ================= */}
        {/* Flowing dotted connection from Neural Net to Health Data */}
        <motion.path
          d="M 230 100 Q 280 100 240 200"
          stroke="url(#blue-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -20 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
        />

        {/* Flowing dotted connection from Health Data to Quantum Circuit */}
        <motion.path
          d="M 290 240 Q 330 240 330 300"
          stroke="url(#green-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -20 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
        />

        {/* ================= 1. NEURAL NETWORK (Top Left) ================= */}
        <g id="neural-network">
          {/* Connections */}
          <line x1="60" y1="100" x2="110" y2="70" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="60" y1="100" x2="110" y2="130" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="110" y1="70" x2="170" y2="60" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="110" y1="70" x2="170" y2="100" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="110" y1="130" x2="170" y2="100" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="110" y1="130" x2="170" y2="140" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="170" y1="60" x2="230" y2="100" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />
          <line x1="170" y1="100" x2="230" y2="100" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />
          <line x1="170" y1="140" x2="230" y2="100" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />

          {/* Pulsing connection highlights */}
          <motion.path
            d="M 60 100 L 110 70 L 170 100 L 230 100"
            stroke="url(#blue-gradient)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            strokeDasharray="12 100"
            initial={{ strokeDashoffset: 112 }}
            animate={{ strokeDashoffset: -112 }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          {/* Nodes */}
          {/* Layer 1 */}
          <circle cx="60" cy="100" r="5" className="fill-background stroke-muted-foreground/45" strokeWidth="1.5" />
          
          {/* Layer 2 */}
          <circle cx="110" cy="70" r="5" className="fill-background stroke-muted-foreground/45" strokeWidth="1.5" />
          <circle cx="110" cy="130" r="5" className="fill-background stroke-muted-foreground/45" strokeWidth="1.5" />
          
          {/* Layer 3 */}
          <circle cx="170" cy="60" r="5" className="fill-background stroke-muted-foreground/45" strokeWidth="1.5" />
          <motion.circle
            cx="170"
            cy="100"
            r="6"
            className="fill-background stroke-[#224bc3]"
            strokeWidth="2"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
          <circle cx="170" cy="140" r="5" className="fill-background stroke-muted-foreground/45" strokeWidth="1.5" />

          {/* Output Node */}
          <motion.circle
            cx="230"
            cy="100"
            r="7"
            className="fill-background stroke-[#224bc3]"
            strokeWidth="2.5"
            animate={{ r: [6.5, 8.5, 6.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </g>

        {/* ================= 2. STRUCTURED HEALTH DATA (Center) ================= */}
        <g id="structured-health-data">
          {/* Data Grid Background */}
          <rect x="140" y="180" width="160" height="100" rx="16" className="fill-[#224bc3]/[0.02] dark:fill-[#224bc3]/[0.01] stroke-border/40" strokeWidth="1" />
          
          {/* Grid lines */}
          <line x1="140" y1="205" x2="300" y2="205" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="140" y1="230" x2="300" y2="230" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="140" y1="255" x2="300" y2="255" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="180" y1="180" x2="180" y2="280" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="220" y1="180" x2="220" y2="280" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="260" y1="180" x2="260" y2="280" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />

          {/* Structured Data Columns */}
          <rect x="155" y="195" width="10" height="15" rx="2" className="fill-[#224bc3]/15 stroke-[#224bc3]/30" strokeWidth="0.8" />
          <rect x="195" y="190" width="10" height="25" rx="2" className="fill-[#224bc3]/20 stroke-[#224bc3]/40" strokeWidth="0.8" />
          <rect x="235" y="198" width="10" height="10" rx="2" className="fill-[#224bc3]/15 stroke-[#224bc3]/30" strokeWidth="0.8" />
          
          {/* Clean ECG / Heart trace wave (Visualizing Health) */}
          <motion.path
            d="M 148 242 L 188 242 L 194 235 L 198 252 L 204 220 L 210 248 L 214 240 L 218 242 L 292 242"
            stroke="url(#ecg-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}
          />

          {/* Pulsing indicator on EKG line */}
          <motion.circle
            cx="204"
            cy="220"
            r="4"
            fill="#38ac06"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          />
        </g>

        {/* ================= 3. MINIMAL QUANTUM CIRCUIT (Bottom Right) ================= */}
        <g id="quantum-circuit">
          {/* Qubit Wires */}
          <line x1="280" y1="320" x2="480" y2="320" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />
          <line x1="280" y1="350" x2="480" y2="350" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />
          <line x1="280" y1="380" x2="480" y2="380" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />

          {/* Qubit labels */}
          <text x="260" y="324" fill="currentColor" fillOpacity="0.6" className="text-[10px] font-mono font-semibold">q[0]</text>
          <text x="260" y="354" fill="currentColor" fillOpacity="0.6" className="text-[10px] font-mono font-semibold">q[1]</text>
          <text x="260" y="384" fill="currentColor" fillOpacity="0.6" className="text-[10px] font-mono font-semibold">q[2]</text>

          {/* Gate 1: Hadamard Gate H on q[0] */}
          <rect x="310" y="308" width="24" height="24" rx="6" className="fill-background stroke-[#224bc3]" strokeWidth="1.8" />
          <text x="322" y="324" textAnchor="middle" fill="#224bc3" className="text-[11px] font-mono font-bold">H</text>

          {/* Gate 2: Rz(θ) Gate on q[2] */}
          <rect x="345" y="368" width="36" height="24" rx="6" className="fill-background stroke-border/90" strokeWidth="1.5" />
          <text x="363" y="383" textAnchor="middle" fill="currentColor" fillOpacity="0.75" className="text-[9px] font-mono font-semibold">Rz</text>

          {/* Control-Not (CNOT) connection between q[0] and q[1] */}
          {/* Connection line */}
          <line x1="410" y1="320" x2="410" y2="350" stroke="#38ac06" strokeWidth="1.5" />
          {/* Control point on q[0] */}
          <circle cx="410" cy="320" r="3.5" className="fill-[#38ac06]" />
          {/* Target point (plus circle) on q[1] */}
          <circle cx="410" cy="350" r="7" className="fill-background stroke-[#38ac06]" strokeWidth="1.5" />
          <line x1="406" y1="350" x2="414" y2="350" stroke="#38ac06" strokeWidth="1.2" />
          <line x1="410" y1="346" x2="410" y2="354" stroke="#38ac06" strokeWidth="1.2" />

          {/* Gate 4: Hadamard Gate H on q[1] */}
          <rect x="440" y="338" width="24" height="24" rx="6" className="fill-background stroke-[#38ac06]" strokeWidth="1.8" />
          <text x="452" y="354" textAnchor="middle" fill="#2f8f07" className="text-[11px] font-mono font-bold">H</text>
        </g>

        {/* ================= DEFINITIONS & GRADIENTS ================= */}
        <defs>
          <linearGradient id="blue-gradient" x1="60" y1="100" x2="230" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#224bc3" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#224bc3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#224bc3" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="green-gradient" x1="290" y1="240" x2="330" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38ac06" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#38ac06" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="ecg-gradient" x1="148" y1="242" x2="292" y2="242" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#224bc3" />
            <stop offset="60%" stopColor="#224bc3" />
            <stop offset="85%" stopColor="#38ac06" />
            <stop offset="100%" stopColor="#38ac06" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
