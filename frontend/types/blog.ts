export interface BlogFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  featured?: boolean;
  videoUrl?: string;
}

export interface TableOfContentItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost extends BlogFrontmatter {
  content: string;
  html: string;
  readingTimeMinutes: number;
  tableOfContents: TableOfContentItem[];
}

