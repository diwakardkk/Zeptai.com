import fs from "node:fs";
import { BlogPost } from "@/types/blog";
import { getBlogContentDir, parsePostFile } from "@/lib/blog/_shared";

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs
    .readdirSync(getBlogContentDir())
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  const posts = await Promise.all(files.map((file) => parsePostFile(file)));
  const sortedPosts = posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const seenSlugs = new Set<string>();
  const uniquePosts: BlogPost[] = [];

  for (const post of sortedPosts) {
    const normalizedSlug = post.slug.trim().toLowerCase();
    if (seenSlugs.has(normalizedSlug)) {
      console.warn(`[blog] Duplicate slug "${post.slug}" skipped in getAllPosts().`);
      continue;
    }
    seenSlugs.add(normalizedSlug);
    uniquePosts.push(post);
  }

  return uniquePosts;
}
