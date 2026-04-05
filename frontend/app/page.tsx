import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import USPSection from "@/components/USPSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Research from "@/components/Research";
import AppDownload from "@/components/AppDownload";
import Team from "@/components/Team";
import ChatbotDemo from "@/components/ChatbotDemo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const latestPosts = (await getAllPosts()).slice(0, 3);
  const [featuredPost, ...secondaryPosts] = latestPosts;
  const organizationSchema = getOrganizationSchema();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <USPSection />
      <HowItWorks />
      <Features />
      <Research />
      <ChatbotDemo />
      <AppDownload />
      <section className="relative overflow-hidden border-y border-black/10 bg-background py-14 md:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-6 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]" />
          <div className="absolute right-[-10%] top-8 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[30px] border border-black/10 bg-[#fffffa]/85 p-5 shadow-[0_24px_56px_-42px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Healthcare AI Insights
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-black md:text-[2.25rem]">
                  Practical intelligence for intake workflows
                </h2>
                <p className="mt-3 text-sm text-black/65 md:text-base">
                  Practical research and product insights for patient intake and clinical workflows.
                </p>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#224bc3]/30 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#224bc3] transition hover:bg-[#224bc3]/10"
              >
                Visit the Blog
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            {featuredPost && (
              <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/92 transition hover:-translate-y-1 hover:border-[#224bc3]/35 hover:shadow-[0_20px_44px_-32px_rgba(34,75,195,0.65)]"
                >
                  <div className="relative h-52 overflow-hidden md:h-56">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      title={featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                    <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      Featured
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.13em] text-black/55">
                      <span className="rounded-full border border-[#38ac06]/25 bg-[#38ac06]/10 px-2.5 py-1 text-[#2f8f07]">
                        {featuredPost.category}
                      </span>
                      <span>{formatDate(featuredPost.date)}</span>
                      <span className="h-1 w-1 rounded-full bg-[#224bc3]/60" />
                      <span>{featuredPost.readingTimeMinutes} min read</span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-7 text-black transition group-hover:text-[#224bc3] md:text-2xl">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/65">
                      {featuredPost.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#224bc3]">
                      Read article
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {secondaryPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white/88 p-3 transition hover:-translate-y-0.5 hover:border-[#224bc3]/30"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/10">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          title={post.title}
                          fill
                          sizes="64px"
                          className="object-cover transition duration-500 group-hover:scale-[1.06]"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#224bc3]/80">
                          {post.category}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-black group-hover:text-[#224bc3]">
                          {post.title}
                        </p>
                        <p className="mt-1 text-[11px] text-black/55">{formatDate(post.date)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
