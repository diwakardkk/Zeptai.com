import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogList from "@/components/blog/BlogList";
import FeaturedPost from "@/components/blog/FeaturedPost";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { generateBlogListingMetadata } from "@/lib/seo/generateMetadata";

export const metadata = generateBlogListingMetadata();

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const remaining = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <BlogHero
        title="The ZeptAI Blog"
        description="Premium research-led stories on AI healthcare, product innovation, upcoming projects, and company announcements."
      />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        {featured ? <FeaturedPost post={featured} /> : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Latest Articles</h2>
          <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        </div>
        <BlogList posts={remaining} />
      </section>
      <Footer />
    </main>
  );
}
