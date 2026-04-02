"use client";

import { useState } from "react";
import CommentForm from "@/components/blog/CommentForm";
import CommentList from "@/components/blog/CommentList";

type CommentSectionProps = {
  slug: string;
};

export default function CommentSection({ slug }: CommentSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="mt-14 rounded-3xl border border-border bg-background p-6 md:p-8">
      <h3 className="text-2xl font-bold tracking-tight">Comments</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Join the discussion. Your feedback helps us improve healthcare AI for real-world use.
      </p>
      <CommentForm postSlug={slug} onSubmitted={() => setRefreshKey((prev) => prev + 1)} />
      <div className="mt-8">
        <CommentList postSlug={slug} refreshKey={refreshKey} />
      </div>
    </section>
  );
}
