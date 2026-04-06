import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 flex items-center">
              <BrandLogo className="h-10 w-auto rounded-full" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Research-driven healthcare AI for voice-based patient intake, structured screening, web-based patient access, and enterprise API integration.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Pages</h2>
            <ul className="space-y-4">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Resources</h2>
            <ul className="space-y-4">
              <li><Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Research</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZeptAI. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            Healthcare AI Research and Enterprise AI Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
