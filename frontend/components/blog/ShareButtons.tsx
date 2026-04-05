"use client";

import { useMemo, useState } from "react";
import { Copy, Link as LinkIcon, Mail, MessageCircle, Send, Share2, Globe } from "lucide-react";

type ShareButtonsProps = {
  title: string;
  url: string;
};

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encoded = useMemo(
    () => ({
      title: encodeURIComponent(title),
      url: encodeURIComponent(url),
    }),
    [title, url],
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function openExternalShare(href: string) {
    if (typeof window === "undefined") return;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const items = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`, icon: Share2 },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`, icon: Send },
    { label: "WhatsApp", href: `https://wa.me/?text=${encoded.title}%20${encoded.url}`, icon: MessageCircle },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`, icon: Globe },
    { label: "Email", href: `mailto:?subject=${encoded.title}&body=${encoded.url}`, icon: Mail },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background/90 p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share Article</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.label === "WhatsApp") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => openExternalShare(item.href)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-muted"
                aria-label={`Share on ${item.label}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-muted"
              aria-label={`Share on ${item.label}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </a>
          );
        })}
      </div>

      <button
        onClick={copyLink}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        type="button"
      >
        {copied ? <LinkIcon className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Link Copied" : "Copy Link"}
      </button>
    </div>
  );
}
