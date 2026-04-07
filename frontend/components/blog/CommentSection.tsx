"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import CommentForm from "@/components/blog/CommentForm";
import CommentList from "@/components/blog/CommentList";

type CommentSectionProps = {
  slug: string;
};

export default function CommentSection({ slug }: CommentSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="relative mt-14 overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(130deg,hsl(var(--card)),rgba(34,75,195,0.08),rgba(56,172,6,0.1))] p-[1px] shadow-[0_24px_80px_rgba(9,9,9,0.08)]">
      <div className="relative rounded-[1.95rem] bg-card/95 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-[#224bc3]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#38ac06]/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/15 bg-card/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#224bc3]">
            <MessageSquareText className="h-3.5 w-3.5 text-[#38ac06]" />
            Community Thread
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Join the ZeptAI Discussion
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ask a question, share your perspective, or add practical feedback. We review every
            contribution to keep conversations useful and high quality.
          </p>
        </div>

        <div className="relative mt-7">
          <CommentForm postSlug={slug} onSubmitted={() => setRefreshKey((prev) => prev + 1)} />
        </div>

        <div className="relative mt-10">
          <CommentList postSlug={slug} refreshKey={refreshKey} />
        </div>
      </div>
    </section>
  );
}
