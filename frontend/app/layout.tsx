import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import "../styles/blog.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Research-Driven Healthcare AI for Clinical Intake | ZeptAI",
  description:
    "ZeptAI builds human-like voice AI for patient intake, screening, structured clinical summaries, browser access, and enterprise healthcare API integration.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Research-Driven Healthcare AI for Clinical Intake | ZeptAI",
    description:
      "ZeptAI builds human-like voice AI for patient intake, screening, structured clinical summaries, browser access, and enterprise healthcare API integration.",
    url: "https://www.zeptai.com",
    siteName: "ZeptAI",
    images: [
      {
        url: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
