"use client";

import { useEffect, useState } from "react";
import { BlogComment } from "@/types/comment";

type CommentListProps = {
  postSlug: string;
  refreshKey?: number;
};

export default function CommentList({ postSlug, refreshKey = 0 }: CommentListProps) {
  const [items, setItems] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`, { cache: "no-store" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data?.error ?? "Could not load comments.");
          return;
        }
        setItems(Array.isArray(data.comments) ? data.comments : []);
      } catch {
        if (mounted) setError("Could not load comments.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadComments();
    return () => {
      mounted = false;
    };
  }, [postSlug, refreshKey]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading comments...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (items.length === 0) return <p className="text-sm text-muted-foreground">No comments yet. Be the first.</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{item.comment}</p>
        </article>
      ))}
    </div>
  );
}

