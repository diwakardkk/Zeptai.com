import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center">
              <BrandLogo className="h-11 w-11 rounded-full" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Research-led technology company building practical AI systems for healthcare while developing credible research capability in quantum computing.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Pages</h2>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Research</Link></li>
              <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Resources</h2>
            <ul className="space-y-3">
              <li><Link href="/research/publications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Publications</Link></li>
              <li><Link href="/research/quantum-computing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quantum Computing</Link></li>
              <li><Link href="/projects/conversational-health-ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Conversational Health AI</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZEPTA FOCUSAI TECHNOLOGY PRIVATE LIMITED. All rights reserved.
          </p>
          <div className="text-xs sm:text-sm text-muted-foreground">
            AI, healthcare innovation, and quantum research
          </div>
        </div>
      </div>
    </footer>
  );
}
