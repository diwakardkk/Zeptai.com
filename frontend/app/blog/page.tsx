import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogList from "@/components/blog/BlogList";
import FeaturedPost from "@/components/blog/FeaturedPost";
import { getCommentCounts } from "@/lib/blog/getCommentCounts";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { inter } from "@/lib/fonts";
import { generateBlogListingMetadata } from "@/lib/seo/generateMetadata";

export const metadata = generateBlogListingMetadata();

export default async function BlogPage() {
  const [posts, commentCounts] = await Promise.all([getAllPosts(), getCommentCounts()]);
  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const remaining = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className={`${inter.className} relative min-h-screen overflow-hidden bg-[#fffffa] text-[#090909]`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(56,172,6,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(34,75,195,0.14),transparent_36%),linear-gradient(180deg,rgba(255,255,250,0.96),rgba(255,255,250,0.78),rgba(255,255,250,1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(9,9,9,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(9,9,9,0.03)_1px,transparent_1px)] bg-[size:68px_68px] opacity-35 [mask-image:radial-gradient(circle_at_top,black,transparent_78%)]" />
        <div className="absolute left-[8%] top-36 h-48 w-48 rounded-full bg-[#38ac06]/10 blur-3xl" />
        <div className="absolute right-[10%] top-24 h-56 w-56 rounded-full bg-[#224bc3]/10 blur-3xl" />
      </div>
      <Navbar />
      <BlogHero
        title="Healthcare AI, Patient Intake AI, and Clinical Summary Insights"
        description="Research-backed articles on voice AI healthcare workflows, clinical screening, structured summaries, and the operational side of modern patient intake."
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
        <div className="mb-10 flex flex-col gap-4 rounded-[30px] border border-[#090909]/8 bg-white/70 px-6 py-6 shadow-[0_24px_70px_rgba(9,9,9,0.06)] backdrop-blur-xl md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#224bc3]">
              Latest from ZeptAI Publication
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#090909] md:text-3xl">
              Premium articles on healthcare AI systems, deployment, and clinical workflows
            </h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#090909]/62">
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
