"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8 pointer-events-none">
      <div
        className={`mx-auto max-w-7xl rounded-[30px] border overflow-hidden pointer-events-auto transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "border-white/70 bg-background/88 shadow-[0_28px_70px_-42px_rgba(20,32,72,0.42)] backdrop-blur-xl"
            : "border-white/55 bg-background/72 shadow-[0_22px_60px_-42px_rgba(20,32,72,0.22)] backdrop-blur-lg"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <BrandLogo className="h-11 w-11 rounded-full" />
            </Link>
          </div>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navigationItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#224bc3]/10 text-[#224bc3]"
                      : "text-foreground/72 hover:bg-foreground/[0.04] hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border/70 bg-background/96 px-4 pb-4 pt-1 md:hidden"
          >
            <div className="space-y-1.5">
              {navigationItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#224bc3]/10 text-[#224bc3]"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
