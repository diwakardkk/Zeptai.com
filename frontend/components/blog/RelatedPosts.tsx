import Link from "next/link";
import { BlogPost } from "@/types/blog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type RelatedPostsProps = {
  posts: BlogPost[];
};

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {posts.map((entry) => (
        <article key={entry.slug} className="overflow-hidden rounded-2xl border border-border bg-card/70">
          <img src={entry.coverImage} alt={entry.title} className="h-44 w-full object-cover" />
          <div className="p-4">
            <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
            <h3 className="mt-2 font-bold leading-snug">{entry.title}</h3>
            <Link href={`/blog/${entry.slug}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:text-primary/80">
              Read article
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

