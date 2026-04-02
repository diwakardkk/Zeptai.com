import { BlogPost } from "@/types/blog";
import { getAllPosts } from "@/lib/blog/getAllPosts";

export async function getRelatedPosts(slug: string, max = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const current = allPosts.find((post) => post.slug === slug);
  if (!current) return allPosts.filter((post) => post.slug !== slug).slice(0, max);

  return allPosts
    .filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const aScore = a.tags.filter((tag) => current.tags.includes(tag)).length;
      const bScore = b.tags.filter((tag) => current.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, max);
}

