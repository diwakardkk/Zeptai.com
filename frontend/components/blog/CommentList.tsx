"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { BlogComment } from "@/types/comment";

type CommentListProps = {
  postSlug: string;
  refreshKey?: number;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatCommentDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-border bg-[linear-gradient(140deg,hsl(var(--card)),rgba(34,75,195,0.05),rgba(56,172,6,0.05))] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#224bc3]/15" />
              <div className="space-y-2">
                <div className="h-3.5 w-28 rounded bg-foreground/10" />
                <div className="h-3 w-20 rounded bg-foreground/10" />
              </div>
            </div>
            <div className="mt-4 h-3.5 w-full rounded bg-foreground/10" />
            <div className="mt-2 h-3.5 w-5/6 rounded bg-foreground/10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#224bc3]/25 bg-[#224bc3]/10 px-4 py-3 text-sm font-medium text-[#11214f] dark:text-[#98b7ff]">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/80 px-5 py-6 text-sm font-medium text-muted-foreground">
        No comments yet. Be the first to share your thoughts.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-[#224bc3]/15 bg-card/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#224bc3]">
        <MessageSquareText className="h-3.5 w-3.5 text-[#38ac06]" />
        Published Comments
      </div>
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, delay: index * 0.04 }}
          className="group rounded-3xl border border-border bg-[linear-gradient(150deg,hsl(var(--card)),rgba(34,75,195,0.08),rgba(56,172,6,0.06))] p-5 shadow-[0_14px_38px_rgba(9,9,9,0.06)] transition hover:-translate-y-0.5 hover:border-[#224bc3]/20 hover:shadow-[0_18px_44px_rgba(9,9,9,0.1)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#224bc3]/25 bg-[linear-gradient(145deg,rgba(34,75,195,0.18),rgba(56,172,6,0.16))] text-xs font-semibold tracking-wide text-[#11214f] dark:text-[#c7d7ff]">
                {getInitials(item.name)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{formatCommentDate(item.createdAt)}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/85">{item.comment}</p>
        </motion.article>
      ))}
    </div>
  );
}
