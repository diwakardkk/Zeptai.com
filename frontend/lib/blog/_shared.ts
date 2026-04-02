import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { BlogFrontmatter } from "@/types/blog";
import { getReadingTime } from "@/lib/blog/getReadingTime";
import { getTableOfContents } from "@/lib/blog/getTableOfContents";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function isBlogFrontmatter(data: unknown): data is BlogFrontmatter {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return (
    typeof record.title === "string" &&
    typeof record.slug === "string" &&
    typeof record.excerpt === "string" &&
    typeof record.date === "string" &&
    typeof record.author === "string" &&
    typeof record.category === "string" &&
    Array.isArray(record.tags) &&
    typeof record.coverImage === "string"
  );
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "append" })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

export async function parsePostFile(filename: string) {
  const fullPath = path.join(BLOG_CONTENT_DIR, filename);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  if (!isBlogFrontmatter(data)) {
    throw new Error(`Invalid frontmatter in ${filename}`);
  }

  const html = await markdownToHtml(content);
  return {
    ...data,
    content,
    html,
    readingTimeMinutes: getReadingTime(content),
    tableOfContents: getTableOfContents(content),
  };
}

export function getBlogContentDir() {
  return BLOG_CONTENT_DIR;
}

