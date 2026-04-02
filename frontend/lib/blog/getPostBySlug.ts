import { BlogPost } from "@/types/blog";
import { getAllPosts } from "@/lib/blog/getAllPosts";

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

