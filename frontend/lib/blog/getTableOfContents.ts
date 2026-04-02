import { TableOfContentItem } from "@/types/blog";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getTableOfContents(markdown: string): TableOfContentItem[] {
  const lines = markdown.split(/\r?\n/);
  const headings: TableOfContentItem[] = [];

  for (const line of lines) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const marker = match[1];
    const text = match[2].trim();
    headings.push({
      id: slugify(text),
      text,
      level: marker === "##" ? 2 : 3,
    });
  }

  return headings;
}

