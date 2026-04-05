import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import USPSection from "@/components/USPSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Technology from "@/components/Technology";
import Research from "@/components/Research";
import AppDownload from "@/components/AppDownload";
import Team from "@/components/Team";
import ChatbotDemo from "@/components/ChatbotDemo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { buildPageMetadata } from "@/lib/seo/generateMetadata";
import { getOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Simplify Patient Intake with Healthcare AI",
  description:
    "ZeptAI uses voice AI for patient intake to capture symptoms and history, generating structured summaries that save doctors time and improve communication.",
  path: "/",
  keywords: [
    "healthcare AI for patient intake",
    "voice AI patient intake",
    "clinical summary automation",
    "symptom intake software",
  ],
});

export default async function Home() {
  const latestPosts = (await getAllPosts()).slice(0, 3);
  const organizationSchema = getOrganizationSchema();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <USPSection />
      <HowItWorks />
      <Features />
      <Technology />
      <Research />
      <ChatbotDemo />
      <AppDownload />
      <section className="border-y border-border bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Healthcare AI Insights
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                Learn how patient intake AI and clinical summaries AI fit real care workflows
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore practical articles on voice AI healthcare use cases, clinical screening, and
                ways care teams can reduce documentation overhead without sacrificing context.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Visit the Blog
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
      <Team />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Footer />
    </main>
  );
}
