"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Command } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Command className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tighter">ZeptAI</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">How It Works</Link>
            <Link href="#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Features</Link>
            <Link href="#technology" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Technology</Link>
            <Link href="#research" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Research</Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="#demo"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Live Demo
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-b border-border"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">How It Works</Link>
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">Features</Link>
            <Link href="#demo" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">Live Demo</Link>
            <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-muted">Contact Us</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
