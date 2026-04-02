import type { Metadata } from "next";
import { BlogPost } from "@/types/blog";

export function generateBlogListingMetadata(): Metadata {
  return {
    title: "ZeptAI Blog | Healthcare AI Insights, Research & Product Updates",
    description:
      "Read ZeptAI blog posts on AI healthcare innovation, research-backed product updates, and hospital workflow transformation.",
    alternates: { canonical: "https://www.zeptai.com/blog" },
    openGraph: {
      title: "ZeptAI Blog",
      description:
        "Healthcare AI insights, product updates, and research-led thought leadership from ZeptAI.",
      url: "https://www.zeptai.com/blog",
      siteName: "ZeptAI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ZeptAI Blog",
      description: "Healthcare AI insights, product updates, and research-led thought leadership from ZeptAI.",
    },
  };
}

export function generateBlogPostMetadata(post: BlogPost): Metadata {
  const canonical = `https://www.zeptai.com/blog/${post.slug}`;
  return {
    title: post.seoTitle ?? `${post.title} | ZeptAI Blog`,
    description: post.seoDescription ?? post.excerpt,
    keywords: post.keywords ?? post.tags,
    alternates: { canonical },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url: canonical,
      type: "article",
      siteName: "ZeptAI",
      publishedTime: post.date,
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      images: [post.coverImage],
    },
  };
}

