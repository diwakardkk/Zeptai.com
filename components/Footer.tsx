import Link from "next/link";
import { Command } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Command className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tighter">ZeptAI</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your AI-Powered Clinical Intake Assistant. Automating patient summaries and streamlining triage for modern healthcare facilities.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-4">
              <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Live Demo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-4">
              <li><Link href="#team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Team</Link></li>
              <li><Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZeptAI. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            SCIE Q1 Research Backed
          </div>
        </div>
      </div>
    </footer>
  );
}
