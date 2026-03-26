import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Clinical Intake Assistant | ZeptAI",
  description: "AI-powered virtual nurse assistant to automate patient intake and reduce doctor workload. SCIE Q1 Research Backed Platform.",
  openGraph: {
    title: "AI Clinical Intake Assistant | ZeptAI",
    description: "AI-powered virtual nurse assistant to automate patient intake and reduce doctor workload. SCIE Q1 Research Backed Platform.",
    url: "https://www.zeptai.com",
    siteName: "ZeptAI",
    images: [
      {
        url: "https://www.zeptai.com/og-image.jpg",
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
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
