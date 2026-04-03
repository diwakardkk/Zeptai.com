import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { BlogPost } from "@/types/blog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type BlogCardProps = {
  commentCount?: number;
  post: BlogPost;
};

export default function BlogCard({ commentCount = 0, post }: BlogCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[30px] border border-[#090909]/8 bg-[#fffffa]/92 shadow-[0_18px_60px_rgba(9,9,9,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(9,9,9,0.1)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,rgba(56,172,6,0),rgba(56,172,6,0.9),rgba(34,75,195,0.85),rgba(34,75,195,0))] opacity-70 transition group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-16 top-16 h-36 w-36 rounded-full bg-[#224bc3]/8 blur-3xl transition group-hover:bg-[#224bc3]/12" />
      <div className="pointer-events-none absolute -left-12 bottom-10 h-28 w-28 rounded-full bg-[#38ac06]/8 blur-3xl transition group-hover:bg-[#38ac06]/12" />

      <div className="overflow-hidden rounded-[26px] p-2">
        <div className="overflow-hidden rounded-[24px]">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={720}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="flex h-[calc(100%-15rem)] flex-col px-6 pb-6 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#090909]/55">
          <span className="rounded-full border border-[#38ac06]/20 bg-[#38ac06]/8 px-3 py-1 text-[#38ac06]">
            {post.category}
          </span>
          <span>{formatDate(post.date)}</span>
          <span className="h-1 w-1 rounded-full bg-[#224bc3]/60" />
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <h3 className="mt-5 text-[1.4rem] font-semibold leading-[1.2] tracking-[-0.03em] text-[#090909] transition group-hover:text-[#224bc3]">
          <Link href={`/blog/${post.slug}`} className="focus:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[#090909]/66">
          {post.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#090909]/8 bg-white/80 px-2.5 py-1 text-xs font-medium text-[#090909]/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#224bc3] transition hover:gap-3 hover:text-[#224bc3]/84"
        >
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between rounded-[20px] border border-[#090909]/8 bg-[linear-gradient(135deg,rgba(255,255,250,1),rgba(34,75,195,0.04),rgba(56,172,6,0.05))] px-4 py-3 text-sm text-[#090909]/72">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#090909]/42">
                Author
              </p>
              <p className="mt-1 truncate font-medium text-[#090909]">{post.author}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#224bc3]/12 bg-white/75 px-3 py-2 text-[#224bc3]">
              <MessageSquareText className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                {commentCount} comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
