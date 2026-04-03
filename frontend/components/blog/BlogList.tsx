import { BlogPost } from "@/types/blog";
import BlogGrid from "@/components/blog/BlogGrid";

type BlogListProps = {
  commentCounts: Record<string, number>;
  posts: BlogPost[];
};

export default function BlogList({ commentCounts, posts }: BlogListProps) {
  return <BlogGrid commentCounts={commentCounts} posts={posts} />;
}
