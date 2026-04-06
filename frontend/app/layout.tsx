import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "../styles/blog.css";
import { sora } from "@/lib/fonts";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ZeptAI",
    template: "%s | ZeptAI",
  },
  description: "Healthcare AI for patient intake and structured summaries",
  keywords: [...siteConfig.keywords],
  applicationName: "ZeptAI",
  authors: [{ name: "ZeptAI Team" }],
  creator: "ZeptAI",
  publisher: "ZeptAI",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "ZeptAI healthcare AI platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${sora.className} bg-background text-foreground antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function () {
            try {
              var stored = localStorage.getItem("theme");
              var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
              var root = document.documentElement;
              if (theme === "dark") root.classList.add("dark");
              else root.classList.remove("dark");
              root.setAttribute("data-theme", theme);
            } catch (e) {}
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
