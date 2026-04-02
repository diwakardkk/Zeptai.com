import { BlogPost } from "@/types/blog";
import BlogGrid from "@/components/blog/BlogGrid";

type BlogListProps = {
  posts: BlogPost[];
};

export default function BlogList({ posts }: BlogListProps) {
  return <BlogGrid posts={posts} />;
}

