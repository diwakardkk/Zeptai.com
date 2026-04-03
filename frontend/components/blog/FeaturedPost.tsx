import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MessageSquareText } from "lucide-react";
import { BlogPost } from "@/types/blog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type FeaturedPostProps = {
  commentCount: number;
  post: BlogPost;
};

export default function FeaturedPost({ commentCount, post }: FeaturedPostProps) {
  return (
    <article className="mt-8 overflow-hidden rounded-[34px] border border-[#090909]/8 bg-white/82 shadow-[0_28px_90px_rgba(9,9,9,0.08)] backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="order-2 p-7 lg:order-1 lg:p-10 xl:p-12">
          <span className="inline-block rounded-full border border-[#224bc3]/14 bg-[#224bc3]/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#224bc3]">
            Featured Story
          </span>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#090909] md:text-5xl">
            {post.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#090909]/68 md:text-lg">
            {post.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#090909]/58">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {post.readingTimeMinutes} min read
            </span>
            <span className="rounded-full border border-[#38ac06]/20 bg-[#38ac06]/7 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#38ac06]">
              {post.category}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#090909]/72">
            <div className="rounded-full border border-[#090909]/8 bg-[#fffffa] px-4 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#090909]/45">
                Author
              </span>
              <p className="mt-1 font-medium text-[#090909]">{post.author}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/14 bg-[#224bc3]/6 px-4 py-2 text-[#224bc3]">
              <MessageSquareText className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                {commentCount} comments
              </span>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#090909] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#224bc3]"
          >
            Read Featured Article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="order-1 p-2 lg:order-2">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1600}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-72 w-full rounded-[28px] object-cover lg:h-full"
          />
        </div>
      </div>
    </article>
  );
}
