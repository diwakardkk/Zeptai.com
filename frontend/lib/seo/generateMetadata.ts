import type { Metadata } from "next";
import { BlogPost } from "@/types/blog";
import { companyAuthor, siteConfig } from "@/lib/seo/site";

function normalizeTitle(title: string) {
  return title.replace(/\s*\|\s*ZeptAI(?: Blog)?\s*$/i, "").trim();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: { name: string }[];
  images?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [companyAuthor],
  images = [siteConfig.ogImage],
}: PageMetadataInput): Metadata {
  const canonical = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const cleanTitle = normalizeTitle(title);

  return {
    title: cleanTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    authors,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: cleanTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      images: images.map((url) => ({ url })),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      images,
    },
  };
}

export function generateBlogListingMetadata(): Metadata {
  return buildPageMetadata({
    title: "Healthcare AI Blog",
    description:
      "Read ZeptAI articles on healthcare AI, patient intake AI, voice AI healthcare workflows, and clinical summaries AI for care teams.",
    path: "/blog",
    keywords: [
      "healthcare AI blog",
      "patient intake AI blog",
      "voice AI healthcare insights",
      "clinical summaries AI blog",
    ],
  });
}

export function generateBlogPostMetadata(post: BlogPost): Metadata {
  return buildPageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: post.keywords ?? post.tags,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt ?? post.date,
    authors: [{ name: post.author }],
    images: [post.coverImage],
  });
}
