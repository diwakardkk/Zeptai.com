"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";

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
            <Link href="/" className="flex items-center">
              <BrandLogo />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">About</Link>
            <Link href="/pricing" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Blog</Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Features</Link>
            <Link href="/#research" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Research</Link>
          </nav>
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Explore API
            </Link>
            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground focus:outline-none mr-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <ThemeToggle />
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
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">Home</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">About</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">Pricing</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">Blog</Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">How It Works</Link>
            <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted">Features</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-muted">Explore API</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
