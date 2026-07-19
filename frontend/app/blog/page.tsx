import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogList from "@/components/blog/BlogList";
import FeaturedPost from "@/components/blog/FeaturedPost";
import { getCommentCounts } from "@/lib/blog/getCommentCounts";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { generateBlogListingMetadata } from "@/lib/seo/generateMetadata";

export const metadata = generateBlogListingMetadata();

export default async function BlogPage() {
  const [posts, commentCounts] = await Promise.all([getAllPosts(), getCommentCounts()]);
  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const remaining = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[-8%] h-[20rem] w-[20rem] rounded-full bg-[#224bc3]/14 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,75,195,0.10),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(56,172,6,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.055)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22]" />
      </div>
      <Navbar />
      <BlogHero
        title="ZeptAI Journal"
        headline="Educational and technical writing across AI, healthcare, and emerging quantum research"
        description="ZeptAI publishes articles on applied AI systems, healthcare workflow design, responsible deployment, and the broader research questions shaping the company&apos;s direction. Current coverage is strongest in healthcare AI while adjacent research themes continue to expand."
        tags={["Applied AI", "Healthcare Systems", "Emerging Quantum"]}
      />

      <section className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {featured ? (
          <FeaturedPost
            commentCount={commentCounts[featured.slug] ?? 0}
            post={featured}
          />
        ) : null}
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 rounded-[30px] border border-border bg-card/85 px-6 py-6 shadow-[0_24px_70px_rgba(9,9,9,0.06)] backdrop-blur-xl md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#224bc3]">
              Latest technical notes
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Writing on AI systems, healthcare workflows, and research translation
            </h2>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#38ac06]" />
            <p>{posts.length} published posts</p>
          </div>
        </div>
        <BlogList commentCounts={commentCounts} posts={remaining} />
      </section>
      <Footer />
    </main>
  );
}
