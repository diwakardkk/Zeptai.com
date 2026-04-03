import type { Metadata } from "next";
import "./globals.css";
import "../styles/blog.css";
import { sora } from "@/lib/fonts";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: "%s | ZeptAI",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: "ZeptAI",
  authors: [{ name: "ZeptAI Team" }],
  creator: "ZeptAI",
  publisher: "ZeptAI",
  icons: {
    icon: "/favicon.ico",
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
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
