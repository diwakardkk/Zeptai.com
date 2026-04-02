import fs from "node:fs";
import { BlogPost } from "@/types/blog";
import { getBlogContentDir, parsePostFile } from "@/lib/blog/_shared";

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs
    .readdirSync(getBlogContentDir())
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  const posts = await Promise.all(files.map((file) => parsePostFile(file)));
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

