import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ArticleAudioReader from "@/components/blog/ArticleAudioReader";
import Footer from "@/components/Footer";
import ArticleContent from "@/components/blog/ArticleContent";
import BlogSidebar from "@/components/blog/BlogSidebar";
import CommentSection from "@/components/blog/CommentSection";
import ReadingProgress from "@/components/blog/ReadingProgress";
import RelatedPosts from "@/components/blog/RelatedPosts";
import TableOfContents from "@/components/blog/TableOfContents";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { getPostBySlug } from "@/lib/blog/getPostBySlug";
import { getRelatedPosts } from "@/lib/blog/getRelatedPosts";
import { getArticleListenTime } from "@/lib/audio/articleNarration";
import { generateBlogPostMetadata } from "@/lib/seo/generateMetadata";
import { getBlogPostingSchema } from "@/lib/seo/schema";

type Props = {
  params: { slug: string };
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post was not found.",
    };
  }
  return generateBlogPostMetadata(post);
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const headings = post.tableOfContents.map((item) => ({ ...item, id: headingId(item.text) }));
  const related = await getRelatedPosts(post.slug, 3);
  const url = `https://zeptai.com/blog/${post.slug}`;
  const articleSchema = getBlogPostingSchema(post);
  const estimatedListenMinutes = getArticleListenTime(post.title, post.content);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[-8%] h-[20rem] w-[20rem] rounded-full bg-[#224bc3]/14 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-[#38ac06]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,75,195,0.10),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(56,172,6,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,75,195,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,75,195,0.055)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.22]" />
      </div>
      <ReadingProgress />
      <Navbar />

      <article className="pt-32 pb-6 md:pt-36 md:pb-8 lg:pb-10">
        <header className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card/85 p-6 md:p-10 shadow-[0_24px_70px_rgba(9,9,9,0.06)] backdrop-blur-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-white/78 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3] shadow-[0_18px_40px_-30px_rgba(34,75,195,0.5)] backdrop-blur-sm">
              {post.category}
            </p>
            <h1
              data-blog-article-title
              className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"
            >
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>By {post.author}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {post.readingTimeMinutes} min read
              </span>
            </div>
            <ArticleAudioReader
              estimatedListenMinutes={estimatedListenMinutes}
              slug={post.slug}
              title={post.title}
            />
          </div>
        </header>

        <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            title={post.title}
            width={1600}
            height={900}
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="h-[280px] w-full rounded-3xl border border-border object-cover md:h-[440px]"
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[220px_1fr_240px] lg:px-8">
          <aside className="hidden lg:block">
            <TableOfContents items={headings} />
          </aside>

          <div>
            <ArticleContent html={post.html} />

            {post.videoUrl ? (
              <div className="mt-10 rounded-2xl border border-border bg-card/60 p-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Video</p>
                <a
                  href={post.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-primary underline-offset-4 hover:underline"
                >
                  Watch on external platform
                </a>
              </div>
            ) : null}

            <CommentSection slug={post.slug} />
          </div>

          <aside>
            <BlogSidebar post={post} url={url} />
          </aside>
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Related Posts</h2>
          <Link href="/blog" className="text-sm font-semibold text-primary hover:text-primary/80">
            Back to Blog
          </Link>
        </div>
        <RelatedPosts posts={related} />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <Footer />
    </main>
  );
}
