import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
