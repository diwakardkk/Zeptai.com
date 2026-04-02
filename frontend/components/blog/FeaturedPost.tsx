import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { BlogPost } from "@/types/blog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type FeaturedPostProps = {
  post: BlogPost;
};

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="mt-12 overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-2 p-7 lg:order-1 lg:p-10">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Featured Story
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight md:text-4xl">{post.title}</h2>
          <p className="mt-4 text-muted-foreground">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {post.readingTimeMinutes} min read
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs">{post.category}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Read Featured Article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="order-1 lg:order-2">
          <img src={post.coverImage} alt={post.title} className="h-72 w-full object-cover lg:h-full" />
        </div>
      </div>
    </article>
  );
}

